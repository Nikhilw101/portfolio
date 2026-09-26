import { connectToDatabase } from './lib/mongodb.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-Requested-With, Accept'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      visitorId,
      sessionId,
      eventType = 'page_view',
      target = '',
      dwellTimeMs = 0,
      referrer = '',
      device = {},
    } = req.body || {};

    if (!visitorId) return res.status(400).json({ error: 'visitorId required' });

    // ── IP hash ─────────────────────────────────────────────────
    const headers = req.headers || {};
    const rawIp = String(headers['x-forwarded-for'] || '').split(',')[0].trim()
      || req.socket?.remoteAddress
      || '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex').slice(0, 16);

    // ── GeoIP (Vercel auto-injects these in production) ─────────
    const country = headers['x-vercel-ip-country'] || 'Unknown';
    const rawCity = headers['x-vercel-ip-city'];
    const city    = rawCity ? decodeURIComponent(rawCity) : 'Unknown';
    const region  = headers['x-vercel-ip-country-region'] || 'Unknown';
    const location = { country, city, region };

    const now = new Date();

    const { db } = await connectToDatabase();
    const visitorsColl  = db.collection('visitors');
    const eventsColl    = db.collection('events');

    // ── SERVER-SIDE DEDUPLICATION ────────────────────────────────
    //
    // For page_view:
    //   Use sessionId to dedup — one page_view per sessionId.
    //   sessionId is created once per browser session (tab lifetime)
    //   and sent by the client on every event.
    //   If a page_view with this sessionId already exists → reject.
    //
    // For section_dwell:
    //   Same visitorId + same target within 5s → reject.
    //
    // For clicks:
    //   Same visitorId + same target within 2s → reject.
    //
    if (eventType === 'page_view') {
      if (sessionId) {
        const alreadyTracked = await eventsColl.findOne({ sessionId, eventType: 'page_view' });
        if (alreadyTracked) {
          return res.status(200).json({ success: true, skipped: true, reason: 'session_already_tracked' });
        }
      }
    } else {
      const windowMs = eventType === 'section_dwell' ? 5_000 : 2_000;
      const since    = new Date(now.getTime() - windowMs);
      const dup = await eventsColl.findOne({
        visitorId,
        eventType,
        target,
        timestamp: { $gte: since },
      });
      if (dup) {
        return res.status(200).json({ success: true, skipped: true, reason: 'dedup_window' });
      }
    }

    // ── VISITOR UPSERT ──────────────────────────────────────────
    //
    // visitors collection semantics:
    //   visitCount    = 1 always (just marks this person exists; count docs for unique visitors)
    //   pageViewCount = total page sessions (tab opens) by this visitor
    //
    const existing = await visitorsColl.findOne({ visitorId });

    if (!existing) {
      await visitorsColl.insertOne({
        visitorId,
        ipHash,
        firstSeen:     now,
        lastSeen:      now,
        pageViewCount: 1,   // this is their first page view
        location,
        device: {
          os:         device.os || 'Unknown',
          browser:    device.browser || 'Unknown',
          deviceType: device.deviceType || 'desktop',
          screen:     device.screenResolution || '',
        },
        referrer,
      });
    } else {
      // Update last seen; increment pageViewCount only on new page_view sessions
      const update = { $set: { lastSeen: now } };
      if (eventType === 'page_view') {
        update.$inc = { pageViewCount: 1 };
      }
      await visitorsColl.updateOne({ visitorId }, update);
    }

    // ── INSERT EVENT ─────────────────────────────────────────────
    await eventsColl.insertOne({
      visitorId,
      sessionId:   sessionId || null,
      ipHash,
      eventType,
      target,
      dwellTimeMs: Math.round(Number(dwellTimeMs)) || 0,
      timestamp:   now,
      location,
      deviceType:  device.deviceType || 'desktop',
      os:          device.os || 'Unknown',
      browser:     device.browser || 'Unknown',
      referrer,
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('[track]', err.message);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
