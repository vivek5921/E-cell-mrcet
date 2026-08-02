import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Award, Rocket, DollarSign } from 'lucide-react';

export const Hero = ({ onOpenJoinModal }) => {
  // Stat Counter Animation Logic
  const stats = [
    { label: 'Active Members', value: 500, suffix: '+', icon: Users },
    { label: 'Startups Mentored', value: 20, suffix: '+', icon: Rocket },
    { label: 'Annual Events', value: 15, suffix: '+', icon: Award },
    { label: 'Seed Fund Pool', value: 5, prefix: '₹', suffix: 'L+', icon: DollarSign }
  ];

  return (
    <section id="hero" className="section" style={{ paddingTop: '8.5rem', paddingBottom: '5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background ambient glow shapes */}
      <div 
        className="glow-background" 
        style={{ 
          top: '10%', 
          left: '15%', 
          width: '350px', 
          height: '350px', 
          background: 'rgba(37, 99, 235, 0.25)' 
        }} 
      />
      <div 
        className="glow-background" 
        style={{ 
          top: '40%', 
          right: '10%', 
          width: '400px', 
          height: '400px', 
          background: 'rgba(34, 197, 94, 0.18)' 
        }} 
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '3rem',
          alignItems: 'center'
        }} className="hero-grid">
          
          {/* Left Column: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Top Pill Badge */}
            <div className="badge badge-primary" style={{ marginBottom: '1.5rem' }}>
              <Sparkles size={16} /> Welcome to College E-Cell Hub
            </div>

            {/* Main Headline */}
            <h1 style={{ 
              fontSize: '3.6rem', 
              letterSpacing: '-0.03em', 
              marginBottom: '1.25rem',
              lineHeight: 1.15
            }}>
              Building Tomorrow's <br />
              <span className="gradient-text">Entrepreneurs</span>
            </h1>

            {/* Sub-description */}
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'var(--text-secondary)', 
              marginBottom: '2.5rem',
              maxWidth: '560px',
              fontWeight: '400'
            }}>
              The Entrepreneurship Cell is a student-driven community that promotes innovation, startups, leadership, and problem solving.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
              <button 
                onClick={onOpenJoinModal} 
                className="btn btn-primary"
                style={{ fontSize: '1.05rem', padding: '1rem 2.2rem' }}
              >
                Join E-Cell <ArrowRight size={18} />
              </button>
              <a 
                href="#activities" 
                className="btn btn-secondary"
                style={{ fontSize: '1.05rem', padding: '1rem 2.2rem' }}
              >
                Explore Events
              </a>
            </div>

            {/* Animated Counters Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.25rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border-color)'
            }} className="stats-grid">
              {stats.map((stat, idx) => {
                return (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                  >
                    <div style={{ 
                      fontSize: '1.8rem', 
                      fontWeight: '800', 
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}>
                      <span style={{ color: 'var(--color-primary)' }}>{stat.prefix}</span>
                      {stat.value}
                      <span style={{ color: 'var(--color-accent)' }}>{stat.suffix}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Animated Floating Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
          >
            <div className="animate-float" style={{ width: '100%', maxWidth: '520px', position: 'relative' }}>
              
              {/* Image Frame Container with Glass Backdrop */}
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                padding: '12px',
                background: 'var(--bg-glass-card)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--border-glow)',
                boxShadow: 'var(--shadow-glow)'
              }}>
                <img 
                  src="/images/hero_illustration.png" 
                  alt="E-Cell Startup Innovation Illustration" 
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 'calc(var(--radius-lg) - 8px)',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                />

                {/* Floating Glass Accent Badge Top-Right */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    right: '-15px',
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--border-glow)',
                    padding: '0.75rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--color-accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-accent)'
                  }}>
                    <Rocket size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Incubation</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>Batch 2026 Live</div>
                  </div>
                </motion.div>

                {/* Floating Glass Accent Badge Bottom-Left */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}
                  style={{
                    position: 'absolute',
                    bottom: '-15px',
                    left: '-15px',
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--border-glow)',
                    padding: '0.75rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)'
                  }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top Rated</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>Student E-Cell</div>
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-grid h1 {
            font-size: 2.75rem !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hero-grid p {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-grid .btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};
