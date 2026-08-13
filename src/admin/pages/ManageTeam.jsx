import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.js';
import axios from 'axios';
import { Trash2, Edit2, X } from 'lucide-react';

export const ManageTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', role: '', category: 'Technical', department: '', email: '', bio: '', linkedin: '', image_url: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/public/team`);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditClick = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      category: member.category || 'Technical',
      department: member.department || '',
      email: member.email || '',
      bio: member.bio || '',
      linkedin: member.linkedin || '',
      image_url: member.image_url || ''
    });
    setImagePreview(member.image_url ? (member.image_url.startsWith('http') ? member.image_url : `${API_URL}${member.image_url}`) : '');
    setImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', role: '', category: 'Technical', department: '', email: '', bio: '', linkedin: '', image_url: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await axios.post(`${API_URL}/api/upload`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        finalImageUrl = uploadRes.data.url;
      }

      const payload = { ...formData, image_url: finalImageUrl };

      if (editingId) {
        await axios.put(`${API_URL}/api/team/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      } else {
        await axios.post(`${API_URL}/api/team`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      }

      handleCancelEdit();
      fetchTeam();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save team member details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete member?')) return;
    try {
      await axios.delete(`${API_URL}/api/team/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchTeam();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading Team Data...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2>Manage Team</h2>
      
      <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem', maxWidth: '800px' }}>
        <h3>{editingId ? 'Edit Team Member' : 'Add New Team Member'}</h3>
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Name *</label>
            <input type="text" placeholder="Name" className="form-input" style={{ width: '100%' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Role/Designation *</label>
            <input type="text" placeholder="e.g. Faculty Advisor, President" className="form-input" style={{ width: '100%' }} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Category</label>
            <select className="form-input" style={{ width: '100%' }} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>Faculty</option><option>Executive</option><option>Technical</option><option>Marketing</option><option>Design</option><option>Operations</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Department/Year</label>
            <input type="text" placeholder="e.g. Computer Science (Final Year)" className="form-input" style={{ width: '100%' }} value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Email Address</label>
            <input type="email" placeholder="email@address.com" className="form-input" style={{ width: '100%' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>LinkedIn Profile URL</label>
            <input type="text" placeholder="https://linkedin.com/in/..." className="form-input" style={{ width: '100%' }} value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Short Biography</label>
            <textarea placeholder="Tell us about their role..." className="form-input" style={{ width: '100%' }} rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} />
            )}
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Profile Image</label>
              <input type="file" accept="image/*" className="form-input" style={{ width: '100%', padding: '0.4rem' }} onChange={handleImageChange} />
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Member')}
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
        <h3>Current Team Members</h3>
        <div style={{ overflowX: 'auto', marginTop: '1rem', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-primary)', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'var(--color-primary-light)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Member</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Role</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Category</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontWeight: 'bold' }}>
                      {member.image_url ? (
                        <img src={member.image_url.startsWith('http') ? member.image_url : `${API_URL}${member.image_url}`} alt="" onError={(e) => { e.target.src = 'https://placehold.co/100x100/1e293b/334155?text=No+Photo'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        member.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <span style={{ fontWeight: '500' }}>{member.name}</span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{member.role}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{member.category}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditClick(member)} className="btn btn-secondary" style={{ padding: '0.5rem', background: 'var(--bg-glass-card)', border: 'none' }} title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(member.id)} className="btn btn-secondary" style={{ padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none' }} title="Delete">
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

