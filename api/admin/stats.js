import { connectToDatabase } from '../lib/mongodb.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_portfolio_analytics_key_2026_vit';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── Auth ──────────────────────────────────────────────────────
  const authHeader = (req.headers || {}).authorization || '';
  const queryToken = (req.query || {}).token || (req.body || {}).token;
  const token = authHeader.replace('Bearer ', '') || queryToken;

  if (!token) return res.status(401).json({ error: 'No token' });
  try { jwt.verify(token, JWT_SECRET); }
  catch { return res.status(401).json({ error: 'Invalid or expired token' }); }

  try {
    const { db } = await connectToDatabase();
    const VC  = db.collection('visitors');
    const EC  = db.collection('events');
    const HBC = db.collection('heartbeats');
    const now = new Date();

    // ── 1. SUMMARY CARDS ─────────────────────────────────────────
    //
    // Unique Visitors = number of distinct visitor documents
    //   (1 doc = 1 real person identified by their localStorage UUID)
    //
    const totalUniqueVisitors = await VC.countDocuments();

    //
    // Total Page Views = sum of pageViewCount across all visitor docs
    //   (pageViewCount increments once per browser session/tab-open)
    //
    const pvAgg = await VC
      .aggregate([{ $group: { _id: null, total: { $sum: '$pageViewCount' } } }])
      .toArray();
    const totalPageViews = pvAgg[0]?.total ?? 0;

    //
    // Live Active = visitors who pinged heartbeat in last 45 seconds
    //
    const liveThreshold = new Date(now.getTime() - 45_000);
    const liveActiveVisitors = await HBC.countDocuments({ lastPing: { $gte: liveThreshold } });

    //
    // Avg Dwell = total dwell ms across ALL section_dwell events
    //             divided by unique visitors, converted to seconds
    //
    const dwellAgg = await EC
      .aggregate([
        { $match: { eventType: 'section_dwell', dwellTimeMs: { $gt: 0 } } },
        { $group: { _id: null, totalMs: { $sum: '$dwellTimeMs' } } },
      ])
      .toArray();
    const avgDwellSeconds = (dwellAgg[0] && totalUniqueVisitors > 0)
      ? Math.round(dwellAgg[0].totalMs / 1000 / totalUniqueVisitors)
      : 0;

    // ── 2. SECTION HEATMAP ────────────────────────────────────────
    const heatmapRaw = await EC
      .aggregate([
        { $match: { eventType: 'section_dwell' } },
        { $group: { _id: '$target', totalMs: { $sum: '$dwellTimeMs' }, views: { $sum: 1 } } },
        { $sort: { totalMs: -1 } },
      ])
      .toArray();

    const sectionHeatmap = heatmapRaw.map(r => ({
      section: r._id || 'Unknown',
      seconds: Math.round(r.totalMs / 1000),
      views:   r.views,
    }));

    // ── 3. CLICK INTERACTIONS ─────────────────────────────────────
    const clickRaw = await EC
      .aggregate([
        { $match: { eventType: 'click' } },
        { $group: { _id: '$target', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const clickInteractions = clickRaw.map(r => ({
      target: r._id || 'unknown',
      count:  r.count,
    }));

    // ── 4. GEOLOCATION ────────────────────────────────────────────
    const locationBreakdown = await VC
      .aggregate([
        { $group: { _id: { country: '$location.country', city: '$location.city' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray()
      .then(arr => arr.map(a => ({
        country: a._id.country || 'Unknown',
        city:    a._id.city    || 'Unknown',
        count:   a.count,
      })));

    // ── 5. DEVICE BREAKDOWN ───────────────────────────────────────
    const deviceBreakdown = await VC
      .aggregate([
        { $group: {
          _id: { os: '$device.os', type: '$device.deviceType' },
          count: { $sum: 1 },
        }},
        { $sort: { count: -1 } },
      ])
      .toArray()
      .then(arr => arr.map(a => ({
        os:    a._id.os   || 'Unknown',
        type:  a._id.type || 'desktop',
        count: a.count,
      })));

    // ── 6. RECENT EVENTS (latest 25 — all types, no duplication) ─
    const recentActivity = await EC
      .find({})
      .sort({ timestamp: -1 })
      .limit(25)
      .toArray();

    // ── 7. HIGH-ENGAGEMENT / RECRUITER LEADS ─────────────────────
    //
    // Flagged if visitor: downloaded resume OR dwelled ≥60s in a section
    //
    const recruiterLeads = await EC
      .aggregate([
        { $match: { $or: [
          { target: 'resume_download' },
          { eventType: 'section_dwell', dwellTimeMs: { $gte: 60_000 } },
        ]}},
        { $group: {
          _id:        '$visitorId',
          lastActive: { $max: '$timestamp' },
          location:   { $first: '$location' },
          triggers:   { $addToSet: '$target' },
        }},
        { $sort: { lastActive: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      summary: { totalUniqueVisitors, totalPageViews, liveActiveVisitors, avgDwellSeconds },
      sectionHeatmap,
      clickInteractions,
      locationBreakdown,
      deviceBreakdown,
      recentActivity,
      recruiterLeads,
      generatedAt: now,
    });

  } catch (err) {
    console.error('[stats]', err.message);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
