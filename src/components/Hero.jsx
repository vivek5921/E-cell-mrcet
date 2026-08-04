import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Award, Rocket, DollarSign } from 'lucide-react';

export const Hero = ({ onOpenJoinModal }) => {
  // Stat Counter Data
  const stats = [
    { label: 'Active Members', value: 500, suffix: '+', icon: Users },
    { label: 'Startups Mentored', value: 20, suffix: '+', icon: Rocket },
    { label: 'Annual Events', value: 15, suffix: '+', icon: Award },
    { label: 'Seed Fund Pool', value: 5, prefix: '₹', suffix: 'L+', icon: DollarSign }
  ];

  return (
    <section id="hero" style={{ 
      paddingTop: '9rem', 
      paddingBottom: '4rem', 
      position: 'relative', 
      overflow: 'hidden',
      background: 'url(/images/grid-bg.svg) center/cover no-repeat', // optional subtle grid
      backgroundColor: 'var(--bg-primary)'
    }}>
      {/* Background ambient glow behind the logo on the right */}
      <div 
        className="glow-background animate-glow-pulse" 
        style={{ 
          top: '20%', 
          right: '5%', 
          width: '600px', 
          height: '600px', 
          background: 'rgba(15, 98, 254, 0.15)',
          filter: 'blur(100px)'
        }} 
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2rem',
          alignItems: 'center',
          marginBottom: '5rem'
        }} className="hero-grid">
          
          {/* Left Column: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Top Badge */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: '500',
              marginBottom: '1.5rem',
              background: 'var(--bg-glass-card)'
            }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="/images/logo.png" alt="icon" style={{ width: 32, height: 'auto', minWidth: 32 }} />
              </div>
              Welcome to MRCET E-Cell
            </div>

            {/* Main Headline */}
            <h1 style={{ 
              letterSpacing: '-0.02em', 
              marginBottom: '1.25rem',
              lineHeight: 1.1
            }}>
              <span className="text-outline-silver" style={{ display: 'block', fontSize: 'min(4.5rem, 12vw)', fontWeight: '800' }}>
                Building Tomorrow's
              </span>
              <span style={{ color: 'var(--color-primary)', fontSize: 'min(4.5rem, 12vw)', fontWeight: '800' }}>
                Entrepreneurs
              </span>
            </h1>

            {/* Sub-description */}
            <p style={{ 
              fontSize: '1.15rem', 
              color: 'var(--text-secondary)', 
              marginBottom: '2.5rem',
              maxWidth: '560px',
              fontWeight: '400',
              lineHeight: 1.7
            }}>
              The Entrepreneurship Cell is a student-driven community that promotes innovation, startups, leadership, and problem solving.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={onOpenJoinModal} 
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}
              >
                Join E-Cell <ArrowRight size={18} />
              </button>
              <a 
                href="#activities" 
                className="btn btn-secondary"
                style={{ 
                  fontSize: '1rem', 
                  padding: '0.9rem 2rem',
                  fontWeight: '600'
                }}
              >
                Explore Events
              </a>
            </div>
          </motion.div>

          {/* Right Column: Large Logo with Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', paddingRight: '2rem' }}
            className="hero-image-container"
          >
            <div className="animate-float" style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <img 
                src="/images/logo.png" 
                alt="MRCET E-Cell Official Logo" 
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))'
                }}
              />
            </div>
          </motion.div>

        </div>

        {/* Animated Counters Row at the bottom */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          width: '100%'
        }} className="stats-row">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
                style={{ 
                  background: 'var(--bg-glass-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'rgba(15, 98, 254, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--color-primary)'
                }}>
                  <Icon size={24} />
                </div>
                <div>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '800', 
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    lineHeight: 1.2
                  }}>
                    {stat.prefix && <span style={{ marginRight: '2px' }}>{stat.prefix}</span>}
                    {stat.value}
                    {stat.suffix && <span style={{ marginLeft: '1px' }}>{stat.suffix}</span>}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-image-container {
            justify-content: center !important;
            padding-right: 0 !important;
            margin-top: 2rem;
          }
          .stats-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hero-grid p {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-grid .btn {
            width: 100%;
          }
          .hero-grid > div:first-child > div:nth-child(4) {
            justify-content: center;
          }
        }
        
        @media (max-width: 640px) {
          .stats-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
