import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.js';
import axios from 'axios';
import { Trash2, CheckCircle } from 'lucide-react';

export const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/messages`, { withCredentials: true });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await axios.put(`${API_URL}/api/messages/${id}/read`, {}, { withCredentials: true });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete message?')) return;
    try {
      await axios.delete(`${API_URL}/api/messages/${id}`, { withCredentials: true });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2>Manage Messages (Contact Form)</h2>
      
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 ? <p>No messages found.</p> : messages.map(msg => (
          <div key={msg.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: msg.is_read ? 'none' : '4px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ margin: 0 }}>{msg.name} ({msg.email})</h4>
                <small style={{ color: 'var(--text-muted)' }}>{new Date(msg.date).toLocaleString()}</small>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!msg.is_read && (
                  <button onClick={() => handleMarkRead(msg.id)} className="btn btn-secondary" style={{ padding: '0.5rem', background: '#22c55e', color: 'white', border: 'none' }} title="Mark as Read">
                    <CheckCircle size={16} />
                  </button>
                )}
                <button onClick={() => handleDelete(msg.id)} className="btn btn-secondary" style={{ padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none' }} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p><strong>Subject:</strong> {msg.subject}</p>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
