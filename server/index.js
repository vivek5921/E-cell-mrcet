import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcrypt';

import sequelize from './config/database.js';
import { Admin, Setting, About } from './models/index.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'https://e-cell-mrcet.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Static folder for uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Seed Database
const seedDatabase = async () => {
  try {
    await sequelize.sync();
    
    // Default Admin
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const password_hash = await bcrypt.hash(defaultPassword, 10);
      await Admin.create({
        email: 'master@admin.com',
        password_hash,
        role: 'super_admin'
      });
      console.log(`Default admin created with password: ${defaultPassword}`);
    }

    // Default About
    const about = await About.findOne();
    if (!about) await About.create({});

    // Default Settings
    const setting = await Setting.findOne();
    if (!setting) await Setting.create({});
    
    console.log('Database synced successfully.');
  } catch (err) {
    console.error('Error syncing database:', err);
  }
};

// Start Server
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await seedDatabase();
  });
} else {
  seedDatabase().catch(err => console.error('Database sync error in serverless environment:', err));
}

export default app;

