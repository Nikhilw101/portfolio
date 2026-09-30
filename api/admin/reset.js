import { connectToDatabase } from '../lib/mongodb.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_portfolio_analytics_key_2026_vit';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = (req.headers || {}).authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'No token' });
  try { 
    jwt.verify(token, JWT_SECRET); 
  } catch { 
    return res.status(401).json({ error: 'Invalid or expired token' }); 
  }

  try {
    const { db } = await connectToDatabase();
    
    // Clear all tracking collections, preserve admin logins
    await db.collection('visitors').deleteMany({});
    await db.collection('events').deleteMany({});
    await db.collection('heartbeats').deleteMany({});

    return res.status(200).json({ success: true, message: 'All analytics data reset successfully!' });
  } catch (err) {
    console.error('[reset]', err.message);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
