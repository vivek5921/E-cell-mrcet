import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Users, Mic, Sparkles, TrendingUp, Lightbulb } from 'lucide-react';
import axios from 'axios';

export const About = () => {
  const [aboutData, setAboutData] = useState({
    heading: 'What is E-Cell?',
    description: 'E-Cell helps students learn entrepreneurship, innovation, startup building, networking, and leadership through workshops, hackathons, ideathons, guest lectures, and competitions.'
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/public/about')
      .then(res => {
        if (res.data && res.data.heading) {
          setAboutData(res.data);
        }
      })
      .catch(console.error);
  }, []);
  const pillars = [
    {
      icon: BookOpen,
      title: 'Workshops & Masterclasses',
      description: 'Hands-on learning sessions led by founders and domain experts on pitching, product design, and fundraising.'
    },
    {
      icon: Code,
      title: 'Hackathons & Ideathons',
      description: 'High-energy 36-hour buildathons where ideas transform into functional prototypes with cash prizes.'
    },
    {
      icon: Mic,
      title: 'Guest Lectures & Founder Talks',
      description: 'Keynotes and fireside chats with pioneering entrepreneurs sharing zero-to-one startup wisdom.'
    },
    {
      icon: Users,
      title: 'Ecosystem & Mentorship',
      description: 'Direct connections with venture capitalists, industry mentors, and an active network of student builders.'
    }
  ];

  return (
    <section id="about" className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        
        {/* Section Title */}
        <div className="section-header">
          <div className="badge badge-primary">
            <Sparkles size={16} /> Our Essence
          </div>
          <h2>{aboutData.heading}</h2>
          <p style={{ maxWidth: '780px', margin: '0 auto', fontSize: '1.15rem' }}>
            {aboutData.description}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid-4" style={{ marginTop: '3rem' }}>
          {pillars.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card"
                style={{ padding: '2rem 1.5rem', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <IconComp size={26} />
                </div>
                
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            marginTop: '4rem',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(34, 197, 94, 0.12) 100%)',
            border: '1px solid var(--border-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <h4 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lightbulb style={{ color: 'var(--color-accent)' }} /> Fostering Student Innovation
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Whether you are an aspiring founder with a raw idea, a coder looking for a co-founder, or a designer passionate about product building, E-Cell provides the launchpad you need.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="badge badge-accent" style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}>
              <TrendingUp size={18} /> Zero-to-One Growth Model
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
