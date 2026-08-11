import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');
    const admin = await Admin.findByPk(decoded.id);
    if (!admin || !admin.is_active) {
      return res.status(401).json({ message: 'Unauthorized: Invalid admin' });
    }
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden: Super Admin access required' });
  }
  next();
};
