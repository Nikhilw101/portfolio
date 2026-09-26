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
    const totalUniqueVisitors = await VC.countDocuments();

    const pvAgg = await VC
      .aggregate([{ $group: { _id: null, total: { $sum: '$pageViewCount' } } }])
      .toArray();
    const totalPageViews = pvAgg[0]?.total ?? 0;

    const liveThreshold = new Date(now.getTime() - 45_000);
    const liveActiveVisitors = await HBC.countDocuments({ lastPing: { $gte: liveThreshold } });

    const dwellAgg = await EC
      .aggregate([
        { $match: { eventType: 'section_dwell', dwellTimeMs: { $gt: 0 } } },
        { $group: { _id: null, totalMs: { $sum: '$dwellTimeMs' } } },
      ])
      .toArray();
    const avgDwellSeconds = (dwellAgg[0] && totalUniqueVisitors > 0)
      ? Math.round(dwellAgg[0].totalMs / 1000 / totalUniqueVisitors)
      : 0;

    // ── 2. TRAFFIC SOURCES ────────────────────────────────────────
    const trafficSourcesRaw = await VC
      .aggregate([
        { $group: { _id: '$trafficSource', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const trafficSources = trafficSourcesRaw.map(r => ({
      source: r._id || 'Direct / Bookmark',
      count:  r.count,
    }));

    // ── 3. UNIQUE VISITORS DIRECTORY ──────────────────────────────
    const uniqueVisitorsList = await VC
      .find({})
      .sort({ lastSeen: -1 })
      .limit(30)
      .toArray()
      .then(arr => arr.map(v => ({
        visitorId:     v.visitorId,
        firstSeen:     v.firstSeen,
        lastSeen:      v.lastSeen,
        visitCount:    v.visitCount || v.pageViewCount || 1,
        pageViewCount: v.pageViewCount || 1,
        trafficSource: v.trafficSource || 'Direct / Bookmark',
        location:      v.location || { country: 'Unknown', city: 'Unknown' },
        device:        v.device || { os: 'Unknown', browser: 'Unknown', deviceType: 'desktop' },
      })));

    // ── 4. SECTION HEATMAP ────────────────────────────────────────
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

    // ── 5. CLICK INTERACTIONS ─────────────────────────────────────
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

    // ── 6. GEOLOCATION ────────────────────────────────────────────
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

    // ── 7. DEVICE BREAKDOWN ───────────────────────────────────────
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

    // ── 8. RECENT ACTIVITY LOG (Latest 25 events) ─────────────────
    const recentActivity = await EC
      .find({})
      .sort({ timestamp: -1 })
      .limit(25)
      .toArray();

    // ── 9. HIGH-INTENT VISITORS / RECRUITER LEADS ───────────────
    const recruiterLeads = await EC
      .aggregate([
        { $match: { $or: [
          { target: { $regex: /resume/i } },
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
      trafficSources,
      uniqueVisitorsList,
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

