import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Info, Users, Calendar, Image as ImageIcon, 
  UserPlus, Mail, Settings, LogOut, Shield
} from 'lucide-react';

import { ManageEvents } from './pages/ManageEvents';
import { ManageGallery } from './pages/ManageGallery';
import { ManageTeam } from './pages/ManageTeam';
import { ManageMessages } from './pages/ManageMessages';
import { ManageMembers } from './pages/ManageMembers';

const DashboardHome = () => <div style={{ padding: '2rem' }}><h2>Welcome to Admin Dashboard</h2></div>;
const ManageAbout = () => <div style={{ padding: '2rem' }}><h2>About Management</h2></div>;
const ManageSettings = () => <div style={{ padding: '2rem' }}><h2>Settings</h2></div>;

export const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
        setAdmin(res.data.admin);
      } catch (err) {
        window.location.reload(); // Logout if auth fails
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (!admin) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'about', label: 'About', icon: Info },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'members', label: 'Members', icon: UserPlus },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome />;
      case 'about': return <ManageAbout />;
      case 'team': return <ManageTeam />;
      case 'events': return <ManageEvents />;
      case 'gallery': return <ManageGallery />;
      case 'members': return <ManageMembers />;
      case 'messages': return <ManageMessages />;
      case 'settings': return <ManageSettings />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)', width: '100%' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: 'var(--bg-primary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>E-Cell CMS</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Master Admin</p>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)', textDecoration: 'none', border: 'none', cursor: 'pointer',
                  background: isActive ? 'var(--color-primary-light)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s', textAlign: 'left', width: '100%', fontSize: '0.95rem'
                }}
              >
                <Icon size={18} /> {item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Lock Panel
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
};
