import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  
  const styles = getStyles(isDarkMode);
  
  return (
    <div style={styles.container}>
      
      {/* Main Content Container */}
      <div style={styles.contentContainer}>
        
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <h1 style={styles.mainTitle}>
            Welcome to <span style={styles.accentText}>EasyRecruit</span>
            <span style={styles.glitter}>✨</span>
          </h1>
          
          <p style={styles.subtitle}>
            Revolutionize your hiring with our <strong>Multi-Agent AI Recruitment Platform</strong>. 
            Automate job screening using intelligent agents that summarize JDs, parse CVs, match candidates, 
            and schedule interviews—making smarter, faster hiring decisions effortless.
          </p>
        </div>

        {/* Agents Overview Section */}
        <div style={styles.agentsSection}>
          <h2 style={styles.sectionTitle}>
            Powered by Intelligent AI Agents
          </h2>
          
          <div style={styles.agentsGrid}>
            {[
              { 
                icon: '📄', 
                title: 'JD Summarizer Agent', 
                description: 'Automatically reads and distills complex job descriptions into concise, actionable summaries to highlight key requirements and skills.',
                color: '#3B82F6'
              },
              { 
                icon: '📋', 
                title: 'CV Parser Agent', 
                description: 'Extracts essential data from resumes—including experience, skills, education, and achievements—for seamless analysis.',
                color: '#8B5CF6'
              },
              { 
                icon: '🎯', 
                title: 'Matching Agent', 
                description: 'Computes precise match scores between job descriptions and candidate CVs, ranking applicants by relevance and fit.',
                color: '#06B6D4'
              },
              { 
                icon: '📅', 
                title: 'Scheduler Agent', 
                description: 'Identifies top shortlisted candidates and automates personalized interview requests, integrating with your calendar for efficiency.',
                color: '#10B981'
              }
            ].map((agent, index) => (
              <div 
                key={index}
                style={styles.agentCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = styles.agentCardHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = styles.agentCard.boxShadow;
                }}
              >
                <div style={{...styles.agentIcon, backgroundColor: `${agent.color}20`}}>
                  <span style={{fontSize: '2rem'}}>{agent.icon}</span>
                </div>
                <h3 style={{...styles.agentTitle, color: agent.color}}>
                  {agent.title}
                </h3>
                <p style={styles.agentDescription}>
                  {agent.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div style={styles.ctaSection}>
          <Link to="/jd" style={styles.link}>
            <button style={styles.primaryButton}>
              🚀 Start with Job Description
            </button>
          </Link>
          <Link to="/upload" style={styles.link}>
            <button style={styles.secondaryButton}>
              📤 Upload Resumes
            </button>
          </Link>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            © 2025 EasyRecruit. Built with AI for a smarter future in hiring. ✨
          </p>
        </footer>
      </div>
    </div>
  );
}

const getStyles = (isDarkMode) => ({
  container: {
    padding: '40px 20px',
    textAlign: 'center',
    fontFamily: 'Segoe UI, system-ui, sans-serif',
    background: isDarkMode 
      ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
      : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    minHeight: '100vh',
    transition: 'all 0.3s ease'
  },

  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '50px 40px',
    boxShadow: isDarkMode 
      ? '0 20px 40px rgba(0,0,0,0.3)' 
      : '0 20px 40px rgba(0,0,0,0.1)',
    border: isDarkMode 
      ? '1px solid rgba(255,255,255,0.1)' 
      : '1px solid rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease'
  },

  heroSection: {
    marginBottom: '60px'
  },

  mainTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: isDarkMode ? '#F1F5F9' : '#1E293B', // Unchanged, good contrast
    marginBottom: '20px',
    lineHeight: '1.2'
  },

  accentText: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },

  glitter: {
    fontSize: '1.5rem',
    marginLeft: '8px',
    animation: 'glitter 2s ease-in-out infinite',
    display: 'inline-block'
  },

  subtitle: {
    fontSize: '1.2rem',
    color: isDarkMode ? '#CBD5E1' : '#334155', // Darker gray for light mode
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)',
    borderRadius: '12px',
    borderLeft: '4px solid #3B82F6'
  },

  agentsSection: {
    maxWidth: '1200px',
    margin: '0 auto 60px',
    textAlign: 'left'
  },

  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '50px',
    color: isDarkMode ? '#F1F5F9' : '#1E293B', // Unchanged, gradient effect is fine
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },

  agentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    marginBottom: '40px'
  },

  agentCard: {
    background: isDarkMode 
      ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    padding: '32px 24px',
    borderRadius: '16px',
    boxShadow: isDarkMode 
      ? '0 8px 25px rgba(0,0,0,0.2)' 
      : '0 8px 25px rgba(0,0,0,0.08)',
    border: isDarkMode 
      ? '1px solid rgba(255,255,255,0.05)' 
      : '1px solid rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },

  agentCardHover: {
    boxShadow: isDarkMode 
      ? '0 15px 35px rgba(0,0,0,0.4)' 
      : '0 15px 35px rgba(0,0,0,0.15)'
  },

  agentIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    transition: 'all 0.3s ease'
  },

  agentTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '16px',
    transition: 'all 0.3s ease'
  },

  agentDescription: {
    color: isDarkMode ? '#CBD5E1' : '#334155', // Darker gray for light mode
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0
  },

  ctaSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '40px'
  },

  link: {
    textDecoration: 'none'
  },

  primaryButton: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    color: 'white', // Unchanged, high contrast
    fontSize: '16px',
    padding: '16px 32px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
    minWidth: '220px'
  },

  secondaryButton: {
    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(59, 130, 246, 0.1)',
    color: isDarkMode ? '#E2E8F0' : '#3B82F6', // Unchanged, good contrast
    fontSize: '16px',
    padding: '16px 32px',
    borderRadius: '12px',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid #3B82F6',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    minWidth: '220px',
    backdropFilter: 'blur(10px)'
  },

  footer: {
    marginTop: '60px',
    paddingTop: '40px',
    borderTop: isDarkMode 
      ? '1px solid rgba(255,255,255,0.1)' 
      : '1px solid rgba(0,0,0,0.1)'
  },

  footerText: {
    color: isDarkMode ? '#94A3B8' : '#334155', // Darker gray for light mode
    fontSize: '14px',
    fontWeight: '500',
    margin: 0
  }
});
