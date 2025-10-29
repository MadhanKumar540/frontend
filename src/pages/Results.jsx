// Results.jsx (Stable Version with working Send Emails and improved UX)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

export default function Results() {
  const { isDarkMode } = useTheme();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [threshold, setThreshold] = useState(50);

  // Fetch results on component load
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-results`);
      console.log("📊 API Response:", res.data);
      setResults(res.data.results || []);
      console.log("📊 Results:", results);
    } catch (err) {
      console.error("❌ Error fetching results:", err);
      alert("❌ Error fetching results from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmails = async () => {
    console.log("📧 Send Emails button clicked!");
    setSending(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/send-emails`);
      alert(res.data.message || "Emails sent successfully!");

      // Refresh the results table
      await fetchResults();
    } catch (err) {
      console.error("❌ Error sending emails:", err);
      alert("❌ Error sending emails: " + (err.response?.data?.error || err.message));
    } finally {
      setSending(false);
    }
  };

  const handleClearResults = async () => {
    if (!window.confirm('Are you sure you want to clear all results?')) return;
    const previous = results;
    setResults([]);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/clear-results`);
      alert('✅ Results cleared.');
    } catch (err) {
      console.error('❌ Error clearing results:', err);
      alert('❌ Error clearing results: ' + (err.response?.data?.error || err.message));
      setResults(previous);
    }
  };

    const styles = getStyles(isDarkMode);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Shortlisted Candidates</h1>

      <button
        onClick={handleSendEmails}
        style={{
          ...styles.sendButton,
          backgroundColor: sending ? '#9E9E9E' : '#4CAF50',
          cursor: sending ? 'not-allowed' : 'pointer',
        }}
        disabled={sending}
      >
        {sending ? "📨 Sending..." : "📧 Send Emails to Shortlisted"}
      </button>

      <button
        onClick={handleClearResults}
        style={styles.clearButton}
      >
        🗑️ Clear Results
      </button>

      <div style={styles.thresholdBox}>
        <label htmlFor="threshold" style={{ marginRight: 8 }}>Shortlist threshold (%)</label>
        <input
          id="threshold"
          type="number"
          min={0}
          max={100}
          value={threshold}
          onChange={(e) => setThreshold(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
          style={styles.thresholdInput}
        />
      </div>

      {loading ? (
        <p style={styles.noResults}>⏳ Loading results...</p>
      ) : results.length === 0 ? (
        <p style={styles.noResults}>No results available yet. Upload resumes to process candidates.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Shortlisted</th>
              <th style={styles.th}>Email Sent</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => {
              const score = typeof item.score === 'number' ? item.score : Number(item.score) || 0;
              const computedShortlisted = score >= threshold ? 'Yes' : 'No';
              const shortlistedStyle = computedShortlisted === 'Yes' ? styles.shortlistedYes : styles.shortlistedNo;
              return (
                <tr
                  key={index}
                  style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                >
                  <td style={styles.td}>{item.name || 'N/A'}</td>
                  <td style={styles.td}>{item.email || 'N/A'}</td>
                  <td style={styles.td}>{score.toFixed(2)}</td>
                  <td style={styles.td}>
                    <span style={shortlistedStyle}>{computedShortlisted}</span>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={item.email_sent ? styles.emailSentYes : styles.emailSentNo}
                    >
                      {item.email_sent ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const getStyles = (isDarkMode) => ({
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: isDarkMode ? '#1e2a3a' : '#f9f9f9',
    borderRadius: '8px',
    boxShadow: isDarkMode ? '0 2px 10px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  },
  heading: {
    textAlign: 'center',
    color: isDarkMode ? '#64b5f6' : '#333',
    marginBottom: '20px',
    textShadow: isDarkMode ? '0 0 10px rgba(100, 181, 246, 0.5)' : 'none',
    transition: 'all 0.3s ease'
  },
  sendButton: {
    display: 'block',
    margin: '0 auto 20px',
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: '0.3s ease',
  },
  clearButton: {
    display: 'block',
    margin: '0 auto 20px',
    padding: '12px 24px',
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: '0.3s ease',
  },
  thresholdBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  thresholdInput: {
    width: '80px',
    padding: '6px 8px',
    borderRadius: '6px',
    border: isDarkMode ? '1px solid #2d3a4a' : '1px solid #ccc',
    backgroundColor: isDarkMode ? '#0d1b26' : '#fff',
    color: isDarkMode ? '#e0e0e0' : '#333',
    transition: 'all 0.3s ease'
  },
  noResults: {
    textAlign: 'center',
    color: isDarkMode ? '#b0b0b0' : '#666',
    fontStyle: 'italic',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    backgroundColor: isDarkMode ? '#1e2a3a' : '#fff',
  },
  th: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '12px',
    borderBottom: isDarkMode ? '1px solid #2d3a4a' : '1px solid #ddd',
    color: isDarkMode ? '#e0e0e0' : '#333',
  },
  trEven: {
    backgroundColor: isDarkMode ? '#252f3f' : '#f2f2f2',
  },
  trOdd: {
    backgroundColor: isDarkMode ? '#1e2a3a' : 'white',
  },
  shortlistedYes: {
    color: 'green',
    fontWeight: 'bold',
  },
  shortlistedNo: {
    color: 'red',
    fontWeight: 'bold',
  },
  emailSentYes: {
    color: 'green',
    fontWeight: 'bold',
  },
  emailSentNo: {
    color: 'orange',
    fontWeight: 'bold',
  },
});