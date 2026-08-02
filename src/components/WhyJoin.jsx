import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Lightbulb, Users, Mic, Trophy, TrendingUp, Sparkles } from 'lucide-react';

export const WhyJoin = () => {
  const features = [
    {
      icon: Rocket,
      title: 'Innovation',
      tag: '🚀 Build',
      description: 'Turn disruptive thoughts into functional prototypes with guidance from senior engineers and product designers.',
      color: '#2563eb'
    },
    {
      icon: Lightbulb,
      title: 'Startup Learning',
      tag: '💡 Knowledge',
      description: 'Master business model canvas, go-to-market strategies, valuation fundamentals, and equity distribution.',
      color: '#eab308'
    },
    {
      icon: Users,
      title: 'Networking',
      tag: '🤝 Connections',
      description: 'Engage directly with angel investors, VC analysts, successful alumni founders, and like-minded peers.',
      color: '#22c55e'
    },
    {
      icon: Mic,
      title: 'Leadership',
      tag: '🎤 Command',
      description: 'Lead flagship summits, manage large event operations, and hone high-impact communication abilities.',
      color: '#a855f7'
    },
    {
      icon: Trophy,
      title: 'Competitions',
      tag: '🏆 Winning',
      description: 'Participate in premier college pitch contests, national hackathons, and ideathons with generous seed grants.',
      color: '#f97316'
    },
    {
      icon: TrendingUp,
      title: 'Skill Development',
      tag: '📈 Growth',
      description: 'Gain practical experience in pitch deck design, financial modeling, user research, and agile execution.',
      color: '#06b6d4'
    }
  ];

  return (
    <section id="why-join" className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="badge badge-primary">
            <Sparkles size={16} /> Member Advantages
          </div>
          <h2>Why Join E-Cell?</h2>
          <p>Unlocking opportunities to accelerate your personal and professional growth.</p>
        </div>

        {/* 6 Animated Feature Cards Grid */}
        <div className="grid-3" style={{ gap: '2rem', marginTop: '3rem' }}>
          {features.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="glass-card"
                style={{
                  padding: '2.25rem 1.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                {/* Accent Corner Glow */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '90px',
                  height: '90px',
                  background: `radial-gradient(circle, ${item.color}25 0%, transparent 70%)`,
                  borderRadius: '0 var(--radius-md) 0 100%',
                  pointerEvents: 'none'
                }} />

                {/* Top Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: `${item.color}15`,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComp size={28} />
                  </div>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    color: item.color,
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}30`
                  }}>
                    {item.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>{item.title}</h3>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {item.description}
                </p>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
