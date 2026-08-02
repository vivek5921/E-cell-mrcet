import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const JoinCommunity = ({ onOpenJoinModal }) => {
  return (
    <section className="section" style={{ padding: '4rem 0' }}>
      <div className="container">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            padding: '4.5rem 2.5rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)',
            color: '#ffffff',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          {/* Ambient Decorative Background Rings */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto' }}>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              fontSize: '0.88rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Sparkles size={16} style={{ color: '#22c55e' }} /> Join 500+ Innovators & Future Founders
            </div>

            <h2 style={{ fontSize: '3rem', color: '#ffffff', marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Be Part of Our <span style={{ color: '#60a5fa' }}>Startup Journey</span>
            </h2>

            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Whether you have a groundbreaking business idea, technical building skills, or simply a curiosity to learn leadership and venture creation, E-Cell is your launching pad.
            </p>

            {/* Quick Benefits Bullet List */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
              fontSize: '0.95rem',
              color: '#e2e8f0'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={18} style={{ color: '#22c55e' }} /> Free Membership
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={18} style={{ color: '#22c55e' }} /> Incubator Support
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={18} style={{ color: '#22c55e' }} /> Priority Event Pass
              </span>
            </div>

            <button
              onClick={onOpenJoinModal}
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#ffffff',
                fontSize: '1.1rem',
                padding: '1.1rem 2.75rem',
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)'
              }}
            >
              Join Now <ArrowUpRight size={20} />
            </button>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
