import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
  const { isDarkMode } = useTheme();
  
  return (
    
    <div style={{ 
      padding: '60px 40px', 
      textAlign: 'center', 
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: isDarkMode ? '#1a1a2e' : '#f8f9fa',
      minHeight: '100vh',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Hero Section */}
      <div style={{ marginBottom: '60px' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          color: isDarkMode ? '#64b5f6' : '#1a73e8', 
          marginBottom: '10px',
          fontWeight: 'bold',
          textShadow: isDarkMode ? '0 0 10px rgba(100, 181, 246, 0.5)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          Welcome to <span style={{ 
            color: isDarkMode ? '#81c784' : '#34a853',
            textShadow: isDarkMode ? '0 0 10px rgba(129, 199, 132, 0.5)' : 'none'
          }}>EasyRecruit</span>
        </h1>
        <p style={{
          marginTop: '20px',
          fontSize: '1.2rem',
          color: isDarkMode ? '#e0e0e0' : '#555',
          lineHeight: '1.6',
          maxWidth: '800px',
          margin: '0 auto',
          textShadow: isDarkMode ? '0 0 5px rgba(100, 181, 246, 0.3)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          Revolutionize your hiring with our <strong style={{ color: isDarkMode ? '#90caf9' : '#1a73e8' }}>Multi-Agent AI Recruitment Platform</strong>. 
          Automate job screening using intelligent agents that summarize JDs, parse CVs, match candidates, 
          and schedule interviews—making smarter, faster hiring decisions effortless.
        </p>
      </div>

      {/* Agents Overview Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 60px',
        textAlign: 'left'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          color: isDarkMode ? '#64b5f6' : '#1a73e8',
          textAlign: 'center',
          marginBottom: '40px',
          textShadow: isDarkMode ? '0 0 10px rgba(100, 181, 246, 0.5)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          Powered by Intelligent AI Agents
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          <div style={{...agentCardStyle, 
            backgroundColor: isDarkMode ? '#1e2a3a' : 'white',
            borderColor: isDarkMode ? '#2d3a4a' : '#e0e0e0',
            boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ color: isDarkMode ? '#64b5f6' : '#1a73e8', marginBottom: '10px', textShadow: isDarkMode ? '0 0 5px rgba(100, 181, 246, 0.4)' : 'none' }}>📄 JD Summarizer Agent</h3>
            <p style={{ color: isDarkMode ? '#b0b0b0' : '#666', fontSize: '14px' }}>
              Automatically reads and distills complex job descriptions into concise, actionable summaries 
              to highlight key requirements and skills.
            </p>
          </div>
          <div style={{...agentCardStyle, 
            backgroundColor: isDarkMode ? '#1e2a3a' : 'white',
            borderColor: isDarkMode ? '#2d3a4a' : '#e0e0e0',
            boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ color: isDarkMode ? '#64b5f6' : '#1a73e8', marginBottom: '10px', textShadow: isDarkMode ? '0 0 5px rgba(100, 181, 246, 0.4)' : 'none' }}>📋 CV Parser Agent</h3>
            <p style={{ color: isDarkMode ? '#b0b0b0' : '#666', fontSize: '14px' }}>
              Extracts essential data from resumes—including experience, skills, education, and achievements— 
              for seamless analysis.
            </p>
          </div>
          <div style={{...agentCardStyle, 
            backgroundColor: isDarkMode ? '#1e2a3a' : 'white',
            borderColor: isDarkMode ? '#2d3a4a' : '#e0e0e0',
            boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ color: isDarkMode ? '#64b5f6' : '#1a73e8', marginBottom: '10px', textShadow: isDarkMode ? '0 0 5px rgba(100, 181, 246, 0.4)' : 'none' }}>🎯 Matching Agent</h3>
            <p style={{ color: isDarkMode ? '#b0b0b0' : '#666', fontSize: '14px' }}>
              Computes precise match scores between job descriptions and candidate CVs, ranking applicants 
              by relevance and fit.
            </p>
          </div>
          <div style={{...agentCardStyle, 
            backgroundColor: isDarkMode ? '#1e2a3a' : 'white',
            borderColor: isDarkMode ? '#2d3a4a' : '#e0e0e0',
            boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ color: isDarkMode ? '#64b5f6' : '#1a73e8', marginBottom: '10px', textShadow: isDarkMode ? '0 0 5px rgba(100, 181, 246, 0.4)' : 'none' }}>📅 Scheduler Agent</h3>
            <p style={{ color: isDarkMode ? '#b0b0b0' : '#666', fontSize: '14px' }}>
              Identifies top shortlisted candidates and automates personalized interview requests, 
              integrating with your calendar for efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <Link to="/jd">
          <button style={{...buttonStyle, 
            backgroundColor: isDarkMode ? '#1976d2' : 'blue',
            boxShadow: isDarkMode ? '0 4px 15px rgba(25, 118, 210, 0.5)' : '0 4px 12px rgba(26, 115, 232, 0.3)'
          }}>Start with Job Description</button>
        </Link>
        <Link to="/upload">
          <button style={{...buttonStyle, 
            backgroundColor: isDarkMode ? '#1976d2' : 'blue',
            boxShadow: isDarkMode ? '0 4px 15px rgba(25, 118, 210, 0.5)' : '0 4px 12px rgba(26, 115, 232, 0.3)'
          }}>Upload Resumes</button>
        </Link>
      </div>

      <footer style={{
        marginTop: '80px',
        paddingTop: '40px',
        borderTop: isDarkMode ? '1px solid #2d3a4a' : '1px solid #ddd',
        color: isDarkMode ? '#888' : '#888',
        fontSize: '14px',
        transition: 'all 0.3s ease'
      }}>
        <p style={{ color: isDarkMode ? '#64b5f6' : '#888' }}>© 2025 EasyRecruit. Built with AI for a smarter future in hiring.</p>
      </footer>
    </div>
  );
}

const buttonStyle = {
  color: 'white',
  fontSize: '16px',
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textDecoration: 'none',
  display: 'inline-block'
};

const agentCardStyle = {
  padding: '24px',
  borderRadius: '12px',
  transition: 'transform 0.2s ease',
  borderLeft: '4px solid #1a73e8',
  border: '1px solid #e0e0e0'
};

// Hover effects can be added with CSS if needed, but keeping it inline for simplicity