import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit } from 'lucide-react';

export const ManageTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', role: '', category: 'Technical', department: '', email: '', bio: '' });

  const fetchTeam = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/public/team');
      setTeam(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/team', formData, { withCredentials: true });
      setFormData({ name: '', role: '', category: 'Technical', department: '', email: '', bio: '' });
      fetchTeam();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete member?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/team/${id}`, { withCredentials: true });
      fetchTeam();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2>Manage Team</h2>
      
      <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h3>Add Member</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <input type="text" placeholder="Name" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="text" placeholder="Role" className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
          <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option>Faculty</option><option>Executive</option><option>Technical</option><option>Marketing</option><option>Design</option><option>Operations</option>
          </select>
          <input type="text" placeholder="Department" className="form-input" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
          <input type="email" placeholder="Email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="text" placeholder="Bio" className="form-input" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
          <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Add Member</button>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Current Team</h3>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{member.name}</td>
                <td style={{ padding: '1rem' }}>{member.role}</td>
                <td style={{ padding: '1rem' }}>{member.category}</td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => handleDelete(member.id)} className="btn btn-secondary" style={{ padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none' }}>
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
