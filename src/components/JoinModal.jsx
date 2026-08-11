import React, { useState } from 'react';
import { API_URL } from '../config.js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import axios from 'axios';

export const JoinModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    branch: 'Computer Science',
    year: '1st Year',
    section: '',
    phone: '',
    skills: '',
    interest: 'Tech & Product'
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let finalResumeUrl = '';
      if (resumeFile) {
        const uploadData = new FormData();
        uploadData.append('image', resumeFile); // backend accepts 'image' key
        const uploadRes = await axios.post(`${API_URL}/api/upload`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalResumeUrl = uploadRes.data.url;
      }

      await axios.post(`${API_URL}/api/public/join`, {
        full_name: formData.name,
        email: formData.email,
        roll_number: formData.rollNo,
        department: formData.branch,
        year: formData.year,
        section: formData.section,
        phone: formData.phone,
        skills: formData.skills,
        interests: formData.interest,
        resume_url: finalResumeUrl
      });
      
      // Trigger confetti fireworks
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        console.log('Confetti triggered');
      }

      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        setFormData({
          name: '',
          email: '',
          rollNo: '',
          branch: 'Computer Science',
          year: '1st Year',
          section: '',
          phone: '',
          skills: '',
          interest: 'Tech & Product'
        });
        setResumeFile(null);
      }, 3500);
    } catch (err) {
      console.error(err);
      alert('Failed to register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          style={{
            maxWidth: '520px',
            width: '100%',
            background: 'var(--bg-glass-card)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <X size={22} />
          </button>

          {!isSubmitted ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #2563eb, #22c55e)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
                }}>
                  <Rocket size={26} />
                </div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Join College E-Cell</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Register as an official student member & unlock exclusive startup perks.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                      College Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@college.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 21X41A0501"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                      Section *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CSE-A"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                      Branch / Dept
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Tech">Information Tech</option>
                      <option value="Electronics & Comm">Electronics & Comm</option>
                      <option value="Mechanical Eng">Mechanical Eng</option>
                      <option value="Business Admin">Business Admin</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                      Year of Study
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                    Skills (separated by commas)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Python, UI Design"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                    Primary Domain Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  >
                    <option value="Tech & Product">Tech & Product Building</option>
                    <option value="Ideation & Pitching">Ideation & Pitching</option>
                    <option value="Marketing & Brand">Marketing & Branding</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Event Operations">Event Operations & Management</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                    Resume (Optional PDF/Word)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-secondary)',
                      outline: 'none'
                    }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem', padding: '0.9rem' }} disabled={submitting}>
                  {submitting ? 'Submitting Application...' : 'Submit Application'} <Sparkles size={18} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <CheckCircle size={40} />
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Welcome to E-Cell! 🎉</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Your membership application has been submitted! We will send updates to <strong>{formData.email}</strong>.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
