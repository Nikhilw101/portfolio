import { connectToDatabase } from '../lib/mongodb.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_portfolio_analytics_key_2026_vit';
const DEFAULT_EMAIL = 'nikhil.wagh24@vit.edu';
const DEFAULT_PASS = 'nikhil.wagh24@vit.edu';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action = 'login', email, password, newPassword, securityAnswer, token } = req.body || {};
    const { db } = await connectToDatabase();
    const adminColl = db.collection('admin_users');

    // Auto-seed default admin if not exists
    let admin = await adminColl.findOne({ email: (email || DEFAULT_EMAIL).toLowerCase() });
    if (!admin && (!email || email.toLowerCase() === DEFAULT_EMAIL)) {
      const passwordHash = await bcrypt.hash(DEFAULT_PASS, 10);
      const securityAnswerHash = await bcrypt.hash('vit', 10);
      admin = {
        email: DEFAULT_EMAIL,
        passwordHash,
        securityQuestion: 'What institution do you belong to?',
        securityAnswerHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await adminColl.insertOne(admin);
    }

    // ACTION 1: VERIFY TOKEN
    if (action === 'verify_token') {
      const headers = req.headers || {};
      const authToken = token || (headers.authorization ? headers.authorization.replace('Bearer ', '') : '');
      if (!authToken) {
        return res.status(401).json({ valid: false, error: 'No token provided' });
      }
      try {
        const decoded = jwt.verify(authToken, JWT_SECRET);
        return res.status(200).json({ valid: true, user: { email: decoded.email } });
      } catch (err) {
        return res.status(401).json({ valid: false, error: 'Invalid or expired token' });
      }
    }

    // ACTION 2: LOGIN
    if (action === 'login') {
      const targetEmail = (email || '').toLowerCase().trim();
      if (!targetEmail || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      admin = await adminColl.findOne({ email: targetEmail });
      if (!admin) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const authToken = jwt.sign(
        { email: admin.email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        token: authToken,
        email: admin.email,
        securityQuestion: admin.securityQuestion || 'What institution do you belong to?',
      });
    }

    // ACTION 3: RESET PASSWORD
    if (action === 'reset_password') {
      const targetEmail = (email || DEFAULT_EMAIL).toLowerCase().trim();
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }

      admin = await adminColl.findOne({ email: targetEmail });
      if (!admin) {
        return res.status(404).json({ error: 'Admin account not found' });
      }

      // Verify security answer if provided, or verify old password
      let authorized = false;
      if (password) {
        authorized = await bcrypt.compare(password, admin.passwordHash);
      } else if (securityAnswer) {
        authorized = await bcrypt.compare(securityAnswer.toLowerCase().trim(), admin.securityAnswerHash);
      }

      if (!authorized) {
        return res.status(401).json({ error: 'Incorrect verification details or security answer' });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await adminColl.updateOne(
        { email: targetEmail },
        { $set: { passwordHash: newPasswordHash, updatedAt: new Date() } }
      );

      return res.status(200).json({ success: true, message: 'Password reset successfully!' });
    }

    // ACTION 4: UPDATE SECURITY QUESTION
    if (action === 'update_security') {
      const targetEmail = (email || DEFAULT_EMAIL).toLowerCase().trim();
      const { question, answer } = req.body || {};
      if (!question || !answer) {
        return res.status(400).json({ error: 'Question and answer are required' });
      }

      const answerHash = await bcrypt.hash(answer.toLowerCase().trim(), 10);
      await adminColl.updateOne(
        { email: targetEmail },
        { $set: { securityQuestion: question, securityAnswerHash: answerHash, updatedAt: new Date() } }
      );

      return res.status(200).json({ success: true, message: 'Security question updated!' });
    }

    return res.status(400).json({ error: 'Invalid action requested' });
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
