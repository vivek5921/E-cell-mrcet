import React, { useState, useEffect } from 'react';
import { API_URL } from '../config.js';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, Target, Compass, ArrowRight } from 'lucide-react';

export const VisionMission = () => {
  const [data, setData] = useState({
    vision: 'To instill an unwavering entrepreneurial mindset among students, encouraging them to identify real-world problems, embrace calculated risks, and build sustainable ventures that shape the future.',
    mission: 'To construct an inclusive, resource-rich ecosystem where students transform bold ideas into impactful ventures through expert mentorship, incubation access, funding opportunities, and hands-on execution.'
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/public/about`)
      .then(res => {
        if (res.data) {
          setData({
            vision: res.data.vision || 'To instill an unwavering entrepreneurial mindset among students, encouraging them to identify real-world problems, embrace calculated risks, and build sustainable ventures that shape the future.',
            mission: res.data.mission || 'To construct an inclusive, resource-rich ecosystem where students transform bold ideas into impactful ventures through expert mentorship, incubation access, funding opportunities, and hands-on execution.'
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="badge badge-accent">
            <Compass size={16} /> Our Core Purpose
          </div>
          <h2>Vision & Mission</h2>
          <p>Guided by a passion for disruptive innovation and holistic student empowerment.</p>
        </div>

        {/* 2 Beautiful Cards Grid */}
        <div className="grid-2" style={{ gap: '2.5rem', marginTop: '3rem' }}>
          
          {/* Card 1: Vision */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card"
            style={{
              padding: '3rem 2.5rem',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, var(--bg-glass-card) 0%, rgba(37, 99, 235, 0.05) 100%)'
            }}
          >
            {/* Top Icon Badge */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.75rem',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.35)'
            }}>
              <Eye size={32} />
            </div>

            <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>
              Strategic Vision
            </div>

            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Create Future <span className="gradient-text">Entrepreneurs</span> & Innovators
            </h3>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              {data.vision}
            </p>

            <div style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--color-primary)'
            }}>
              Empowering Mindsets <ArrowRight size={16} />
            </div>
          </motion.div>

          {/* Card 2: Mission */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card"
            style={{
              padding: '3rem 2.5rem',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, var(--bg-glass-card) 0%, rgba(34, 197, 94, 0.05) 100%)'
            }}
          >
            {/* Top Icon Badge */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.75rem',
              boxShadow: '0 8px 25px rgba(34, 197, 94, 0.35)'
            }}>
              <Target size={32} />
            </div>

            <div className="badge badge-accent" style={{ marginBottom: '1rem' }}>
              Actionable Mission
            </div>

            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Build a <span style={{ color: 'var(--color-accent)' }}>Collaborative Ecosystem</span>
            </h3>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              {data.mission}
            </p>

            <div style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--color-accent)'
            }}>
              Transforming Ideas <ArrowRight size={16} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

