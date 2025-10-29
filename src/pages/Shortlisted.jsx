import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

export default function Shortlisted() {
  const { isDarkMode } = useTheme();
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [threshold, setThreshold] = useState(50);

  // Fetch results and filter shortlisted candidates
  useEffect(() => {
    fetchShortlistedCandidates();
  }, [threshold]);

  const fetchShortlistedCandidates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-results`);
      const allCandidates = res.data.results || [];
      
      // Filter candidates based on threshold
      const shortlisted = allCandidates.filter(candidate => {
        const score = typeof candidate.score === 'number' ? candidate.score : Number(candidate.score) || 0;
        return score >= threshold;
      });
      
      setShortlistedCandidates(shortlisted);
    } catch (err) {
      console.error("❌ Error fetching shortlisted candidates:", err);
      alert("❌ Error fetching shortlisted candidates from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmails = async () => {
    try {
      setSending(true);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/send-emails`);
      alert(`✅ ${res.data.message}`);
      // Refresh the data to show updated email_sent status
      fetchShortlistedCandidates();
    } catch (err) {
      console.error("❌ Error sending emails:", err);
      alert("❌ Error sending emails. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const getShortlistStats = () => {
    const totalShortlisted = shortlistedCandidates.length;
    const emailsSent = shortlistedCandidates.filter(c => c.email_sent).length;
    const pendingEmails = totalShortlisted - emailsSent;
    
    return { totalShortlisted, emailsSent, pendingEmails };
  };

  const stats = getShortlistStats();

  const dynamicStyles = getStyles(isDarkMode);

  return (
    <div style={dynamicStyles.container}>
      <h1 style={dynamicStyles.heading}>Shortlisted Candidates</h1>
      
      {/* Stats Cards */}
      <div style={dynamicStyles.statsContainer}>
        <div style={dynamicStyles.statCard}>
          <div style={dynamicStyles.statNumber}>{stats.totalShortlisted}</div>
          <div style={dynamicStyles.statLabel}>Total Shortlisted</div>
        </div>
        <div style={dynamicStyles.statCard}>
          <div style={dynamicStyles.statNumber}>{stats.emailsSent}</div>
          <div style={dynamicStyles.statLabel}>Emails Sent</div>
        </div>
        <div style={dynamicStyles.statCard}>
          <div style={dynamicStyles.statNumber}>{stats.pendingEmails}</div>
          <div style={dynamicStyles.statLabel}>Pending Emails</div>
        </div>
      </div>

      {/* Threshold Control */}
      <div style={dynamicStyles.thresholdBox}>
        <label htmlFor="threshold" style={{ marginRight: 8, fontWeight: 'bold' }}>
          Shortlist Threshold (%)
        </label>
        <input
          id="threshold"
          type="number"
          min={0}
          max={100}
          value={threshold}
          onChange={(e) => setThreshold(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
          style={dynamicStyles.thresholdInput}
        />
      </div>

      {/* Action Buttons */}
      <div style={dynamicStyles.buttonContainer}>
        <button
          onClick={handleSendEmails}
          style={{
            ...dynamicStyles.sendButton,
            backgroundColor: sending ? '#9E9E9E' : '#4CAF50',
            cursor: sending ? 'not-allowed' : 'pointer',
          }}
          disabled={sending || shortlistedCandidates.length === 0}
        >
          {sending ? "📨 Sending..." : "📧 Send Emails to All Shortlisted"}
        </button>
        
        <button
          onClick={fetchShortlistedCandidates}
          style={dynamicStyles.refreshButton}
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Candidates Table */}
      {loading ? (
        <p style={dynamicStyles.noResults}>⏳ Loading shortlisted candidates...</p>
      ) : shortlistedCandidates.length === 0 ? (
        <div style={dynamicStyles.noResults}>
          <p>No candidates meet the current shortlist threshold of {threshold}%.</p>
          <p>Try lowering the threshold or upload more resumes.</p>
        </div>
      ) : (
        <div style={dynamicStyles.tableContainer}>
          <table style={dynamicStyles.table}>
            <thead>
              <tr>
                <th style={dynamicStyles.th}>Rank</th>
                <th style={dynamicStyles.th}>Name</th>
                <th style={dynamicStyles.th}>Email</th>
                <th style={dynamicStyles.th}>Score</th>
                <th style={dynamicStyles.th}>Job</th>
                <th style={dynamicStyles.th}>Email Status</th>
              </tr>
            </thead>
            <tbody>
              {shortlistedCandidates
                .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
                .map((candidate, index) => {
                  const score = typeof candidate.score === 'number' ? candidate.score : Number(candidate.score) || 0;
                  return (
                    <tr
                      key={index}
                      style={index % 2 === 0 ? dynamicStyles.trEven : dynamicStyles.trOdd}
                    >
                      <td style={dynamicStyles.td}>#{index + 1}</td>
                      <td style={dynamicStyles.td}>{candidate.name || 'N/A'}</td>
                      <td style={dynamicStyles.td}>{candidate.email || 'N/A'}</td>
                      <td style={dynamicStyles.td}>
                        <span style={dynamicStyles.scoreHighlight}>{score.toFixed(1)}%</span>
                      </td>
                      <td style={dynamicStyles.td}>{candidate.job_id || 'N/A'}</td>
                      <td style={dynamicStyles.td}>
                        <span
                          style={candidate.email_sent ? dynamicStyles.emailSentYes : dynamicStyles.emailSentNo}
                        >
                          {candidate.email_sent ? '✅ Sent' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const getStyles = (isDarkMode) => ({
  container: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: isDarkMode ? '#1e2a3a' : '#f9f9f9',
    borderRadius: '12px',
    boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  },
  heading: {
    textAlign: 'center',
    color: isDarkMode ? '#64b5f6' : '#1a73e8',
    marginBottom: '30px',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: isDarkMode ? '0 0 10px rgba(100, 181, 246, 0.5)' : 'none',
    transition: 'all 0.3s ease'
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '30px',
    gap: '20px',
  },
  statCard: {
    backgroundColor: isDarkMode ? '#252f3f' : 'white',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: isDarkMode ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
    flex: 1,
    minWidth: '120px',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: isDarkMode ? '#64b5f6' : '#1a73e8',
    marginBottom: '8px',
    textShadow: isDarkMode ? '0 0 8px rgba(100, 181, 246, 0.4)' : 'none',
  },
  statLabel: {
    fontSize: '14px',
    color: isDarkMode ? '#b0b0b0' : '#666',
    fontWeight: '500',
  },
  thresholdBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: isDarkMode ? '#252f3f' : 'white',
    borderRadius: '8px',
    boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  thresholdInput: {
    width: '80px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: isDarkMode ? '2px solid #64b5f6' : '2px solid #1a73e8',
    fontSize: '16px',
    textAlign: 'center',
    backgroundColor: isDarkMode ? '#0d1b26' : '#fff',
    color: isDarkMode ? '#e0e0e0' : '#333',
    transition: 'all 0.3s ease'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '30px',
  },
  sendButton: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: '0.3s ease',
  },
  refreshButton: {
    padding: '12px 24px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: '0.3s ease',
  },
  noResults: {
    textAlign: 'center',
    color: isDarkMode ? '#b0b0b0' : '#666',
    fontStyle: 'italic',
    padding: '40px',
    backgroundColor: isDarkMode ? '#252f3f' : 'white',
    borderRadius: '8px',
    boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  tableContainer: {
    backgroundColor: isDarkMode ? '#252f3f' : 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: isDarkMode ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#1a73e8',
    color: 'white',
    padding: '16px 12px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  td: {
    padding: '12px',
    borderBottom: isDarkMode ? '1px solid #2d3a4a' : '1px solid #eee',
    fontSize: '14px',
    color: isDarkMode ? '#e0e0e0' : '#333',
  },
  trEven: {
    backgroundColor: isDarkMode ? '#252f3f' : '#f8f9fa',
  },
  trOdd: {
    backgroundColor: isDarkMode ? '#1e2a3a' : 'white',
  },
  scoreHighlight: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  emailSentYes: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  emailSentNo: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
});