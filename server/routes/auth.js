import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    const adminCount = await Admin.count();
    res.json({ isSetup: adminCount > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/setup', async (req, res) => {
  try {
    const adminCount = await Admin.count();
    if (adminCount > 0) {
      return res.status(400).json({ message: 'Master password already set' });
    }
    const { password } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    await Admin.create({
      email: 'master@admin.com',
      password_hash,
      role: 'super_admin'
    });
    res.json({ message: 'Master password set successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!admin.is_active) {
      return res.status(403).json({ message: 'Account is locked' });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET || 'fallback_secret_key_123',
      { expiresIn: '1d' }
    );

    res.json({ 
      message: 'Logged in successfully', 
      token,
      admin: { id: admin.id, role: admin.role, email: admin.email } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', verifyToken, (req, res) => {
  res.json({ admin: { id: req.admin.id, role: req.admin.role } });
});

export default router;
