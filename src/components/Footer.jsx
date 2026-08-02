import React from 'react';
import { Rocket, ArrowUp } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, TwitterIcon, GithubIcon } from './SocialIcons';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 0 2rem 0',
      position: 'relative'
    }}>
      <div className="container">
        
        {/* Top Footer Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
          gap: '2.5rem',
          marginBottom: '3rem'
        }} className="footer-grid">
          
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb 0%, #0f172a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Rocket size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.25rem' }}>
                E-CELL
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '320px', lineHeight: '1.6' }}>
              Empowering the next generation of student entrepreneurs, innovators, and disruptive startup builders.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: InstagramIcon, href: 'https://instagram.com' },
                { icon: LinkedinIcon, href: 'https://linkedin.com' },
                { icon: TwitterIcon, href: 'https://twitter.com' },
                { icon: GithubIcon, href: 'https://github.com' },
              ].map((s, idx) => {
                const IconC = s.icon;
                return (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--bg-glass-card)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <IconC size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Home', 'About', 'Events', 'Team', 'Gallery', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s ease' }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Initiatives */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>Initiatives</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Pitch Contests', 'AI Masterclass', 'Student Hackathon', 'Incubation Grants', 'Mentor Hours'].map((item) => (
                <span key={item} style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: Campus Location */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>Campus Hub</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Innovation Center, Block C<br />
              College Campus Grounds<br />
              Mon - Sat: 9:00 AM - 6:00 PM
            </p>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '600' }}>
              ecell@college.edu
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            © 2026 E-Cell. All rights reserved.
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            "Powered by Student Innovation" <Rocket size={16} style={{ color: 'var(--color-primary)' }} />
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
              background: 'var(--bg-glass-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowUp size={18} />
          </button>
        </div>

      </div>

      <style>{`
        @media (max-width: 868px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};
