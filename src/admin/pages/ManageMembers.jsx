import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.js';
import axios from 'axios';
import { Trash2, UserCheck, Search, Download, Check, X, FileText } from 'lucide-react';

export const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/registrations`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
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

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/registrations/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert('Failed to update member status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await axios.delete(`${API_URL}/api/registrations/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.roll_number && m.roll_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesDept = deptFilter === 'All' || m.department === deptFilter;
    const matchesYear = yearFilter === 'All' || m.year === yearFilter;

    return matchesSearch && matchesStatus && matchesDept && matchesYear;
  });

  // Extract unique departments and years for filter dropdowns
  const uniqueDepts = ['All', ...new Set(members.map(m => m.department).filter(Boolean))];
  const uniqueYears = ['All', ...new Set(members.map(m => m.year).filter(Boolean))];

  // CSV Export utility
  const exportToCSV = () => {
    const headers = ['Full Name', 'Email', 'Roll Number', 'Department', 'Year', 'Section', 'Phone', 'Skills', 'Interests', 'Status', 'Submission Date'];
    const csvRows = [headers.join(',')];

    filteredMembers.forEach(m => {
      const values = [
        `"${m.full_name.replace(/"/g, '""')}"`,
        `"${(m.email || '').replace(/"/g, '""')}"`,
        `"${(m.roll_number || '').replace(/"/g, '""')}"`,
        `"${(m.department || '').replace(/"/g, '""')}"`,
        `"${(m.year || '').replace(/"/g, '""')}"`,
        `"${(m.section || '').replace(/"/g, '""')}"`,
        `"${(m.phone || '').replace(/"/g, '""')}"`,
        `"${(m.skills || '').replace(/"/g, '""')}"`,
        `"${(m.interests || '').replace(/"/g, '""')}"`,
        `"${m.status}"`,
        `"${new Date(m.submission_date).toLocaleDateString()}"`
      ];
      csvRows.push(values.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ecell_members_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading Members List...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Members & Registrations</h2>
        <button onClick={exportToCSV} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass-card)' }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by Name, Email, or Roll Number..." 
            className="form-input" 
            style={{ paddingLeft: '2.5rem', width: '100%' }} 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Status</label>
            <select className="form-input" style={{ width: '100%' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Department</label>
            <select className="form-input" style={{ width: '100%' }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Year of Study</label>
            <select className="form-input" style={{ width: '100%' }} value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
              {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div>
        {filteredMembers.length === 0 ? <p>No members found matching filters.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-primary)', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', background: 'var(--color-primary-light)' }}>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Student</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Details</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Contact</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCheck size={16} color="var(--color-primary)" />
                      <div>
                        <div>{member.full_name}</div>
                        <small style={{ color: 'var(--text-muted)' }}>Roll: {member.roll_number}</small>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <strong>{member.department}</strong> ({member.year})<br/>
                    {member.section && <small>Section: {member.section}</small>}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {member.email}<br/>
                    {member.phone && <small>Ph: {member.phone}</small>}<br/>
                    {member.resume_url && (
                      <a href={member.resume_url.startsWith('http') ? member.resume_url : `${API_URL}${member.resume_url}`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem', textDecoration: 'underline' }}>
                        <FileText size={12} /> View Resume
                      </a>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', fontWeight: '600',
                      background: member.status === 'accepted' ? 'rgba(34, 197, 94, 0.15)' : member.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: member.status === 'accepted' ? '#4ade80' : member.status === 'rejected' ? '#f87171' : '#fbbf24'
                    }}>{member.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {member.status !== 'accepted' && (
                        <button onClick={() => handleUpdateStatus(member.id, 'accepted')} className="btn btn-secondary" style={{ padding: '0.4rem', background: '#22c55e', color: 'white', border: 'none' }} title="Accept Registration">
                          <Check size={14} />
                        </button>
                      )}
                      {member.status !== 'rejected' && (
                        <button onClick={() => handleUpdateStatus(member.id, 'rejected')} className="btn btn-secondary" style={{ padding: '0.4rem', background: '#ef4444', color: 'white', border: 'none' }} title="Reject Registration">
                          <X size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(member.id)} className="btn btn-secondary" style={{ padding: '0.4rem', background: 'transparent', border: '1px solid var(--border-color)', color: '#ef4444' }} title="Delete Record">
                        <Trash2 size={14} />
                      </button>
                    </div>
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

