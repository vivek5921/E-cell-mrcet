import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.js';
import axios from 'axios';
import { Trash2, Edit2, X } from 'lucide-react';

export const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'Flagship',
    registration_link: '',
    google_maps_url: '',
    status: 'upcoming',
    poster_url: ''
  });
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/public/events`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleEditClick = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      description: event.description || '',
      category: event.category || 'Flagship',
      registration_link: event.registration_link || '',
      google_maps_url: event.google_maps_url || '',
      status: event.status || 'upcoming',
      poster_url: event.poster_url || ''
    });
    setPosterPreview(event.poster_url ? (event.poster_url.startsWith('http') ? event.poster_url : `${API_URL}${event.poster_url}`) : '');
    setPosterFile(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      category: 'Flagship',
      registration_link: '',
      google_maps_url: '',
      status: 'upcoming',
      poster_url: ''
    });
    setPosterFile(null);
    setPosterPreview('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let finalPosterUrl = formData.poster_url;

      if (posterFile) {
        const uploadData = new FormData();
        uploadData.append('image', posterFile);
        const uploadRes = await axios.post(`${API_URL}/api/upload`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        finalPosterUrl = uploadRes.data.url;
      }

      const payload = { ...formData, poster_url: finalPosterUrl };

      if (editingId) {
        await axios.put(`${API_URL}/api/events/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      } else {
        await axios.post(`${API_URL}/api/events`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      }

      handleCancelEdit();
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save event details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete event?')) return;
    try {
      await axios.delete(`${API_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading Events Data...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2>Manage Events</h2>
      
      <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem', maxWidth: '850px' }}>
        <h3>{editingId ? 'Edit Event Details' : 'Add New Event'}</h3>
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Event Title *</label>
            <input type="text" placeholder="Event Title" className="form-input" style={{ width: '100%' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Category</label>
            <select className="form-input" style={{ width: '100%' }} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>Flagship</option><option>Workshop</option><option>Competition</option><option>Orientation</option><option>Masterclass</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Date (e.g. OCT 22, 2026) *</label>
            <input type="text" placeholder="e.g. OCT 22, 2026" className="form-input" style={{ width: '100%' }} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Time (e.g. 05:30 PM IST) *</label>
            <input type="text" placeholder="e.g. 05:30 PM IST" className="form-input" style={{ width: '100%' }} value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Location/Venue *</label>
            <input type="text" placeholder="e.g. Main Seminar Hall" className="form-input" style={{ width: '100%' }} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Event Status</label>
            <select className="form-input" style={{ width: '100%' }} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Registration URL</label>
            <input type="text" placeholder="https://forms.gle/..." className="form-input" style={{ width: '100%' }} value={formData.registration_link} onChange={e => setFormData({...formData, registration_link: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Google Maps Location URL</label>
            <input type="text" placeholder="https://maps.google.com/..." className="form-input" style={{ width: '100%' }} value={formData.google_maps_url} onChange={e => setFormData({...formData, google_maps_url: e.target.value})} />
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Description *</label>
            <textarea placeholder="Event Description..." className="form-input" style={{ width: '100%' }} rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {posterPreview && (
              <img src={posterPreview} alt="Poster Preview" style={{ width: '120px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
            )}
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Event Poster Image</label>
              <input type="file" accept="image/*" className="form-input" style={{ width: '100%', padding: '0.4rem' }} onChange={handlePosterChange} />
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Event')}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                <X size={16} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h3>Current Platform Events</h3>
        <div style={{ overflowX: 'auto', marginTop: '1rem', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-primary)', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'var(--color-primary-light)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Event Details</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Schedule</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Location</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {event.poster_url && (
                      <img src={event.poster_url.startsWith('http') ? event.poster_url : `${API_URL}${event.poster_url}`} alt="" onError={(e) => { e.target.src = 'https://placehold.co/100x100/1e293b/334155?text=No+Poster'; }} style={{ width: '45px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                    <div>
                      <span style={{ fontWeight: '600', display: 'block' }}>{event.title}</span>
                      <small style={{ color: 'var(--text-muted)' }}>{event.category}</small>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{event.date} • {event.time}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{event.location}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', fontWeight: '600',
                      background: event.status === 'upcoming' ? 'rgba(34, 197, 94, 0.15)' : event.status === 'ongoing' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                      color: event.status === 'upcoming' ? '#4ade80' : event.status === 'ongoing' ? '#fbbf24' : '#94a3b8'
                    }}>{event.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditClick(event)} className="btn btn-secondary" style={{ padding: '0.5rem', background: 'var(--bg-glass-card)', border: 'none' }} title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="btn btn-secondary" style={{ padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none' }} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

