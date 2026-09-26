import { connectToDatabase } from './lib/mongodb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { visitorId } = req.body || {};
    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    const { db } = await connectToDatabase();
    const heartbeatsColl = db.collection('heartbeats');
    const now = new Date();

    // Upsert heartbeat for this visitor
    await heartbeatsColl.updateOne(
      { visitorId },
      { $set: { lastPing: now } },
      { upsert: true }
    );

    return res.status(200).json({ success: true, timestamp: now });
  } catch (error) {
    console.error('Heartbeat Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
