import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config.js';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Bell, Check } from 'lucide-react';
import axios from 'axios';

const eurekaEvent = {
  id: 'eureka-pitch',
  title: 'Eureka! Pitching Competition',
  date: 'SEP 20, 2026',
  time: '09:00 AM IST Onwards',
  location: 'Main Seminar Hall & Labs',
  description: 'The official college-level pitching round for Eureka! - Asia\'s largest business model competition by E-Cell IIT Bombay. Register externally and pitch to win!',
  category: 'Competition',
  registration_link: '/eureka'
};

const defaultEvents = [
  {
      id: 'event-1',
      title: 'Startup Awareness Session',
      date: 'AUG 25, 2026',
      time: '04:00 PM IST',
      location: 'Main Auditorium',
      description: 'An interactive orientation introducing freshers and students to the startup ecosystem, incubators, and E-Cell membership benefits.',
      category: 'Orientation'
    },
    {
      id: 'event-2',
      title: 'Idea Pitch Competition',
      date: 'SEP 10, 2026',
      time: '10:00 AM IST',
      location: 'Innovation Hub Lab 3',
      description: 'Pitch your early-stage business concepts to a panel of venture capitalist judges and compete for initial seed funding grants.',
      category: 'Pitching'
    },
    {
      id: 'event-3',
      title: '36-Hour Hackathon',
      date: 'OCT 02 - 04, 2026',
      time: '09:00 AM IST Onwards',
      location: 'Tech Complex Hall B',
      description: 'A 36-hour non-stop buildathon where techies, designers, and thinkers collaborate to build functional MVPs with mentorship.',
      category: 'Hackathon'
    },
    {
      id: 'event-4',
      title: 'Founder Talk: Zero to One',
      date: 'OCT 22, 2026',
      time: '05:30 PM IST',
      location: 'Seminar Hall 1',
      description: 'Inspiring keynote address by a successful unicorn alumni founder detailing their zero-to-one startup journey and lessons.',
      category: 'Keynote'
    },
    {
      id: 'event-5',
      title: 'Workshop on AI & Entrepreneurship',
      date: 'NOV 12, 2026',
      time: '02:00 PM IST',
      location: 'Computer Center Lab 5',
      description: 'Hands-on masterclass leveraging generative AI tools, LLM APIs, and automated workflows to accelerate startup building.',
      category: 'Masterclass'
  }
];

export const Activities = () => {
  const [notifiedEvents, setNotifiedEvents] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/public/events`)
      .then(res => {
        let loaded = res.data || [];
        if (loaded.length === 0) {
          loaded = [...defaultEvents];
        }
        const hasEureka = loaded.some(e => e.id === 'eureka-pitch' || e.title.toLowerCase().includes('eureka'));
        if (!hasEureka) {
          loaded = [eurekaEvent, ...loaded];
        }
        setEvents(loaded);
      })
      .catch(() => {
        setEvents([eurekaEvent, ...defaultEvents]);
      });
  }, []);

  const handleNotifyToggle = (eventId) => {
    setNotifiedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  return (
    <section id="activities" className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="badge badge-accent">
            <Calendar size={16} /> Roadmap & Events
          </div>
          <h2>Upcoming Activities</h2>
          <p>Explore our lineup of high-impact events designed to ignite your startup journey.</p>
        </div>

        {/* Timeline Container */}
        <div style={{ maxWidth: '880px', margin: '3rem auto 0 auto', position: 'relative' }}>
          
          {/* Vertical Timeline Guide Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '24px',
            width: '3px',
            background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            opacity: 0.3,
            zIndex: 0
          }} className="timeline-line" />

          {/* Event Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {events.map((event, idx) => {
              const isNotified = notifiedEvents[event.id];

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    marginLeft: '3.5rem',
                    position: 'relative',
                    background: 'var(--bg-glass-card)'
                  }}
                >
                  {/* Timeline Dot Node */}
                  <div style={{
                    position: 'absolute',
                    left: '-3.5rem',
                    top: '2.25rem',
                    transform: 'translateX(-50%)',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: idx % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)',
                    border: '4px solid var(--bg-primary)',
                    boxShadow: '0 0 12px rgba(37, 99, 235, 0.5)',
                    zIndex: 2
                  }} />

                  {/* Header Row: Date & Coming Soon Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: 'var(--color-primary)',
                        background: 'var(--color-primary-light)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        <Calendar size={14} /> {event.date}
                      </span>

                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> {event.time}
                      </span>
                    </div>

                    {/* Coming Soon Badge */}
                    <span className="badge badge-accent" style={{ animation: 'pulse 2s infinite' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} /> Coming Soon
                    </span>
                  </div>

                  {/* Event Title */}
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{event.title}</h3>

                  {/* Location Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    <MapPin size={15} style={{ color: 'var(--color-accent)' }} /> {event.location}
                  </div>

                  {/* Description */}
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {event.description}
                  </p>

                  {/* Actions Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '1rem'
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                      Category: <span style={{ color: 'var(--text-primary)' }}>{event.category}</span>
                    </span>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      {event.registration_link && (
                        <Link
                          to={event.registration_link}
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', textDecoration: 'none' }}
                        >
                          Details & Register
                        </Link>
                      )}
                      <button
                        onClick={() => handleNotifyToggle(event.id)}
                        className={`btn ${isNotified ? 'btn-accent' : 'btn-secondary'}`}
                        style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                      >
                        {isNotified ? (
                          <>
                            <Check size={14} /> Reminder Set
                          </>
                        ) : (
                          <>
                            <Bell size={14} /> Remind Me
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
      
      <style>{`
        @media (max-width: 640px) {
          .timeline-line {
            display: none !important;
          }
          .glass-card {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};
