import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.js';
import axios from 'axios';
import { 
  Trash2, Search, Check, X, Trophy, Users, Award, 
  ShieldAlert, Star, FileText, UserPlus
} from 'lucide-react';

export const ManageEureka = () => {
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState(null);
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [ridSearch, setRidSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'score'
  
  // Active Tab within Eureka
  const [activeSubTab, setActiveSubTab] = useState('teams'); // 'teams' | 'judges' | 'stats'
  
  // Detail Overlay State
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [teamStatus, setTeamStatus] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  
  // Scoring Input
  const [selectedJudgeId, setSelectedJudgeId] = useState('');
  const [scoreVal, setScoreVal] = useState('');
  const [feedbackVal, setFeedbackVal] = useState('');
  const [submittingScore, setSubmittingScore] = useState(false);
  const [teamScores, setTeamScores] = useState([]);

  // Judge Provisioning State
  const [judgeName, setJudgeName] = useState('');
  const [judgeEmail, setJudgeEmail] = useState('');
  const [judgeSpec, setJudgeSpec] = useState('');
  const [submittingJudge, setSubmittingJudge] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/eureka/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/eureka/teams`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJudges = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/eureka/judges`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setJudges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchTeams(), fetchJudges()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // RID Specific Search
  const handleRidSearch = async (e) => {
    e.preventDefault();
    if (!ridSearch.trim()) return;
    try {
      const res = await axios.get(`${API_URL}/api/eureka/teams/search?rid=${ridSearch.trim()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.data) {
        handleOpenDetails(res.data);
        setRidSearch('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'No team found with this RID.');
    }
  };

  // Open Details Modal
  const handleOpenDetails = async (team) => {
    setSelectedTeam(team);
    setAdminNotes(team.admin_notes || '');
    setTeamStatus(team.status);
    
    // Fetch scores specifically for this team
    try {
      const scoreRes = await axios.get(`${API_URL}/api/eureka/scores/${team.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setTeamScores(scoreRes.data);
    } catch (e) {
      console.error(e);
      setTeamScores([]);
    }
  };

  // Save notes and status
  const handleSaveNotes = async () => {
    if (!selectedTeam) return;
    setSavingNotes(true);
    try {
      const res = await axios.put(`${API_URL}/api/eureka/teams/${selectedTeam.id}`, {
        status: teamStatus,
        admin_notes: adminNotes
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      toast.success('Team status & notes updated successfully.');
      setSelectedTeam(res.data.team);
      // Reload lists
      fetchTeams();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save team details.');
    } finally {
      setSavingNotes(false);
    }
  };

  // Save score and feedback
  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!selectedTeam || !selectedJudgeId || !scoreVal) return;
    setSubmittingScore(true);
    try {
      await axios.post(`${API_URL}/api/eureka/scores`, {
        team_id: selectedTeam.id,
        judge_id: selectedJudgeId,
        score: parseInt(scoreVal),
        feedback: feedbackVal
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      
      // Reset inputs
      setSelectedJudgeId('');
      setScoreVal('');
      setFeedbackVal('');
      
      // Reload scores
      const scoreRes = await axios.get(`${API_URL}/api/eureka/scores/${selectedTeam.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setTeamScores(scoreRes.data);
      fetchTeams(); // Reload average in main list
      toast.success('Score entered successfully.');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit score.');
    } finally {
      setSubmittingScore(false);
    }
  };

  // Delete team
  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this team? All member records and scores will be deleted.')) return;
    try {
      await axios.delete(`${API_URL}/api/eureka/teams/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (selectedTeam && selectedTeam.id === id) {
        setSelectedTeam(null);
      }
      loadAllData();
      toast.success('Team deleted successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete team.');
    }
  };

  // Add Judge
  const handleAddJudge = async (e) => {
    e.preventDefault();
    if (!judgeName || !judgeEmail) return;
    setSubmittingJudge(true);
    try {
      await axios.post(`${API_URL}/api/eureka/judges`, {
        name: judgeName,
        email: judgeEmail,
        specialization: judgeSpec
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setJudgeName('');
      setJudgeEmail('');
      setJudgeSpec('');
      fetchJudges();
      toast.success('Judge added successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add judge.');
    } finally {
      setSubmittingJudge(false);
    }
  };

  // Delete Judge
  const handleDeleteJudge = async (id) => {
    if (!window.confirm('Delete this judge? Any scores entered by them will also be deleted.')) return;
    try {
      await axios.delete(`${API_URL}/api/eureka/judges/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchJudges();
      fetchTeams(); // Reload team score list since scores will change
      toast.success('Judge deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Export
  const exportToCSV = (filterType = 'All') => {
    // Collect headers
    const headers = [
      'Name', 'Email', 'Phone', 'Role', 'Department', 'Year', 
      'Team Name', 'Startup Name', 'Idea Description', 'Eureka RID', 'Eureka Team ID', 'Eureka Registered', 
      'Registration Status', 'Average Jury Score', 'Registration Date'
    ];
    
    const csvRows = [headers.join(',')];

    // Filter teams based on export filter
    let targetTeams = [...teams];
    if (filterType !== 'All') {
      targetTeams = targetTeams.filter(t => t.status === filterType);
    }

    targetTeams.forEach(t => {
      // Calculate average score
      const avgScore = t.scores && t.scores.length > 0 
        ? (t.scores.reduce((sum, s) => sum + s.score, 0) / t.scores.length).toFixed(1)
        : 'N/A';

      // Export every participant individually (leader and other members)
      const allMembers = t.members || [];
      allMembers.forEach(m => {
        const values = [
          `"${m.name.replace(/"/g, '""')}"`,
          `"${m.email.replace(/"/g, '""')}"`,
          `"${m.phone.replace(/"/g, '""')}"`,
          `"${m.is_leader ? 'Leader' : 'Member'}"`,
          `"${m.department.replace(/"/g, '""')}"`,
          `"${m.year.replace(/"/g, '""')}"`,
          `"${t.team_name.replace(/"/g, '""')}"`,
          `"${t.startup_name.replace(/"/g, '""')}"`,
          `"${t.startup_description.replace(/"/g, '""').substring(0, 150)}..."`,
          `"${t.eureka_rid.replace(/"/g, '""')}"`,
          `"${(t.eureka_team_id || '').replace(/"/g, '""')}"`,
          `"${t.eureka_rid && t.eureka_team_id ? 'Yes' : 'No'}"`,
          `"${t.status}"`,
          `"${avgScore}"`,
          `"${new Date(t.registration_date).toLocaleDateString()}"`
        ];
        csvRows.push(values.join(','));
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eureka_participants_${filterType.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered teams list based on main search and filter dropdown
  const filteredTeams = teams.filter(t => {
    const matchesSearch = 
      t.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.startup_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.eureka_rid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leader_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate scores summary
  const getAverageScore = (scores) => {
    if (!scores || scores.length === 0) return 'N/A';
    const sum = scores.reduce((acc, s) => acc + s.score, 0);
    return (sum / scores.length).toFixed(1);
  };

  const getAverageNumericScore = (scoresList) => {
    if (!scoresList || scoresList.length === 0) return 0;
    const sum = scoresList.reduce((acc, s) => acc + s.score, 0);
    return sum / scoresList.length;
  };

  // Sort all teams globally to assign global ranks
  const teamsWithRank = [...teams].sort((a, b) => {
    return getAverageNumericScore(b.scores) - getAverageNumericScore(a.scores);
  });
  
  const getTeamGlobalRank = (teamId) => {
    const idx = teamsWithRank.findIndex(t => t.id === teamId);
    return idx !== -1 ? idx + 1 : 'N/A';
  };

  const displayTeams = [...filteredTeams].sort((a, b) => {
    if (sortBy === 'score') {
      const scoreA = getAverageNumericScore(a.scores);
      const scoreB = getAverageNumericScore(b.scores);
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
    }
    return new Date(b.registration_date) - new Date(a.registration_date);
  });

  const evaluatedTeamsCount = teams.filter(t => t.scores && t.scores.length > 0).length;
  const averageScores = teams
    .filter(t => t.scores && t.scores.length > 0)
    .map(t => getAverageNumericScore(t.scores));
  const highestAvgScore = averageScores.length > 0 ? Math.max(...averageScores).toFixed(1) : 'N/A';

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading Eureka Modules...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Eureka! Pitching Competition</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Evaluate startup entries, manage judges, scores, and track final status.</p>
        </div>
        
        {/* CSV Exports Group */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select 
            className="form-input" 
            onChange={(e) => exportToCSV(e.target.value)} 
            defaultValue=""
            style={{ width: '180px', background: 'var(--bg-glass-card)', cursor: 'pointer' }}
          >
            <option value="" disabled>Export CSV data</option>
            <option value="All">All Registered</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Top 20">Top 20</option>
            <option value="Top 3">Top 3</option>
            <option value="Winner">Winners</option>
          </select>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveSubTab('teams')}
          style={{
            background: 'transparent', border: 'none', color: activeSubTab === 'teams' ? 'var(--color-primary)' : 'var(--text-secondary)',
            fontWeight: '600', padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: activeSubTab === 'teams' ? '2px solid var(--color-primary)' : 'none'
          }}
        >
          Registered Teams ({filteredTeams.length})
        </button>
        <button 
          onClick={() => setActiveSubTab('judges')}
          style={{
            background: 'transparent', border: 'none', color: activeSubTab === 'judges' ? 'var(--color-primary)' : 'var(--text-secondary)',
            fontWeight: '600', padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: activeSubTab === 'judges' ? '2px solid var(--color-primary)' : 'none'
          }}
        >
          Jury Management ({judges.length})
        </button>
        <button 
          onClick={() => setActiveSubTab('stats')}
          style={{
            background: 'transparent', border: 'none', color: activeSubTab === 'stats' ? 'var(--color-primary)' : 'var(--text-secondary)',
            fontWeight: '600', padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: activeSubTab === 'stats' ? '2px solid var(--color-primary)' : 'none'
          }}
        >
          Statistics
        </button>
      </div>

      {/* Sub Tab: STATS */}
      {activeSubTab === 'stats' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Teams', value: stats.totalTeams, icon: Users, color: '#3b82f6' },
            { label: 'Total Students', value: stats.totalStudents, icon: UserPlus, color: '#a78bfa' },
            { label: 'Evaluated Teams', value: evaluatedTeamsCount, icon: Star, color: '#f59e0b' },
            { label: 'Highest Pitch Score', value: highestAvgScore, icon: Trophy, color: '#10b981' },
            { label: 'Eureka Registered', value: stats.statuses.eurekaReg, icon: Award, color: '#34d399' },
            { label: 'Pending / College', value: stats.statuses.collegeReg, icon: ShieldAlert, color: '#f59e0b' },
            { label: 'Screening', value: stats.statuses.screening, icon: FileText, color: '#fb7185' },
            { label: 'Shortlisted', value: stats.statuses.shortlisted, icon: Check, color: '#60a5fa' },
            { label: 'Top 3', value: stats.statuses.top3, icon: Trophy, color: '#fbbf24' },
            { label: 'Winner', value: stats.statuses.winner, icon: Star, color: '#ec4899' }
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${card.color}` }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  <Icon size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800' }}>{card.value}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{card.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub Tab: TEAMS */}
      {activeSubTab === 'teams' && (
        <>
          {/* SEARCH & FILTERS BAR */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            
            {/* RID specific Search Box */}
            <form onSubmit={handleRidSearch} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search Eureka RID (Exact match to open full record e.g. E123456)..." 
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem', width: '100%', border: '1px solid var(--border-glow)' }} 
                  value={ridSearch}
                  onChange={e => setRidSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' }}>
                Search RID
              </button>
            </form>

            {/* General Filter Group */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Query search</label>
                <input 
                  type="text" 
                  placeholder="Search by Team Name, Startup Name, Leader Name..." 
                  className="form-input" 
                  style={{ width: '100%' }} 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Status filter</label>
                <select className="form-input" style={{ width: '100%' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Eureka Registration">Eureka Registration</option>
                  <option value="College Registration">College Registration</option>
                  <option value="Screening">Screening</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Pitching">Pitching</option>
                  <option value="Top 20">Top 20</option>
                  <option value="Top 3">Top 3</option>
                  <option value="Winner">Winner</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Sort by</label>
                <select className="form-input" style={{ width: '100%' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="date">Registration Date</option>
                  <option value="score">Rank / Final Score</option>
                </select>
              </div>
            </div>
          </div>

          {/* TEAMS DATA TABLE */}
          <div className="glass-card" style={{ overflowX: 'auto', borderRadius: '12px', background: 'var(--bg-glass-card)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-primary-light)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Rank</th>
                  <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Eureka RID</th>
                  <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Team Name</th>
                  <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Startup / Idea</th>
                  <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Leader Name</th>
                  <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>College</th>
                  <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Jury Score</th>
                  <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--color-primary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayTeams.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--color-accent)' }}>#{getTeamGlobalRank(t.id)}</td>
                    <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--color-primary)' }}>{t.eureka_rid}</td>
                    <td style={{ padding: '1rem', fontWeight: '500', cursor: 'pointer' }} onClick={() => handleOpenDetails(t)}>{t.team_name}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{t.startup_name}</td>
                    <td style={{ padding: '1rem' }}>{t.leader_name}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.college}</td>
                    <td style={{ padding: '1rem', fontWeight: '700', color: '#22c55e' }}>{getAverageScore(t.scores)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px', fontWeight: '600',
                        background: t.status === 'Winner' ? 'rgba(236, 72, 153, 0.15)' : t.status === 'Top 3' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: t.status === 'Winner' ? '#ec4899' : t.status === 'Top 3' ? '#fbbf24' : '#60a5fa'
                      }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button onClick={() => { handleOpenDetails(t); }} className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--color-primary)', background: 'transparent' }} title="Evaluate Team">
                        <Star size={13} style={{ color: 'var(--color-primary)' }} /> Evaluate
                      </button>
                      <button onClick={() => handleDeleteTeam(t.id)} className="btn" style={{ padding: '0.35rem', border: 'none', background: '#ef4444', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {displayTeams.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No teams matching criteria found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Sub Tab: JURY */}
      {activeSubTab === 'judges' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          
          {/* Form to provision a Judge */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={18} /> Provision Judge Account
            </h3>
            <form onSubmit={handleAddJudge} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Judge Name *</label>
                <input type="text" placeholder="e.g. Dr. Anil Kumar" className="form-input" style={{ width: '100%' }} value={judgeName} onChange={e => setJudgeName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Judge Email *</label>
                <input type="email" placeholder="judge@college.edu" className="form-input" style={{ width: '100%' }} value={judgeEmail} onChange={e => setJudgeEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Specialization / Industry</label>
                <input type="text" placeholder="e.g. FinTech / Venture Capital" className="form-input" style={{ width: '100%' }} value={judgeSpec} onChange={e => setJudgeSpec(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px', marginTop: '0.5rem' }} disabled={submittingJudge}>
                Add Judge
              </button>
            </form>
          </div>

          {/* Judges List */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Active Judges</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Specialization</th>
                    <th style={{ padding: '0.75rem' }}>Evaluations</th>
                    <th style={{ padding: '0.75rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {judges.map(j => (
                    <tr key={j.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '500' }}>{j.name}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{j.email}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{j.specialization || 'General'}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '700', color: 'var(--color-primary)' }}>{j.scores ? j.scores.length : 0}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <button onClick={() => handleDeleteJudge(j.id)} className="btn" style={{ padding: '0.25rem', border: 'none', background: '#ef4444', color: 'white', borderRadius: '4px' }}>
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {judges.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No judges registered.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL OVERLAY */}
      {selectedTeam && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(16px)',
          zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '850px', width: '100%', padding: '2.5rem', position: 'relative',
            maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-glass-card)'
          }}>
            <button onClick={() => setSelectedTeam(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={22} />
            </button>

            {/* Modal Header */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--color-primary)' }}>RID: {selectedTeam.eureka_rid || 'N/A'}</span>
                <span style={{ color: 'var(--color-accent)' }}>Team ID: {selectedTeam.eureka_team_id || 'N/A'}</span>
                <span style={{ 
                  color: selectedTeam.eureka_rid && selectedTeam.eureka_team_id ? '#22c55e' : '#f59e0b',
                  background: selectedTeam.eureka_rid && selectedTeam.eureka_team_id ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  padding: '0.1rem 0.4rem', borderRadius: '4px'
                }}>
                  Eureka Registered: {selectedTeam.eureka_rid && selectedTeam.eureka_team_id ? 'Yes' : 'No/Pending'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{selectedTeam.team_name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Startup: <strong>{selectedTeam.startup_name}</strong></p>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
              
              {/* Left Column: Details & Members */}
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Startup Description</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                  {selectedTeam.startup_description}
                </p>

                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>All Team Members</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedTeam.members && selectedTeam.members.map((m) => (
                    <div key={m.id} style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: m.is_leader ? 'rgba(37,99,235,0.05)' : 'transparent' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{m.name} {m.is_leader && <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', background: 'var(--color-primary-light)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Leader</span>}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.email} | {m.phone}</div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <div>{m.department}</div>
                        <div>{m.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Status, Notes, Scoring */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Admin Status Dropdown & Notes */}
                <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Review & Status</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Registration Status</label>
                    <select className="form-input" style={{ width: '100%' }} value={teamStatus} onChange={e => setTeamStatus(e.target.value)}>
                      <option value="Eureka Registration">Eureka Registration</option>
                      <option value="College Registration">College Registration</option>
                      <option value="Screening">Screening</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Pitching">Pitching</option>
                      <option value="Top 20">Top 20</option>
                      <option value="Top 3">Top 3</option>
                      <option value="Winner">Winner</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Admin Notes</label>
                    <textarea rows={3} className="form-input" style={{ width: '100%', resize: 'vertical' }} value={adminNotes} onChange={e => setAdminNotes(e.target.value)} />
                  </div>
                  <button onClick={handleSaveNotes} className="btn btn-primary" style={{ width: '100%', padding: '0.5rem 1rem', fontSize: '0.85rem' }} disabled={savingNotes}>
                    {savingNotes ? 'Saving Details...' : 'Save Review'}
                  </button>
                </div>

                {/* Score Evaluator Entry */}
                <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Jury Evaluation</span>
                    <span style={{ color: '#22c55e', fontWeight: '700' }}>Avg: {getAverageScore(selectedTeam.scores || teamScores)}</span>
                  </h4>
                  
                  {/* Enter Score Form */}
                  <form onSubmit={handleSaveScore} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem', color: 'var(--text-secondary)' }}>Select Judge *</label>
                      <select className="form-input" style={{ width: '100%', padding: '0.5rem' }} value={selectedJudgeId} onChange={e => setSelectedJudgeId(e.target.value)} required>
                        <option value="">-- Choose Judge --</option>
                        {judges.map(j => <option key={j.id} value={j.id}>{j.name} ({j.specialization || 'General'})</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem', color: 'var(--text-secondary)' }}>Score (1-100) *</label>
                        <input type="number" min="1" max="100" className="form-input" style={{ width: '100%', padding: '0.5rem' }} value={scoreVal} onChange={e => setScoreVal(e.target.value)} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem', color: 'var(--text-secondary)' }}>Feedback</label>
                        <input type="text" placeholder="Add feedback note..." className="form-input" style={{ width: '100%', padding: '0.5rem' }} value={feedbackVal} onChange={e => setFeedbackVal(e.target.value)} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', border: '1px solid var(--color-primary)' }} disabled={submittingScore}>
                      {submittingScore ? 'Entering Score...' : 'Submit Judge Evaluation'}
                    </button>
                  </form>

                  {/* List of Scores Entered */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto' }}>
                    {teamScores.map(s => (
                      <div key={s.id} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-secondary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                          <span>{s.EurekaJudge ? s.EurekaJudge.name : 'Unknown Judge'}</span>
                          <span style={{ color: '#22c55e' }}>Score: {s.score}/100</span>
                        </div>
                        {s.feedback && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.1rem' }}>"{s.feedback}"</div>}
                      </div>
                    ))}
                    {teamScores.length === 0 && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>No scores entered yet.</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
