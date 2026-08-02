import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/useTheme';
import { Sun, Moon, Rocket, Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ onOpenJoinModal }) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#activities' },
    { name: 'Team', href: '#team' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Scrolled background check
      setScrolled(window.scrollY > 30);

      // Progress bar percentage calculation
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledPercent = (winScroll / height) * 100;
      setScrollProgress(scrolledPercent);

      // Active section highlight check
      const sections = ['hero', 'about', 'activities', 'team', 'gallery', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '4px',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #2563eb, #22c55e)',
          zIndex: 1001,
          transition: 'width 0.1s ease-out'
        }}
      />

      <header className={`navbar-fixed ${scrolled ? 'navbar-scrolled' : 'navbar-initial'}`}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo */}
          <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #0f172a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
              color: '#ffffff'
            }}>
              <Rocket size={22} className="animate-bounce" />
            </div>
            <div>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontWeight: '800', 
                fontSize: '1.4rem', 
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)' 
              }}>
                E-CELL
              </span>
              <span style={{ 
                display: 'block', 
                fontSize: '0.65rem', 
                fontWeight: '700', 
                color: 'var(--color-accent)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                Innovate & Scale
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  style={{
                    textDecoration: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.95rem',
                    color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                    position: 'relative',
                    transition: 'color 0.2s ease',
                    padding: '0.25rem 0'
                  }}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        borderRadius: '2px',
                        background: 'var(--color-primary)'
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle & Join CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                background: 'var(--bg-glass-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {theme === 'dark' ? <Sun size={20} style={{ color: '#f59e0b' }} /> : <Moon size={20} style={{ color: '#2563eb' }} />}
            </button>

            {/* Desktop Join Button */}
            <button
              onClick={onOpenJoinModal}
              className="btn btn-primary desktop-btn"
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.9rem' }}
            >
              Join E-Cell <ArrowUpRight size={16} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'none'
              }}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              right: 0,
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              borderBottom: '1px solid var(--border-color)',
              padding: '1.5rem',
              zIndex: 999,
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenJoinModal();
                }}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                Join E-Cell <ArrowUpRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 868px) {
          .desktop-nav, .desktop-btn {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};
