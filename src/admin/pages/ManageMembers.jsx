import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.js';
import axios from 'axios';
import { Trash2, UserCheck } from 'lucide-react';

export const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/registrations`, { withCredentials: true });
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await axios.delete(`${API_URL}/api/registrations/${id}`, { withCredentials: true });
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2>Members (Registrations)</h2>
      
      <div style={{ marginTop: '2rem' }}>
        {members.length === 0 ? <p>No registrations found.</p> : (
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', background: 'var(--color-primary-light)' }}>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Name</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Email</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Roll No</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Dept & Year</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Interest</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCheck size={16} color="var(--color-primary)" />
                      {member.full_name}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{member.email}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{member.roll_number}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {member.department}<br/>
                    <small>{member.year}</small>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {member.interests}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button onClick={() => handleDelete(member.id)} className="btn btn-secondary" style={{ padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none' }} title="Delete Member">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
