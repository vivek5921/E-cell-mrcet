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
  origin: 'http://localhost:5173', // React dev server
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

// Seed Database
const seedDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    
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
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedDatabase();
});
