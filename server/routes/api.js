import express from 'express';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { verifyToken, requireSuperAdmin } from '../middleware/auth.js';
import {
  Admin, About, TeamMember, Event, Gallery,
  Registration, Message, Setting
} from '../models/index.js';

const router = express.Router();

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ecellmrcet26@gmail.com',
    pass: 'xluj nraq ppqh lcik' // App Password provided by user
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ==========================================
// PUBLIC ROUTES (For Frontend)
// ==========================================

router.get('/public/about', async (req, res) => {
  const about = await About.findOne();
  res.json(about || {});
});

router.get('/public/team', async (req, res) => {
  const team = await TeamMember.findAll();
  res.json(team);
});

router.get('/public/events', async (req, res) => {
  const events = await Event.findAll();
  res.json(events);
});

router.get('/public/gallery', async (req, res) => {
  const gallery = await Gallery.findAll();
  res.json(gallery);
});

router.get('/public/settings', async (req, res) => {
  const settings = await Setting.findOne();
  res.json(settings || {});
});

router.post('/public/join', async (req, res) => {
  try {
    const reg = await Registration.create(req.body);

    // Send email notification to ADMIN
    await transporter.sendMail({
      from: '"E-Cell Admin System" <ecellmrcet26@gmail.com>',
      to: 'vivekkotagiri59@gmail.com',
      subject: `New E-Cell Registration: ${reg.full_name}`,
      html: `
        <h2>New E-Cell Registration</h2>
        <p><strong>Name:</strong> ${reg.full_name}</p>
        <p><strong>Email:</strong> ${reg.email}</p>
        <p><strong>Roll No:</strong> ${reg.roll_number}</p>
        <p><strong>Department:</strong> ${reg.department}</p>
        <p><strong>Year:</strong> ${reg.year}</p>
        <p><strong>Interests:</strong> ${reg.interests}</p>
      `
    });

    // Send confirmation email to the USER
    await transporter.sendMail({
      from: '"E-Cell MRCET" <ecellmrcet26@gmail.com>',
      to: reg.email,
      subject: `Registration Confirmation - E-Cell MRCET`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Welcome to E-Cell MRCET!</h2>
          <p>Dear <strong>${reg.full_name}</strong>,</p>
          <p>Greetings from the Entrepreneurship Cell at MRCET!</p>
          <p>Thank you for submitting your membership application and showing your interest in joining our community. We have successfully received your details.</p>
          <p>Your application will be carefully reviewed by our board members. We will get in contact with you shortly regarding the next steps and upcoming orientation sessions.</p>
          <br/>
          <p>Best Regards,</p>
          <p><strong>The Board, E-Cell MRCET</strong></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.85em; color: #888;"><em>Please note: This is an automated confirmation email. There is no need to reply to this message.</em></p>
        </div>
      `
    });

    res.json({ message: 'Registration successful', reg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/public/contact', async (req, res) => {
  try {
    const msg = await Message.create(req.body);

    // Send email notification to ADMIN
    await transporter.sendMail({
      from: '"E-Cell Contact Form" <ecellmrcet26@gmail.com>',
      to: 'vivekkotagiri59@gmail.com',
      subject: `New Contact Message from ${msg.name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${msg.name}</p>
        <p><strong>Email:</strong> ${msg.email}</p>
        <p><strong>Subject:</strong> ${msg.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${msg.message}</p>
      `
    });

    // Send confirmation email to the USER
    await transporter.sendMail({
      from: '"E-Cell MRCET" <ecellmrcet26@gmail.com>',
      to: msg.email,
      subject: `We received your message - E-Cell MRCET`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Thank You for Contacting Us!</h2>
          <p>Dear <strong>${msg.name}</strong>,</p>
          <p>Greetings from the Entrepreneurship Cell at MRCET!</p>
          <p>We have successfully received your message regarding "<strong>${msg.subject}</strong>".</p>
          <p>Our team will review your inquiry and get back to you as soon as possible.</p>
          <br/>
          <p>Best Regards,</p>
          <p><strong>The Team, E-Cell MRCET</strong></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.85em; color: #888;"><em>Please note: This is an automated confirmation email. There is no need to reply to this message.</em></p>
        </div>
      `
    });

    res.json({ message: 'Message sent successfully', msg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================
router.use(verifyToken);

// Upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

// --- ABOUT ---
router.put('/about', async (req, res) => {
  let about = await About.findOne();
  if (about) {
    await about.update(req.body);
  } else {
    about = await About.create(req.body);
  }
  res.json(about);
});

// --- TEAM ---
router.post('/team', async (req, res) => {
  const member = await TeamMember.create(req.body);
  res.json(member);
});
router.put('/team/:id', async (req, res) => {
  await TeamMember.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true });
});
router.delete('/team/:id', async (req, res) => {
  await TeamMember.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
});

// --- EVENTS ---
router.post('/events', async (req, res) => {
  const event = await Event.create(req.body);
  res.json(event);
});
router.put('/events/:id', async (req, res) => {
  await Event.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true });
});
router.delete('/events/:id', async (req, res) => {
  await Event.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
});

// --- GALLERY ---
router.post('/gallery', async (req, res) => {
  const img = await Gallery.create(req.body);
  res.json(img);
});
router.delete('/gallery/:id', async (req, res) => {
  await Gallery.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
});

// --- REGISTRATIONS & MESSAGES ---
router.get('/registrations', async (req, res) => {
  const regs = await Registration.findAll({ order: [['submission_date', 'DESC']] });
  res.json(regs);
});
router.delete('/registrations/:id', async (req, res) => {
  await Registration.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
});
router.get('/messages', async (req, res) => {
  const msgs = await Message.findAll({ order: [['date', 'DESC']] });
  res.json(msgs);
});
router.put('/messages/:id/read', async (req, res) => {
  await Message.update({ is_read: true }, { where: { id: req.params.id } });
  res.json({ success: true });
});
router.delete('/messages/:id', async (req, res) => {
  await Message.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
});

// --- SETTINGS ---
router.put('/settings', async (req, res) => {
  let settings = await Setting.findOne();
  if (settings) {
    await settings.update(req.body);
  } else {
    settings = await Setting.create(req.body);
  }
  res.json(settings);
});

// --- SUPER ADMIN: ADMINS MANAGEMENT ---
router.get('/admins', requireSuperAdmin, async (req, res) => {
  const admins = await Admin.findAll({ attributes: { exclude: ['password_hash'] } });
  res.json(admins);
});
router.post('/admins', requireSuperAdmin, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password_hash, role });
    res.json({ id: admin.id, email: admin.email, role: admin.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/admins/:id/toggle', requireSuperAdmin, async (req, res) => {
  const admin = await Admin.findByPk(req.params.id);
  if (admin.role === 'super_admin') return res.status(403).json({ message: 'Cannot disable super admin' });
  await admin.update({ is_active: !admin.is_active });
  res.json({ success: true, is_active: admin.is_active });
});
router.put('/admins/:id/reset', requireSuperAdmin, async (req, res) => {
  const { password } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  await Admin.update({ password_hash }, { where: { id: req.params.id } });
  res.json({ success: true });
});
router.delete('/admins/:id', requireSuperAdmin, async (req, res) => {
  const admin = await Admin.findByPk(req.params.id);
  if (admin.role === 'super_admin') return res.status(403).json({ message: 'Cannot delete super admin' });
  await admin.destroy();
  res.json({ success: true });
});

export default router;
