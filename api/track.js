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
      trafficSource = 'Direct / Bookmark',
      device = {},
    } = req.body || {};

    if (!visitorId) return res.status(400).json({ error: 'visitorId required' });

    // Format clean visitor ID string
    const cleanVisitorId = visitorId.startsWith('USR-')
      ? visitorId
      : `USR-${String(visitorId).replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase() || 'ANON'}`;

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
    if (eventType === 'page_view') {
      if (sessionId) {
        const alreadyTracked = await eventsColl.findOne({ sessionId, eventType: 'page_view' });
        if (alreadyTracked) {
          return res.status(200).json({ success: true, skipped: true, reason: 'session_already_tracked' });
        }
      }
    } else {
      const windowMs = eventType === 'section_dwell' ? 4_000 : 1_500;
      const since    = new Date(now.getTime() - windowMs);
      const dup = await eventsColl.findOne({
        visitorId: cleanVisitorId,
        eventType,
        target,
        timestamp: { $gte: since },
      });
      if (dup) {
        return res.status(200).json({ success: true, skipped: true, reason: 'dedup_window' });
      }
    }

    // ── VISITOR UPSERT & VISIT COUNT TRACKING ───────────────────
    let visitorDoc = await visitorsColl.findOne({ visitorId: cleanVisitorId });

    if (!visitorDoc) {
      const newVisitor = {
        visitorId: cleanVisitorId,
        ipHash,
        firstSeen:     now,
        lastSeen:      now,
        visitCount:    1,
        pageViewCount: 1,
        location,
        device: {
          os:         device.os || 'Unknown',
          browser:    device.browser || 'Unknown',
          deviceType: device.deviceType || 'desktop',
          screen:     device.screenResolution || '',
        },
        referrer:      referrer || '',
        trafficSource: trafficSource || 'Direct / Bookmark',
      };
      await visitorsColl.insertOne(newVisitor);
      visitorDoc = newVisitor;
    } else {
      const update = {
        $set: {
          lastSeen: now,
          location,
          device: {
            os:         device.os || visitorDoc.device?.os || 'Unknown',
            browser:    device.browser || visitorDoc.device?.browser || 'Unknown',
            deviceType: device.deviceType || visitorDoc.device?.deviceType || 'desktop',
            screen:     device.screenResolution || visitorDoc.device?.screen || '',
          },
        }
      };

      if (eventType === 'page_view') {
        update.$inc = {
          pageViewCount: 1,
          visitCount: 1
        };
      }

      if (trafficSource && visitorDoc.trafficSource === 'Direct / Bookmark' && trafficSource !== 'Direct / Bookmark') {
        update.$set.trafficSource = trafficSource;
      }

      await visitorsColl.updateOne({ visitorId: cleanVisitorId }, update);
      visitorDoc.visitCount = (visitorDoc.visitCount || 1) + (eventType === 'page_view' ? 1 : 0);
    }

    const visitNumber = visitorDoc.visitCount || 1;

    // ── INSERT EVENT ─────────────────────────────────────────────
    await eventsColl.insertOne({
      visitorId: cleanVisitorId,
      sessionId:   sessionId || null,
      visitNumber,
      isFirstVisit: visitNumber === 1,
      ipHash,
      eventType,
      target,
      dwellTimeMs: Math.round(Number(dwellTimeMs)) || 0,
      timestamp:   now,
      location,
      deviceType:  device.deviceType || 'desktop',
      os:          device.os || 'Unknown',
      browser:     device.browser || 'Unknown',
      referrer:    referrer || '',
      trafficSource: trafficSource || 'Direct / Bookmark',
    });

    return res.status(200).json({ success: true, visitorId: cleanVisitorId, visitNumber });

  } catch (err) {
    console.error('[track]', err.message);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

