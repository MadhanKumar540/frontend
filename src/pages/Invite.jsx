import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Invite() {
  const { isDarkMode } = useTheme();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("recruitai-results");
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  const shortlisted = results.filter((r) => r.shortlisted && r.email_invite);

  const containerStyle = {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: isDarkMode ? '#1e2a3a' : '#f9f9f9',
    borderRadius: '12px',
    boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  const headingStyle = {
    textAlign: 'center',
    color: isDarkMode ? '#64b5f6' : '#1a73e8',
    marginBottom: '30px',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: isDarkMode ? '0 0 10px rgba(100, 181, 246, 0.5)' : 'none',
    transition: 'all 0.3s ease'
  };

  const noCandidatesStyle = {
    textAlign: 'center',
    color: isDarkMode ? '#b0b0b0' : '#666',
    fontSize: '18px',
    fontStyle: 'italic',
    padding: '40px',
    backgroundColor: isDarkMode ? '#252f3f' : '#fff',
    borderRadius: '8px',
    boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const emailCardStyle = {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: isDarkMode ? '#252f3f' : '#fff',
    borderRadius: '8px',
    boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid #4CAF50'
  };

  const nameStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: isDarkMode ? '#64b5f6' : '#1a73e8',
    marginBottom: '10px',
    textShadow: isDarkMode ? '0 0 5px rgba(100, 181, 246, 0.4)' : 'none',
  };

  const preStyle = {
    background: isDarkMode ? '#0d1b26' : '#f5f5f5',
    padding: '15px',
    borderRadius: '6px',
    color: isDarkMode ? '#e0e0e0' : '#333',
    fontSize: '14px',
    border: isDarkMode ? '1px solid #2d3a4a' : '1px solid #ddd',
    overflow: 'auto',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Email Invites</h1>
      {shortlisted.length === 0 ? (
        <div style={noCandidatesStyle}>
          <p>No candidates were shortlisted.</p>
        </div>
      ) : (
        shortlisted.map((r, i) => (
          <div key={i} style={emailCardStyle}>
            <h4 style={nameStyle}>📨 {r.name}</h4>
            <pre style={preStyle}>{r.email_invite}</pre>
          </div>
        ))
      )}
    </div>
  );
}
