import React, { useState, useEffect } from 'react';
import { API_URL } from '../config.js';
import axios from 'axios';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { EurekaRegistrationModal } from './EurekaRegistrationModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, ExternalLink, Play, 
  HelpCircle, ArrowRight, ShieldCheck, Check, ChevronDown 
} from 'lucide-react';

export const EurekaPage = () => {
  const [settings, setSettings] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState({});

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Fetch site configurations
    axios.get(`${API_URL}/api/public/settings`)
      .then(res => {
        if (res.data) setSettings(res.data);
      })
      .catch(console.error);
  }, []);

  const toggleFaq = (idx) => {
    setFaqOpen(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleOpenRegisterModal = () => setIsRegisterModalOpen(true);
  const handleCloseRegisterModal = () => setIsRegisterModalOpen(false);

  const importantDates = [
    { event: 'Official Eureka! Registration Deadline', date: 'September 10, 2026', desc: 'Must complete registration on the official IIT Bombay portal.' },
    { event: 'E-Cell College Registration Deadline', date: 'September 15, 2026', desc: 'Register your official RID on our website to qualify for screening.' },
    { event: 'Pitch Deck & Video Submission', date: 'September 18, 2026', desc: 'Submit final 5-slide pitch decks and prototype screenshots.' },
    { event: 'College Level Pitching Round', date: 'September 20, 2026', desc: '2-minute pitch + 3-minute Q&A before the jury panel.' },
    { event: 'Grand Finale & Top 3 Announcement', date: 'September 22, 2026', desc: 'Winners announced and recommended to regional/national rounds.' }
  ];

  const eligibilityCriteria = [
    { title: 'Student Status', desc: 'Open to all undergraduate & postgraduate students from any branch or department.' },
    { title: 'Idea Stage', desc: 'Early-stage ideas, concepts, or working prototypes are highly encouraged.' },
    { title: 'Team Size', desc: 'Teams can range from solo founders to a maximum of 8 members.' },
    { title: 'Official Registration', desc: 'Every participating team must have registered on the official IIT Bombay Eureka website.' }
  ];

  const faqs = [
    { q: 'Is there a registration fee for Eureka! College Round?', a: 'No, registration for both the official Eureka! and our College-level Pitching Round is completely free of charge.' },
    { q: 'What is a Eureka Team ID / RID, and where do I get it?', a: 'RID stands for Registration ID. It is generated when you successfully complete registration on the official IIT Bombay Eureka! portal at ecell.in/eureka.' },
    { q: 'Can a team submit multiple startup ideas?', a: 'No, each team is restricted to submitting one startup idea under a single Eureka Team ID/RID.' },
    { q: 'What is the pitching format for the college round?', a: 'Each team is given exactly 2 minutes to pitch their startup idea, followed by 3 minutes of rigorous Q&A with the jury panel.' },
    { q: 'What do the Top 3 winners receive?', a: 'The Top 3 teams will receive official winning certificates, college incubator space, dedicated mentorship from industrial experts, and recommendations to subsequent rounds of Eureka!.' }
  ];

  return (
    <div className="app-root" style={{ background: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {/* Dynamic Navbar */}
      <Navbar onOpenJoinModal={handleOpenRegisterModal} settings={settings} />

      <main style={{ paddingTop: '80px' }}>
        
        {/* Banner / Hero Section */}
        <section style={{
          position: 'relative',
          padding: '6rem 0 4rem 0',
          background: 'radial-gradient(circle at 50% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 60%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden'
        }}>
          <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#60a5fa',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '2rem',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <Award size={16} /> E-Cell Flagship Event
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.15', marginBottom: '1.5rem', letterSpacing: '-1px' }}
            >
              Eureka! <span style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pitching Competition</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '720px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}
            >
              The official college-level selection round for Eureka! - Asia's Largest Business Model Competition organized by E-Cell, IIT Bombay. Launch your ideas to the next stage.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <a 
                href="https://www.ecell.in/eureka/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                1. Register on Eureka! <ExternalLink size={16} />
              </a>
              <button 
                onClick={handleOpenRegisterModal} 
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', border: 'none' }}
              >
                2. Complete College Round <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Dual Flow / Process Section */}
        <section style={{ padding: '5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: '700', gap: '0.4rem', marginBottom: '1rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <ShieldCheck size={16} /> Verified Flow
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Event Registration Flow</h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem' }}>Follow these steps to qualify for the E-Cell pitching competition evaluation.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Box 1: Official Eureka */}
              <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ background: '#3b82f6', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>IIT Bombay Portal (External)</h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Visit the official Eureka! portal and complete your registration. This registers your startup idea at the national level and generates a unique Team Registration ID (RID).
                </p>
                <a 
                  href="https://www.ecell.in/eureka/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content', background: 'transparent', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  Go to ecell.in/eureka <ExternalLink size={14} />
                </a>
              </div>

              {/* Box 2: College Portal */}
              <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ background: '#22c55e', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>E-Cell MRCET Portal (Local)</h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Return here and submit your details including Team Name, Leader Info, all team members, and the generated Eureka RID. Only teams with valid RIDs will proceed to screening.
                </p>
                <button 
                  onClick={handleOpenRegisterModal} 
                  className="btn btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#22c55e', border: 'none', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  Register College Round <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pitching Details Section */}
        <section style={{ padding: '5rem 0', background: 'rgba(15,23,42,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: '700', gap: '0.4rem', marginBottom: '1rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <Play size={16} /> Strict Pitching Format
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Pitching Guidelines</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Teams must strictly adhere to the professional time-capped elevator pitch guidelines during their live pitch before the expert panel.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                    2M
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Live Elevator Pitch</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Strict 2 minutes to explain problem, solution, and MVP.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                    3M
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Jury Q&A Session</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>3 minutes of direct questions from industrial experts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(15,23,42,0.4)', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Evaluation Rubric</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { title: 'Problem Clarity', desc: 'Is the problem validated and clearly explained?' },
                  { title: 'Innovation / Solution', desc: 'Is the proposed product unique and scalable?' },
                  { title: 'Business Model', desc: 'How does the startup plan to make money and scale?' },
                  { title: 'MVP / Prototype Stage', desc: 'Is there a mock design, website, or app prototype?' },
                  { title: 'Team Strength', desc: 'Does the team possess the skills to execute the idea?' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ color: '#22c55e', marginTop: '0.15rem' }}>
                      <Check size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{item.title}</h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility & Dates Grid */}
        <section style={{ padding: '5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '4rem' }}>
            
            {/* Eligibility */}
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>Eligibility Criteria</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {eligibilityCriteria.map((c, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(15,23,42,0.3)', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <h4 style={{ color: '#60a5fa', fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem' }}>{c.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Dates */}
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>Important Dates</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {importantDates.map((d, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div style={{ background: '#3b82f6', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '4px', whiteSpace: 'nowrap', marginTop: '0.2rem' }}>
                      Step {idx + 1}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>{d.event}</h4>
                      <p style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: '600', margin: '0.1rem 0' }}>{d.date}</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section style={{ padding: '5rem 0', background: 'radial-gradient(circle at 50% 90%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: '700', gap: '0.4rem', marginBottom: '1rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <HelpCircle size={16} /> FAQ
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Frequently Asked Questions</h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem' }}>Have questions? We have compiled the answers for you.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="glass-card" 
                  style={{ 
                    padding: '1.25rem 1.75rem', 
                    background: 'rgba(15, 23, 42, 0.4)', 
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    borderRadius: '12px'
                  }}
                  onClick={() => toggleFaq(idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>{faq.q}</h4>
                    <motion.div animate={{ rotate: faqOpen[idx] ? 180 : 0 }}>
                      <ChevronDown size={18} style={{ color: '#94a3b8' }} />
                    </motion.div>
                  </div>
                  
                  <AnimatePresence>
                    {faqOpen[idx] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', marginTop: '1rem' }}
                      >
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Dynamic Footer */}
      <Footer settings={settings} />

      {/* College Registration Modal Overlay */}
      <EurekaRegistrationModal isOpen={isRegisterModalOpen} onClose={handleCloseRegisterModal} />
    </div>
  );
};
