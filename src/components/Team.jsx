import React, { useState, useEffect } from 'react';
import { API_URL } from '../config.js';
import { motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import { LinkedinIcon } from './SocialIcons';
import axios from 'axios';

const defaultTeamMembers = [
  {
      name: 'Dr. Ananya Sharma',
      role: 'Faculty Coordinator',
      teamCategory: 'Faculty',
      initials: 'AS',
      department: 'Dept. of Innovation & Mgmt',
      bio: 'Mentoring student startups and overseeing college incubator operations.',
      color: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
      linkedin: 'https://linkedin.com',
      email: 'ananya.sharma@college.edu'
    },
    {
      name: 'Rohan Mehta',
      role: 'President',
      teamCategory: 'Executive',
      initials: 'RM',
      department: 'Computer Science (Final Year)',
      bio: 'Leading strategic vision, partner relations, and campus startup culture.',
      color: 'linear-gradient(135deg, #0f172a, #334155)',
      linkedin: 'https://linkedin.com',
      email: 'rohan.president@ecell.org'
    },
    {
      name: 'Sneha Verma',
      role: 'Vice President',
      teamCategory: 'Executive',
      initials: 'SV',
      department: 'Electronics & Comm (Final Year)',
      bio: 'Overseeing internal operations, event execution, and sponsor relations.',
      color: 'linear-gradient(135deg, #22c55e, #16a34a)',
      linkedin: 'https://linkedin.com',
      email: 'sneha.vp@ecell.org'
    },
    {
      name: 'Aarav Patel',
      role: 'Technical Team Lead',
      teamCategory: 'Technical',
      initials: 'AP',
      department: 'Information Tech (3rd Year)',
      bio: 'Managing digital platforms, hackathon infrastructure, and portal dev.',
      color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      linkedin: 'https://linkedin.com',
      email: 'aarav.tech@ecell.org'
    },
    {
      name: 'Priya Singh',
      role: 'Technical Team Member',
      teamCategory: 'Technical',
      initials: 'PS',
      department: 'Computer Engineering (2nd Year)',
      bio: 'Fullstack web development and tech event platform maintenance.',
      color: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      linkedin: 'https://linkedin.com',
      email: 'priya.tech@ecell.org'
    },
    {
      name: 'Kabir Roy',
      role: 'Marketing Team Lead',
      teamCategory: 'Marketing',
      initials: 'KR',
      department: 'Business Admin (3rd Year)',
      bio: 'Driving brand outreach, social campaigns, and PR strategies.',
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      linkedin: 'https://linkedin.com',
      email: 'kabir.marketing@ecell.org'
    },
    {
      name: 'Diya Kapoor',
      role: 'Design Team Lead',
      teamCategory: 'Design',
      initials: 'DK',
      department: 'Design & UX (3rd Year)',
      bio: 'Crafting UI/UX visuals, promotional banners, and brand identity.',
      color: 'linear-gradient(135deg, #ec4899, #be185d)',
      linkedin: 'https://linkedin.com',
      email: 'diya.design@ecell.org'
    },
    {
      name: 'Vikram Joshi',
      role: 'Operations Team Lead',
      teamCategory: 'Operations',
      initials: 'VJ',
      department: 'Mechanical Eng (3rd Year)',
      bio: 'Managing event logistics, venue coordination, and hospitality.',
      color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      linkedin: 'https://linkedin.com',
  }
];

export const Team = () => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/public/team`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          // Map backend fields to frontend fields
          const mapped = res.data.map(m => ({
            name: m.name,
            role: m.role,
            teamCategory: m.category,
            initials: m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
            department: m.department,
            bio: m.bio,
            color: 'linear-gradient(135deg, #2563eb, #1d4ed8)', // default color
            linkedin: m.linkedin,
            email: m.email,
            image_url: m.image_url
          }));
          setTeamMembers(mapped);
        } else {
          setTeamMembers(defaultTeamMembers);
        }
      })
      .catch(() => setTeamMembers(defaultTeamMembers));
  }, []);

  const categories = ['All', 'Faculty', 'Executive', 'Technical', 'Marketing', 'Design', 'Operations'];

  const filteredMembers = selectedRoleFilter === 'All' 
    ? teamMembers 
    : teamMembers.filter(m => m.teamCategory === selectedRoleFilter);

  return (
    <section id="team" className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="badge badge-primary">
            <Sparkles size={16} /> Leadership & Team
          </div>
          <h2>Meet Our Team</h2>
          <p>The dedicated student leaders and faculty mentors driving the E-Cell movement.</p>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedRoleFilter(cat)}
              style={{
                background: selectedRoleFilter === cat ? 'var(--color-primary)' : 'var(--bg-glass-card)',
                color: selectedRoleFilter === cat ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid ' + (selectedRoleFilter === cat ? 'var(--color-primary)' : 'var(--border-color)'),
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Team Grid */}
        <div className="grid-4" style={{ gap: '2rem' }}>
          {filteredMembers.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
              className="glass-card"
              style={{
                padding: '2.25rem 1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Circular Avatar with Initials */}
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: member.color,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '800',
                fontFamily: 'var(--font-heading)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                marginBottom: '1.25rem',
                border: '3px solid var(--bg-primary)'
              }}>
                {member.image_url ? (
                  <img src={member.image_url.startsWith('http') ? member.image_url : `${API_URL}${member.image_url}`} alt={member.name} onError={(e) => { e.target.src = 'https://placehold.co/400x400/1e293b/334155?text=No+Photo'; }} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  member.initials
                )}
              </div>

              {/* Name & Role */}
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{member.name}</h3>
              
              <div className="badge badge-primary" style={{ fontSize: '0.78rem', marginBottom: '0.75rem' }}>
                {member.role}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: '600', marginBottom: '0.75rem' }}>
                {member.department}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1, lineHeight: '1.5' }}>
                {member.bio}
              </p>

              {/* Social Handles */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', width: '100%', justifyContent: 'center' }}>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${member.name} LinkedIn`}
                  style={{
                    color: 'var(--text-muted)',
                    transition: 'color 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--bg-primary)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <LinkedinIcon size={16} />
                </a>

                <a
                  href={`mailto:${member.email}`}
                  aria-label={`Email ${member.name}`}
                  style={{
                    color: 'var(--text-muted)',
                    transition: 'color 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--bg-primary)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#22c55e'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Mail size={16} />
                </a>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
