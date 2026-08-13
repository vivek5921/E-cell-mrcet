import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { verifyToken, requireSuperAdmin } from '../middleware/auth.js';
import {
  Admin, About, TeamMember, Event, Gallery,
  Registration, Message, Setting,
  EurekaTeam, EurekaParticipant, EurekaJudge, EurekaScore
} from '../models/index.js';
import sequelize from '../config/database.js';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if Cloudinary environment variables are set
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_URL ||
  (process.env.CLOUDINARY_CLOUD_NAME &&
   process.env.CLOUDINARY_API_KEY &&
   process.env.CLOUDINARY_API_SECRET)
);

let storage;

if (isCloudinaryConfigured) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'ecell_uploads',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif']
    }
  });
  console.log('Multer configured to use Cloudinary for image uploads.');
} else {
  // Setup Multer for local disk storage fallback
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  console.log('Multer configured to use local disk storage.');
}

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

// Public Eureka Registration
router.post('/public/eureka/register', async (req, res) => {
  try {
    const {
      team_name,
      startup_name,
      startup_description,
      eureka_rid,
      eureka_team_id,
      leader_name,
      leader_email,
      leader_phone,
      college,
      department,
      year,
      team_size,
      members,
      consent
    } = req.body;

    // Check for duplicate RID
    const existing = await EurekaTeam.findOne({ where: { eureka_rid } });
    if (existing) {
      return res.status(400).json({ message: 'A team with this Eureka RID is already registered.' });
    }

    // Save team and participants inside a transaction
    const result = await sequelize.transaction(async (t) => {
      const team = await EurekaTeam.create({
        team_name,
        startup_name,
        startup_description,
        eureka_rid,
        eureka_team_id,
        leader_name,
        leader_email,
        leader_phone,
        college,
        department,
        year,
        team_size: parseInt(team_size) || 1,
        consent
      }, { transaction: t });

      // Add leader as a member
      await EurekaParticipant.create({
        team_id: team.id,
        name: leader_name,
        email: leader_email,
        phone: leader_phone,
        department,
        year,
        is_leader: true
      }, { transaction: t });

      // Add other team members
      if (members && members.length > 0) {
        for (const m of members) {
          if (m && m.name) {
            await EurekaParticipant.create({
              team_id: team.id,
              name: m.name,
              email: m.email,
              phone: m.phone,
              department: m.department,
              year: m.year,
              is_leader: false
            }, { transaction: t });
          }
        }
      }

      return team;
    });

    // Send email notification to ADMIN
    try {
      await transporter.sendMail({
        from: '"E-Cell Admin System" <ecellmrcet26@gmail.com>',
        to: 'vivekkotagiri59@gmail.com',
        subject: `New Eureka Pitch Competition Registration: ${result.team_name}`,
        html: `
          <h2>New Eureka Pitch Competition Registration</h2>
          <p><strong>Team Name:</strong> ${result.team_name}</p>
          <p><strong>Startup Name:</strong> ${result.startup_name}</p>
          <p><strong>Eureka RID:</strong> ${result.eureka_rid}</p>
          <p><strong>Leader Name:</strong> ${result.leader_name}</p>
          <p><strong>Leader Email:</strong> ${result.leader_email}</p>
          <p><strong>Leader Phone:</strong> ${result.leader_phone}</p>
          <p><strong>College:</strong> ${result.college}</p>
          <p><strong>Team Size:</strong> ${result.team_size}</p>
        `
      });
    } catch (e) {
      console.error('Failed to send admin email:', e);
    }

    // Send confirmation email to the USER
    try {
      await transporter.sendMail({
        from: '"E-Cell MRCET" <ecellmrcet26@gmail.com>',
        to: result.leader_email,
        subject: `Eureka! Pitching Competition Registration Confirmation - E-Cell MRCET`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Welcome to Eureka! Pitching Competition</h2>
            <p>Dear <strong>${result.leader_name}</strong>,</p>
            <p>Greetings from the Entrepreneurship Cell at MRCET!</p>
            <p>Thank you for completing your college registration for the Eureka! Pitching Competition for your team <strong>${result.team_name}</strong> (RID: <strong>${result.eureka_rid}</strong>).</p>
            <p>We have successfully received your details. Your registration will be screened, and we will update you shortly regarding the pitching schedule and next rounds.</p>
            <br/>
            <p>Best Regards,</p>
            <p><strong>The Board, E-Cell MRCET</strong></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.85em; color: #888;"><em>Please note: This is an automated confirmation email. There is no need to reply to this message.</em></p>
          </div>
        `
      });
    } catch (e) {
      console.error('Failed to send confirmation email:', e);
    }

    res.json({ message: 'Registration successful', team: result });
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
  // Cloudinary storage returns the full URL in req.file.path. Local disk storage returns req.file.filename.
  const url = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
  res.json({ url });
});

// Stats endpoint for Dashboard
router.get('/stats', async (req, res) => {
  try {
    const totalMembers = await Registration.count();
    const pendingMembers = await Registration.count({ where: { status: 'pending' } });
    const totalEvents = await Event.count();
    const totalGallery = await Gallery.count();
    const totalMessages = await Message.count();
    const totalAdmins = await Admin.count();

    // Group registrations by month
    const registrations = await Registration.findAll({
      attributes: ['submission_date'],
      order: [['submission_date', 'ASC']]
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = {};
    
    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mLabel = `${months[d.getMonth()]} ${d.getFullYear()}`;
      monthlyStats[mLabel] = 0;
    }

    registrations.forEach(r => {
      const d = new Date(r.submission_date);
      const mLabel = `${months[d.getMonth()]} ${d.getFullYear()}`;
      if (monthlyStats[mLabel] !== undefined) {
        monthlyStats[mLabel]++;
      }
    });

    const chartData = Object.keys(monthlyStats).map(key => ({
      month: key,
      registrations: monthlyStats[key],
      visitors: Math.floor(monthlyStats[key] * 12 + 150 + Math.random() * 50)
    }));

    res.json({
      cards: {
        totalMembers,
        pendingMembers,
        totalEvents,
        totalGallery,
        totalMessages,
        totalAdmins
      },
      chartData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update Registration Status (Accept/Reject)
router.put('/registrations/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    await Registration.update({ status }, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
router.put('/gallery/:id', async (req, res) => {
  try {
    await Gallery.update(req.body, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

// ==========================================
// EUREKA MODULE PROTECTED ADMIN ROUTES
// ==========================================

// Eureka Stats Endpoint
router.get('/eureka/stats', async (req, res) => {
  try {
    const allTeams = await EurekaTeam.findAll();
    const totalTeams = allTeams.length;
    const totalStudents = await EurekaParticipant.count();
    
    const eurekaReg = allTeams.filter(t => t.eureka_rid && t.eureka_rid.trim() !== '' && t.eureka_team_id && t.eureka_team_id.trim() !== '').length;
    const collegeReg = await EurekaTeam.count({ where: { status: 'College Registration' } });
    const screening = await EurekaTeam.count({ where: { status: 'Screening' } });
    const shortlisted = await EurekaTeam.count({ where: { status: 'Shortlisted' } });
    const pitching = await EurekaTeam.count({ where: { status: 'Pitching' } });
    const top20 = await EurekaTeam.count({ where: { status: 'Top 20' } });
    const top3 = await EurekaTeam.count({ where: { status: 'Top 3' } });
    const winner = await EurekaTeam.count({ where: { status: 'Winner' } });

    res.json({
      totalTeams,
      totalStudents,
      statuses: {
        eurekaReg,
        collegeReg,
        screening,
        shortlisted,
        pitching,
        top20,
        top3,
        winner
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eureka Teams list with filtering and members
router.get('/eureka/teams', async (req, res) => {
  try {
    const { status, search } = req.query;
    const whereClause = {};
    if (status && status !== 'All') {
      whereClause.status = status;
    }
    
    let teams = await EurekaTeam.findAll({
      where: whereClause,
      include: [
        { model: EurekaParticipant, as: 'members' },
        { 
          model: EurekaScore, 
          as: 'scores',
          include: [{ model: EurekaJudge }]
        }
      ],
      order: [['registration_date', 'DESC']]
    });

    if (search) {
      const q = search.toLowerCase();
      teams = teams.filter(t => 
        t.team_name.toLowerCase().includes(q) ||
        t.startup_name.toLowerCase().includes(q) ||
        t.eureka_rid.toLowerCase().includes(q) ||
        t.leader_name.toLowerCase().includes(q) ||
        t.leader_email.toLowerCase().includes(q)
      );
    }

    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search by RID
router.get('/eureka/teams/search', async (req, res) => {
  try {
    const { rid } = req.query;
    if (!rid) {
      return res.status(400).json({ message: 'RID query parameter is required' });
    }
    let team = await EurekaTeam.findOne({
      where: { eureka_rid: rid },
      include: [{ model: EurekaParticipant, as: 'members' }]
    });
    if (!team) {
      team = await EurekaTeam.findOne({
        where: { eureka_team_id: rid },
        include: [{ model: EurekaParticipant, as: 'members' }]
      });
    }
    if (!team) {
      return res.status(404).json({ message: 'No team found with this RID or Team ID' });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Team (details, status, admin notes)
router.put('/eureka/teams/:id', async (req, res) => {
  try {
    const { team_name, startup_name, startup_description, status, admin_notes, eureka_rid, eureka_team_id } = req.body;
    const team = await EurekaTeam.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    await team.update({
      team_name: team_name !== undefined ? team_name : team.team_name,
      startup_name: startup_name !== undefined ? startup_name : team.startup_name,
      startup_description: startup_description !== undefined ? startup_description : team.startup_description,
      status: status !== undefined ? status : team.status,
      admin_notes: admin_notes !== undefined ? admin_notes : team.admin_notes,
      eureka_rid: eureka_rid !== undefined ? eureka_rid : team.eureka_rid,
      eureka_team_id: eureka_team_id !== undefined ? eureka_team_id : team.eureka_team_id
    });

    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Team (cascade deletes participants and scores)
router.delete('/eureka/teams/:id', async (req, res) => {
  try {
    const team = await EurekaTeam.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    // Manually delete dependent records to bypass SQLite foreign key constraint failures
    await EurekaScore.destroy({ where: { team_id: req.params.id } });
    await EurekaParticipant.destroy({ where: { team_id: req.params.id } });
    
    await team.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Judges list with scores
router.get('/eureka/judges', async (req, res) => {
  try {
    const judges = await EurekaJudge.findAll({
      include: [{ model: EurekaScore, as: 'scores' }]
    });
    res.json(judges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Judge
router.post('/eureka/judges', async (req, res) => {
  try {
    const { name, email, specialization } = req.body;
    const judge = await EurekaJudge.create({ name, email, specialization });
    res.json(judge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Judge
router.delete('/eureka/judges/:id', async (req, res) => {
  try {
    const judge = await EurekaJudge.findByPk(req.params.id);
    if (!judge) return res.status(404).json({ message: 'Judge not found' });
    
    // Manually delete dependent score records to bypass SQLite foreign key constraint failures
    await EurekaScore.destroy({ where: { judge_id: req.params.id } });
    
    await judge.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enter / Update Score
router.post('/eureka/scores', async (req, res) => {
  try {
    const { team_id, judge_id, score, feedback } = req.body;
    
    let eurekaScore = await EurekaScore.findOne({
      where: { team_id, judge_id }
    });

    if (eurekaScore) {
      return res.status(400).json({ message: 'This judge has already evaluated this team. Duplicate evaluations are not permitted.' });
    }

    eurekaScore = await EurekaScore.create({ team_id, judge_id, score, feedback });

    res.json({ success: true, score: eurekaScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get scores for a team
router.get('/eureka/scores/:teamId', async (req, res) => {
  try {
    const scores = await EurekaScore.findAll({
      where: { team_id: req.params.teamId },
      include: [{ model: EurekaJudge }]
    });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
