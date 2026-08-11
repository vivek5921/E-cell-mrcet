import React, { useEffect, useState } from 'react';
import { API_URL } from '../config.js';
import axios from 'axios';
import { 
  LayoutDashboard, Info, Users, Calendar, Image as ImageIcon, 
  UserPlus, Mail, Settings, LogOut, ChevronRight, Shield, Key,
  Lock, Unlock, Trash2, Plus, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ManageEvents } from './pages/ManageEvents';
import { ManageGallery } from './pages/ManageGallery';
import { ManageTeam } from './pages/ManageTeam';
import { ManageMessages } from './pages/ManageMessages';
import { ManageMembers } from './pages/ManageMembers';
import { ManageEureka } from './pages/ManageEureka';


// --- LIVE STATS HOME ---
const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading Dashboard Stats...</div>;
  if (!stats) return <div style={{ padding: '2rem', color: '#ef4444' }}>Failed to load stats.</div>;

  const cards = [
    { label: 'Total Members', value: stats.cards.totalMembers, icon: Users, color: 'var(--color-primary)' },
    { label: 'Pending Registrations', value: stats.cards.pendingMembers, icon: UserPlus, color: 'var(--color-accent)' },
    { label: 'Events Hosted', value: stats.cards.totalEvents, icon: Calendar, color: '#3b82f6' },
    { label: 'Gallery Images', value: stats.cards.totalGallery, icon: ImageIcon, color: '#ec4899' },
    { label: 'Inquiries Received', value: stats.cards.totalMessages, icon: Mail, color: '#10b981' },
    { label: 'System Admins', value: stats.cards.totalAdmins, icon: Shield, color: '#8b5cf6' }
  ];

  // SVG Chart Dimensions
  const chartHeight = 150;
  const chartWidth = 500;
  const padding = 30;
  const maxVal = Math.max(...stats.chartData.map(d => d.registrations), 5);
  
  // Calculate SVG Points for registrations line
  const points = stats.chartData.map((d, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (stats.chartData.length - 1 || 1);
    const y = chartHeight - padding - (d.registrations * (chartHeight - padding * 2)) / maxVal;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: '700' }}>Dashboard Overview</h2>
      
      {/* Live Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card"
              style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: `4px solid ${c.color}` }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>
                <Icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: '1.1' }}>{c.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '0.2rem' }}>{c.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Chart Row */}
      <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Monthly Sign-up Progress</h3>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', background: 'var(--bg-primary)', borderRadius: '12px', padding: '10px' }}>
            {/* Grid Lines */}
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--border-color)" strokeWidth="1" />
            <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="var(--border-color)" strokeWidth="1" />

            {/* Line Path */}
            {points && (
              <>
                <polyline fill="none" stroke="var(--color-primary)" strokeWidth="3" points={points} />
                {stats.chartData.map((d, index) => {
                  const x = padding + (index * (chartWidth - padding * 2)) / (stats.chartData.length - 1 || 1);
                  const y = chartHeight - padding - (d.registrations * (chartHeight - padding * 2)) / maxVal;
                  return (
                    <g key={index}>
                      <circle cx={x} cy={y} r="5" fill="var(--color-accent)" stroke="#fff" strokeWidth="1.5" />
                      <text x={x} y={y - 10} fontSize="10" fill="var(--text-primary)" textAnchor="middle">{d.registrations}</text>
                      <text x={x} y={chartHeight - 12} fontSize="9" fill="var(--text-muted)" textAnchor="middle">{d.month}</text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

// --- MANAGE ABOUT ---
const ManageAbout = () => {
  const [formData, setFormData] = useState({ heading: '', description: '', mission: '', vision: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/public/about`)
      .then(res => {
        if (res.data) setFormData({
          heading: res.data.heading || '',
          description: res.data.description || '',
          mission: res.data.mission || '',
          vision: res.data.vision || ''
        });
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await axios.put(`${API_URL}/api/about`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update About content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2>Manage About Content</h2>
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '750px' }}>
        {success && <div style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>Content updated successfully!</div>}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Heading Title</label>
          <input type="text" className="form-input" style={{ width: '100%' }} value={formData.heading} onChange={e => setFormData({ ...formData, heading: e.target.value })} required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>General Description</label>
          <textarea rows={4} className="form-input" style={{ width: '100%', resize: 'vertical' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Mission Statement</label>
          <textarea rows={4} className="form-input" style={{ width: '100%', resize: 'vertical' }} value={formData.mission} onChange={e => setFormData({ ...formData, mission: e.target.value })} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Vision Statement</label>
          <textarea rows={4} className="form-input" style={{ width: '100%', resize: 'vertical' }} value={formData.vision} onChange={e => setFormData({ ...formData, vision: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving changes...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

// --- MANAGE SETTINGS ---
const ManageSettings = () => {
  const [formData, setFormData] = useState({ website_name: '', logo_url: '', email: '', phone: '', social_linkedin: '', social_instagram: '', footer_text: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/public/settings`)
      .then(res => {
        if (res.data) setFormData({
          website_name: res.data.website_name || '',
          logo_url: res.data.logo_url || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          social_linkedin: res.data.social_linkedin || '',
          social_instagram: res.data.social_instagram || '',
          footer_text: res.data.footer_text || ''
        });
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await axios.put(`${API_URL}/api/settings`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update Settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2>Manage Platform Settings</h2>
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '750px' }}>
        {success && <div style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>Settings saved successfully!</div>}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Website Name</label>
            <input type="text" className="form-input" style={{ width: '100%' }} value={formData.website_name} onChange={e => setFormData({ ...formData, website_name: e.target.value })} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Logo Image URL</label>
            <input type="text" className="form-input" style={{ width: '100%' }} value={formData.logo_url} onChange={e => setFormData({ ...formData, logo_url: e.target.value })} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Contact Email</label>
            <input type="email" className="form-input" style={{ width: '100%' }} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Contact Phone</label>
            <input type="text" className="form-input" style={{ width: '100%' }} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>LinkedIn Profile URL</label>
            <input type="text" className="form-input" style={{ width: '100%' }} value={formData.social_linkedin} onChange={e => setFormData({ ...formData, social_linkedin: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Instagram Profile URL</label>
            <input type="text" className="form-input" style={{ width: '100%' }} value={formData.social_instagram} onChange={e => setFormData({ ...formData, social_instagram: e.target.value })} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Footer Copyright Text</label>
          <input type="text" className="form-input" style={{ width: '100%' }} value={formData.footer_text} onChange={e => setFormData({ ...formData, footer_text: e.target.value })} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving changes...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

// --- SUPER ADMIN: MANAGE ADMINS ---
const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admins`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/admins`, { email, password, role }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setEmail('');
      setPassword('');
      setRole('admin');
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await axios.put(`${API_URL}/api/admins/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert('Failed to lock/unlock admin');
    }
  };

  const handleResetPassword = async (id) => {
    const newPass = window.prompt('Enter new password for this admin:');
    if (!newPass) return;
    try {
      await axios.put(`${API_URL}/api/admins/${id}/reset`, { password: newPass }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      alert('Password reset successful');
    } catch (err) {
      console.error(err);
      alert('Failed to reset password');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this administrator?')) return;
    try {
      await axios.delete(`${API_URL}/api/admins/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert('Failed to delete admin');
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading Accounts...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2>System Administrators Control</h2>
      
      {/* Create form */}
      <form onSubmit={handleCreate} className="glass-card" style={{ padding: '2rem', marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 120px 140px', gap: '1rem', alignItems: 'end', maxWidth: '850px' }}>
        <h3 style={{ gridColumn: 'span 4', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Provision New Admin</h3>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Email Address</label>
          <input type="email" placeholder="email@address.com" className="form-input" style={{ width: '100%' }} value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Temporary Password</label>
          <input type="password" placeholder="••••••••" className="form-input" style={{ width: '100%' }} value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>System Role</label>
          <select className="form-input" style={{ width: '100%' }} value={role} onChange={e => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ height: '42px' }} disabled={submitting}>
          <Plus size={16} /> Add User
        </button>
      </form>

      {/* List */}
      <div style={{ marginTop: '2.5rem', maxWidth: '850px' }}>
        <h3>Current System Accounts</h3>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: 'var(--bg-primary)', borderRadius: '12px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: 'var(--color-primary-light)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Email</th>
              <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Role</th>
              <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(usr => (
              <tr key={usr.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{usr.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', fontWeight: '600',
                    background: usr.role === 'super_admin' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    color: usr.role === 'super_admin' ? '#a78bfa' : '#60a5fa'
                  }}>{usr.role}</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: usr.is_active ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {usr.is_active ? <Unlock size={14} /> : <Lock size={14} />}
                    {usr.is_active ? 'Active' : 'Locked'}
                  </span>
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  {usr.role !== 'super_admin' && (
                    <>
                      <button onClick={() => handleToggleActive(usr.id)} className="btn btn-secondary" style={{ padding: '0.4rem', border: 'none', background: usr.is_active ? '#ef4444' : '#10b981', color: '#fff' }} title={usr.is_active ? 'Lock Admin' : 'Unlock Admin'}>
                        {usr.is_active ? <Lock size={15} /> : <Unlock size={15} />}
                      </button>
                      <button onClick={() => handleDelete(usr.id)} className="btn btn-secondary" style={{ padding: '0.4rem', border: 'none', background: '#e11d48', color: '#fff' }} title="Delete Admin">
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                  <button onClick={() => handleResetPassword(usr.id)} className="btn btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'var(--bg-glass-card)' }} title="Reset Password">
                    <Key size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- CORE PANEL ---
export const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
        setAdmin(res.data.admin);
      } catch (err) {
        console.error(err);
        window.location.reload();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
      localStorage.removeItem('adminToken');
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: '40px', height: '40px', border: '3px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
    </div>
  );
  
  if (!admin) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'eureka', label: 'Eureka! Management', icon: Trophy },
    { id: 'about', label: 'About', icon: Info },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'members', label: 'Members', icon: UserPlus },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (admin.role === 'super_admin') {
    navItems.push({ id: 'admins', label: 'Admins', icon: Shield });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome />;
      case 'eureka': return <ManageEureka />;
      case 'about': return <ManageAbout />;
      case 'team': return <ManageTeam />;
      case 'events': return <ManageEvents />;
      case 'gallery': return <ManageGallery />;
      case 'members': return <ManageMembers />;
      case 'messages': return <ManageMessages />;
      case 'settings': return <ManageSettings />;
      case 'admins': return <ManageAdmins />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)', width: '100%', fontFamily: 'var(--font-sans)' }}>
      {/* Innovative Sidebar */}
      <motion.div 
        initial={{ x: -250 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{ width: '280px', background: 'var(--bg-glass-card)', backdropFilter: 'blur(20px)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 24px rgba(0,0,0,0.1)' }}
      >
        <div style={{ padding: '2.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
            E
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>E-Cell CMS</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{admin.role === 'super_admin' ? 'Super Admin' : 'Admin Mode'}</p>
          </div>
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem',
                  borderRadius: '12px', textDecoration: 'none', border: 'none', cursor: 'pointer',
                  background: isActive ? 'linear-gradient(90deg, var(--color-primary-light), transparent)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '600' : '500',
                  position: 'relative', overflow: 'hidden', textAlign: 'left', width: '100%', fontSize: '0.95rem'
                }}
              >
                {isActive && <motion.div layoutId="activeNavIndicator" style={{ position: 'absolute', left: 0, top: '15%', bottom: '15%', width: '4px', background: 'var(--color-primary)', borderRadius: '0 4px 4px 0' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Icon size={18} style={{ opacity: isActive ? 1 : 0.7 }} /> 
                  {item.label}
                </div>
                {isActive && <ChevronRight size={16} opacity={0.5} />}
              </motion.button>
            )
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: '#ef4444' }} 
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout} 
            className="btn btn-secondary" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '12px', padding: '0.85rem', border: '1px solid var(--border-color)', transition: 'all 0.3s' }}
          >
            <LogOut size={16} /> Lock Panel
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
            transition={{ duration: 0.3 }}
            style={{ minHeight: '100%', paddingBottom: '3rem' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
