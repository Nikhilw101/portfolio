import { useEffect, useRef, useCallback } from 'react';

// ─── Keys ────────────────────────────────────────────────────────────────────
const VISITOR_KEY = 'portfolio_visitor_id';  // localStorage  — permanent user ID
const SESSION_KEY = 'portfolio_session_id';  // sessionStorage — one per tab/session

// Format or create permanent Visitor ID (localStorage — persists across sessions)
function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    // Generate clean readable user ID format: USR-XXXXXX
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    id = `USR-${randomHex}`;
    localStorage.setItem(VISITOR_KEY, id);
  } else if (!id.startsWith('USR-')) {
    // Migrate old ID format to USR- format if needed
    const shortCode = id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase() || Math.random().toString(36).substring(2, 8).toUpperCase();
    id = `USR-${shortCode}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

// Get or create session ID (sessionStorage — resets on tab close/reopen)
function getOrCreateSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = 's_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

// Returns true only the FIRST call within this browser session
function isNewSession() {
  const tracked = sessionStorage.getItem('portfolio_pv_tracked');
  if (tracked) return false;
  sessionStorage.setItem('portfolio_pv_tracked', '1');
  return true;
}

// Detect traffic source from referrer and URL params
function getTrafficSource() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || urlParams.get('ref') || urlParams.get('source');
    if (utmSource) {
      return `Campaign / ${utmSource}`;
    }

    const ref = document.referrer;
    if (!ref) return 'Direct / Bookmark';

    const url = new URL(ref);
    const host = url.hostname.toLowerCase();

    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('github')) return 'GitHub';
    if (host.includes('google')) return 'Google Search';
    if (host.includes('bing') || host.includes('yahoo') || host.includes('duckduckgo')) return 'Search Engine';
    if (host.includes('t.co') || host.includes('twitter') || host.includes('x.com')) return 'Twitter / X';
    if (host.includes('instagram')) return 'Instagram';
    if (host.includes('facebook')) return 'Facebook';
    if (host.includes('youtube')) return 'YouTube';
    if (host === window.location.hostname) return 'Internal';

    return host.replace(/^www\./, '');
  } catch {
    return 'Direct / Bookmark';
  }
}

// Detect device details from User-Agent
function getDeviceDetails() {
  const ua = navigator.userAgent;

  let os = 'Windows';
  if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Mac/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua) && !/Android/i.test(ua)) os = 'Linux';

  let browser = 'Chrome';
  if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';

  return {
    os,
    browser,
    deviceType: /Android|iPhone|iPad|iPod|Mobile/i.test(ua) ? 'mobile' : 'desktop',
    screenResolution: `${screen.width}x${screen.height}`,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAnalytics() {
  const visitorIdRef     = useRef(null);
  const sessionIdRef     = useRef(null);
  const activeSectionRef = useRef({});

  // ── Core POST helper ──────────────────────────────────────────
  const trackEvent = useCallback(async (eventType, target = '', dwellTimeMs = 0) => {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId:     visitorIdRef.current || getVisitorId(),
          sessionId:     sessionIdRef.current || getOrCreateSessionId(),
          eventType,
          target,
          dwellTimeMs:   Math.round(dwellTimeMs),
          referrer:      document.referrer || '',
          trafficSource: getTrafficSource(),
          device:        getDeviceDetails(),
        }),
      });
    } catch (err) {
      console.warn('[analytics] track failed:', err);
    }
  }, []);

  // Expose explicit click tracker
  const trackClick = useCallback(
    (targetName) => trackEvent('click', targetName),
    [trackEvent]
  );

  // ── Main Effect ───────────────────────────────────────────────
  useEffect(() => {
    // Initialise IDs
    visitorIdRef.current = getVisitorId();
    sessionIdRef.current = getOrCreateSessionId();

    // ── 1. Page View — exactly once per browser session tab ──
    if (isNewSession()) {
      trackEvent('page_view', 'portfolio_main');
    }

    // ── 2. Automatic Global Click Listener ────────────────────
    const handleGlobalClick = (e) => {
      const targetEl = e.target.closest('a, button, [role="button"], [data-track]');
      if (!targetEl) return;

      // Extract meaningful label for the click event
      let label = targetEl.getAttribute('data-track') ||
                  targetEl.getAttribute('aria-label') ||
                  targetEl.title ||
                  targetEl.innerText?.trim() ||
                  targetEl.getAttribute('href') ||
                  targetEl.id ||
                  'interactive_element';

      // Clean string
      label = label.replace(/\s+/g, ' ').trim();
      if (label.length > 50) label = label.slice(0, 50) + '...';

      if (label) {
        trackClick(label);
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });

    // ── 3. Heartbeat — only while tab is visible, every 25s ──
    const heartbeatInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetch('/api/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId: visitorIdRef.current }),
        }).catch(() => {});
      }
    }, 25_000);

    // ── 4. Section Dwell — IntersectionObserver ───────────────
    const SECTIONS = [
      'home', 'about', 'projects', 'publications',
      'experience', 'skills', 'achievements', 'contact',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id =
            entry.target.id ||
            entry.target.getAttribute('data-section') ||
            'unknown';
          const now = Date.now();

          if (entry.isIntersecting) {
            if (!activeSectionRef.current[id]) {
              activeSectionRef.current[id] = now;
            }
          } else if (activeSectionRef.current[id]) {
            const duration = now - activeSectionRef.current[id];
            delete activeSectionRef.current[id];
            if (duration >= 2_000) {
              trackEvent('section_dwell', id, duration);
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    const attachTimer = setTimeout(() => {
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 800);

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      clearInterval(heartbeatInterval);
      clearTimeout(attachTimer);
      observer.disconnect();

      const now = Date.now();
      Object.entries(activeSectionRef.current).forEach(([id, start]) => {
        const duration = now - start;
        if (duration >= 2_000) trackEvent('section_dwell', id, duration);
      });
      activeSectionRef.current = {};
    };
  }, [trackEvent, trackClick]);

  return { trackClick, trackEvent };
}

