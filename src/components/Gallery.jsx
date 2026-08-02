import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X, ZoomIn, Calendar } from 'lucide-react';
import axios from 'axios';

export const Gallery = () => {
  const [activeImage, setActiveImage] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/public/gallery');
        setGalleryItems(res.data);
      } catch (err) {
        console.error('Failed to load gallery', err);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="badge badge-accent">
            <Image size={16} /> Moments & Highlights
          </div>
          <h2>Gallery Preview</h2>
          <p>Memorable moments from our flagship pitch competitions, hackathons, and founder summits.</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid-3" style={{ gap: '1.75rem', marginTop: '3rem' }}>
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => setActiveImage(item)}
              className="glass-card"
              style={{
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {/* Image Container with Zoom */}
              <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  className="gallery-img-hover"
                />

                {/* Overlay Gradient on Hover */}
                <div 
                  className="gallery-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 60%)',
                    opacity: 0.85,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.25rem',
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: '700' }}>
                    {item.title}
                  </h3>

                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <ZoomIn size={18} />
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(9, 13, 22, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '850px',
                width: '100%',
                background: 'var(--bg-glass-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <button
                onClick={() => setActiveImage(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <X size={22} />
              </button>

              <img
                src={activeImage.image_url}
                alt={activeImage.title}
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }}
              />

              <div style={{ padding: '1.75rem' }}>
                <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                  {activeImage.category} • {new Date(activeImage.createdAt).toLocaleDateString()}
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{activeImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .glass-card:hover .gallery-img-hover {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
};
