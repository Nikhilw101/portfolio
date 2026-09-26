import { useEffect, useRef, useCallback } from 'react';

// ─── Keys ────────────────────────────────────────────────────────────────────
const VISITOR_KEY = 'portfolio_visitor_id';  // localStorage  — permanent UUID
const SESSION_KEY = 'portfolio_session_id';  // sessionStorage — one per tab/session

// Get or create permanent visitor UUID (localStorage — persists across sessions)
function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto?.randomUUID?.() ??
      ('v_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36));
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

// Get or create session ID (sessionStorage — resets on tab close/reopen)
// This is the page-view deduplication gate:
//   • Same tab, hot-reload (dev HMR, React StrictMode) → same sessionStorage → NO new page_view ✓
//   • Same tab, F5 refresh                              → same sessionStorage → NO new page_view ✓
//   • New tab / window                                  → fresh sessionStorage → YES new page_view ✓
//   • Close tab, reopen site                            → fresh sessionStorage → YES new page_view ✓
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

// Detect device details from User-Agent (no permission needed)
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
          visitorId:   visitorIdRef.current || getVisitorId(),
          sessionId:   sessionIdRef.current || getOrCreateSessionId(),
          eventType,
          target,
          dwellTimeMs: Math.round(dwellTimeMs),
          referrer:    document.referrer || 'Direct',
          device:      getDeviceDetails(),
        }),
      });
    } catch (err) {
      console.warn('[analytics] track failed:', err);
    }
  }, []);

  // Expose click tracker for use in other components
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

    // ── 2. Heartbeat — only while tab is visible, every 25s ──
    const heartbeatInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetch('/api/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId: visitorIdRef.current }),
        }).catch(() => {});
      }
    }, 25_000);

    // ── 3. Section Dwell — IntersectionObserver ───────────────
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
            // Section entered viewport — start timer
            if (!activeSectionRef.current[id]) {
              activeSectionRef.current[id] = now;
            }
          } else if (activeSectionRef.current[id]) {
            // Section left viewport — flush if meaningful (≥2s)
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
      clearInterval(heartbeatInterval);
      clearTimeout(attachTimer);
      observer.disconnect();

      // Flush any still-visible sections
      const now = Date.now();
      Object.entries(activeSectionRef.current).forEach(([id, start]) => {
        const duration = now - start;
        if (duration >= 2_000) trackEvent('section_dwell', id, duration);
      });
      activeSectionRef.current = {};
    };
  }, [trackEvent]);

  return { trackClick, trackEvent };
}
