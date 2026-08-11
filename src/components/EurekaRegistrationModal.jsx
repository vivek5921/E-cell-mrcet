import React, { useState } from 'react';
import { API_URL } from '../config.js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, CheckCircle, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import axios from 'axios';

export const EurekaRegistrationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [teamName, setTeamName] = useState('');
  const [startupName, setStartupName] = useState('');
  const [startupDescription, setStartupDescription] = useState('');
  const [eurekaRid, setEurekaRid] = useState('');
  const [eurekaTeamId, setEurekaTeamId] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [college, setCollege] = useState('Mallareddy College of Engineering and Technology (MRCET)');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [teamSize, setTeamSize] = useState(1);
  const [members, setMembers] = useState([]);
  const [consent, setConsent] = useState(false);

  if (!isOpen) return null;

  const handleTeamSizeChange = (newSize) => {
    const size = parseInt(newSize) || 1;
    setTeamSize(size);
    
    // Initialize or adjust members array
    const currentMembers = [...members];
    if (currentMembers.length < size - 1) {
      // Add empty member objects
      const diff = (size - 1) - currentMembers.length;
      for (let i = 0; i < diff; i++) {
        currentMembers.push({ 
          name: '', 
          email: '', 
          phone: '', 
          department: 'Computer Science & Engineering', 
          year: '3rd Year' 
        });
      }
    } else if (currentMembers.length > size - 1) {
      // Trim members array
      currentMembers.splice(size - 1);
    }
    setMembers(currentMembers);
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setMembers(updated);
  };

  const validateStep = (s) => {
    setError('');
    if (s === 1) {
      if (!teamName.trim() || !startupName.trim() || !startupDescription.trim()) {
        setError('Please fill in all idea and registration details.');
        return false;
      }
      if (!eurekaRid.trim() && !eurekaTeamId.trim()) {
        setError('Please enter at least your Eureka RID or Eureka Team ID.');
        return false;
      }
    } else if (s === 2) {
      if (!leaderName.trim() || !leaderEmail.trim() || !leaderPhone.trim() || !college.trim() || !department.trim() || !year) {
        setError('Please fill in all team leader contact details.');
        return false;
      }
      if (teamSize > 1) {
        for (let i = 0; i < members.length; i++) {
          const m = members[i];
          if (!m.name.trim() || !m.email.trim() || !m.phone.trim() || !m.department.trim() || !m.year) {
            setError(`Please fill in all details for Member #${i + 2}.`);
            return false;
          }
        }
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) {
      setError('You must consent to the sharing of your registration details.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      await axios.post(`${API_URL}/api/public/eureka/register`, {
        team_name: teamName,
        startup_name: startupName,
        startup_description: startupDescription,
        eureka_rid: eurekaRid,
        eureka_team_id: eurekaTeamId,
        leader_name: leaderName,
        leader_email: leaderEmail,
        leader_phone: leaderPhone,
        college,
        department,
        year,
        team_size: teamSize,
        members,
        consent
      });

      // Confetti fire!
      try {
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch {
        console.log('Confetti triggered');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        resetForm();
      }, 4000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit registration. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setTeamName('');
    setStartupName('');
    setStartupDescription('');
    setEurekaRid('');
    setEurekaTeamId('');
    setLeaderName('');
    setLeaderEmail('');
    setLeaderPhone('');
    setCollege('Mallareddy College of Engineering and Technology (MRCET)');
    setDepartment('Computer Science & Engineering');
    setYear('3rd Year');
    setTeamSize(1);
    setMembers([]);
    setConsent(false);
    setError('');
  };

  // Helper input styling
  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '0.35rem',
    color: 'var(--text-secondary)'
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
            maxWidth: '600px',
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
            onClick={() => {
              onClose();
              resetForm();
            }}
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
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
                }}>
                  <Trophy size={26} />
                </div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>College Round Registration</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Step {step} of 3: Enter your pitching details
                </p>
              </div>

              {/* Progress Bar */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--border-color)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${(step / 3) * 100}%`, background: 'var(--color-primary)', height: '100%', transition: 'width 0.3s ease' }} />
              </div>

              {/* Error Banner */}
              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                  {error}
                </div>
              )}

              {/* Form Content */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={labelStyle}>Team Name *</label>
                      <input type="text" placeholder="e.g. Innovators Club" required value={teamName} onChange={e => setTeamName(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Startup / Idea Name *</label>
                      <input type="text" placeholder="e.g. EduLearn AI" required value={startupName} onChange={e => setStartupName(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Startup / Idea Description (1-2 sentences) *</label>
                      <textarea rows={3} placeholder="Describe the problem, target audience, and your unique solution..." required value={startupDescription} onChange={e => setStartupDescription(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Eureka! RID</label>
                        <input type="text" placeholder="e.g. R26090123" value={eurekaRid} onChange={e => setEurekaRid(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Eureka! Team ID</label>
                        <input type="text" placeholder="e.g. T26094567" value={eurekaTeamId} onChange={e => setEurekaTeamId(e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                      Note: You must register on the official Eureka! portal to get your IDs. Both must be present to be counted as "Eureka Registered".
                    </span>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Leader Details */}
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                      Team Leader Info
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Leader Name *</label>
                        <input type="text" required value={leaderName} onChange={e => setLeaderName(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Leader Email *</label>
                        <input type="email" required value={leaderEmail} onChange={e => setLeaderEmail(e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Leader Phone *</label>
                        <input type="tel" required placeholder="10-digit Mobile" value={leaderPhone} onChange={e => setLeaderPhone(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>College / University *</label>
                        <input type="text" required value={college} onChange={e => setCollege(e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Department / Branch *</label>
                        <input type="text" required value={department} onChange={e => setDepartment(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Year of Study *</label>
                        <select value={year} onChange={e => setYear(e.target.value)} style={inputStyle}>
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Total Team Size (including leader) *</label>
                      <select value={teamSize} onChange={e => handleTeamSizeChange(e.target.value)} style={inputStyle}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Member (Solo)' : 'Members'}</option>)}
                      </select>
                    </div>

                    {/* Member Details (Conditional) */}
                    {teamSize > 1 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                        <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                          Team Members Contact Info
                        </h4>
                        {members.map((m, idx) => (
                          <div key={idx} style={{ padding: '1.25rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                            <h5 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '700' }}>Member #{idx + 2}</h5>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={labelStyle}>Full Name *</label>
                                <input type="text" required value={m.name} onChange={e => handleMemberChange(idx, 'name', e.target.value)} style={inputStyle} />
                              </div>
                              <div>
                                <label style={labelStyle}>Email Address *</label>
                                <input type="email" required value={m.email} onChange={e => handleMemberChange(idx, 'email', e.target.value)} style={inputStyle} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={labelStyle}>Phone Number *</label>
                                <input type="tel" required value={m.phone} onChange={e => handleMemberChange(idx, 'phone', e.target.value)} style={inputStyle} />
                              </div>
                              <div>
                                <label style={labelStyle}>Department *</label>
                                <input type="text" required value={m.department} onChange={e => handleMemberChange(idx, 'department', e.target.value)} style={inputStyle} />
                              </div>
                            </div>
                            <div>
                              <label style={labelStyle}>Year of Study *</label>
                              <select value={m.year} onChange={e => handleMemberChange(idx, 'year', e.target.value)} style={inputStyle}>
                                <option>1st Year</option>
                                <option>2nd Year</option>
                                <option>3rd Year</option>
                                <option>4th Year</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      Review Registration
                    </h4>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                      <p><strong>Team Name:</strong> {teamName}</p>
                      <p><strong>Startup Idea:</strong> {startupName}</p>
                      <p><strong>Eureka RID:</strong> {eurekaRid || 'Not Provided'}</p>
                      <p><strong>Eureka Team ID:</strong> {eurekaTeamId || 'Not Provided'}</p>
                      <p><strong>Eureka Registered:</strong> {eurekaRid && eurekaTeamId ? 'Yes' : 'No/Pending'}</p>
                      <p><strong>Team Leader:</strong> {leaderName} ({leaderEmail})</p>
                      <p><strong>College:</strong> {college}</p>
                      <p><strong>Total Members:</strong> {teamSize}</p>
                      {teamSize > 1 && (
                        <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                          <p><strong>Co-founders:</strong></p>
                          <ul style={{ paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                            {members.map((m, i) => m.name && <li key={i}>{m.name} ({m.email})</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '1rem' }}>
                      <input
                        type="checkbox"
                        id="consent-check"
                        checked={consent}
                        onChange={e => setConsent(e.target.checked)}
                        style={{ marginTop: '0.25rem', cursor: 'pointer' }}
                        required
                      />
                      <label htmlFor="consent-check" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
                        I confirm that the details entered above are accurate. I consent to sharing this registration with the official E-Cell board for screening and pitching evaluations. *
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Footer buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  {step > 1 ? (
                    <button type="button" onClick={prevStep} className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step === 3 ? (
                    <button type="submit" className="btn btn-primary" disabled={submitting} style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem' }}>
                      {submitting ? 'Submitting...' : 'Confirm & Register'}
                    </button>
                  ) : (
                    <button type="button" onClick={nextStep} className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
                      Next <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Registration Successful!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Your team <strong>{teamName}</strong> has been registered for the Eureka! College Pitching round.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                We have sent confirmation details to <strong>{leaderEmail}</strong>.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: '600', marginTop: '2rem' }}>
                <Sparkles size={16} /> Auto closing in a moment...
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
