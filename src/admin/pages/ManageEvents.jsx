import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.js';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

export const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', date: '', location: '', description: '', category: 'Flagship' });

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

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/events`, formData, { withCredentials: true });
      setFormData({ title: '', date: '', location: '', description: '', category: 'Flagship' });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete event?')) return;
    try {
      await axios.delete(`${API_URL}/api/events/${id}`, { withCredentials: true });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2>Manage Events</h2>
      
      <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h3>Add New Event</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <input type="text" placeholder="Event Title" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <input type="datetime-local" className="form-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          <input type="text" placeholder="Location" className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
          <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option>Flagship</option><option>Workshop</option><option>Competition</option><option>Orientation</option>
          </select>
          <textarea placeholder="Description" className="form-input" style={{ gridColumn: 'span 2' }} rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Add Event</button>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Upcoming Events</h3>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Location</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{event.title}</td>
                <td style={{ padding: '1rem' }}>{new Date(event.date).toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>{event.location}</td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => handleDelete(event.id)} className="btn btn-secondary" style={{ padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
