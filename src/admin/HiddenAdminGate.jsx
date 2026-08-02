import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Key, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { AdminDashboard } from './AdminDashboard';

export const HiddenAdminGate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSetup, setIsSetup] = useState(null); // null = checking, true = already setup, false = needs setup
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check setup status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const setupRes = await axios.get('http://localhost:5000/api/auth/status');
        setIsSetup(setupRes.data.isSetup);
      } catch (err) {
        console.error('Failed to check setup status', err);
      }
    };
    checkStatus();
  }, []);

  // Global Keyboard Listener: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isSetup) {
        // Setup Master Password
        await axios.post('http://localhost:5000/api/auth/setup', { password });
        setIsSetup(true);
        // Automatically log in after setup
        await axios.post('http://localhost:5000/api/auth/login', { password }, { withCredentials: true });
        setIsAuthenticated(true);
      } else {
        // Login with Master Password
        await axios.post('http://localhost:5000/api/auth/login', { password }, { withCredentials: true });
        setIsAuthenticated(true);
      }
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // If authenticated and gate is open, render the full dashboard overlay
  if (isOpen && isAuthenticated) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, background: 'var(--bg-primary)', overflow: 'hidden' }}>
        <button onClick={async () => {
          setIsOpen(false);
          setIsAuthenticated(false);
          try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
          } catch (e) {}
        }} style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10000, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          <X size={20} />
        </button>
        <AdminDashboard />
      </div>
    );
  }

  // If gate is open but NOT authenticated, render the password prompt
  return (
    <AnimatePresence>
      {isOpen && !isAuthenticated && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9, 13, 22, 0.9)', backdropFilter: 'blur(16px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card"
            style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', textAlign: 'center', position: 'relative' }}
          >
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Shield size={30} />
            </div>

            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
              {!isSetup ? 'Set Master Password' : 'Admin Authentication'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              {!isSetup ? 'This will be your permanent admin password.' : 'Enter your master password to access the CMS.'}
            </p>

            {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder={!isSetup ? 'Create Password' : 'Password'}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', width: '100%', textAlign: 'center' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Processing...' : (!isSetup ? 'Save & Login' : 'Access Dashboard')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
