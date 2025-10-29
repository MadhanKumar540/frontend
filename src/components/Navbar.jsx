import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';
  const [user, setUser] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div style={{...navContainer, ...getNavStyles(isDarkMode)}}>
      <div style={rowContainer}>
        <div style={getLogoStyle(isDarkMode)}>EasyRecruit</div>
        {!isDashboard && (
          <div style={tabWrapper}>
            <NavTab to="/home" label="Home" />
            <NavTab to="/jd" label="Job Description" />
            <NavTab to="/upload" label="Upload Resumes" />
            <NavTab to="/results" label="Results" />
            <NavTab to="/shortlisted" label="Shortlisted" />
            <NavTab to="/analytics" label="Analytics" />
            {user && (
              <button onClick={handleLogout} style={logoutButton}>
                Logout
              </button>
            )}
          </div>
        )}
        {isDashboard && (
          <div style={actionsWrapper}>
            <Link to="/signup" style={actionLinkStyle}>
              <button style={primaryButton}>Sign Up</button>
            </Link>
            <Link to="/login" style={actionLinkStyle}>
              <button style={getSecondaryButtonStyle(isDarkMode)}>Login</button>
            </Link>
            <button onClick={toggleTheme} style={themeToggleButton} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        )}
        {!isDashboard && (
          <button onClick={toggleTheme} style={themeToggleButton} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        )}
      </div>
    </div>
  );
}
function NavTab({ to, label }) {
  const { isDarkMode } = useTheme();
  
  return (
    <NavLink
      to={to}
      style={({ isActive }) => {
        return {
          padding: '20px 16px',
          textDecoration: 'none',
          color: isActive 
            ? (isDarkMode ? '#64b5f6' : '#1a73e8')
            : (isDarkMode ? '#a0a0a0' : '#555'),
          borderBottom: isActive ? `3px solid ${isDarkMode ? '#64b5f6' : '#1a73e8'}` : '3px solid transparent',
          fontWeight: isActive ? 'bold' : 'normal',
          transition: 'all 0.3s ease'
        };
      }}
    >
      {label}
    </NavLink>
  );
}

const navContainer = {
  borderBottom: '1px solid #ddd',
  background: '#fff',
  boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
  transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
};

// Dark mode styles
function getNavStyles(isDarkMode) {
  if (isDarkMode) {
    return {
      borderColor: '#4b5563',
      backgroundColor: '#374151',
      boxShadow: '0 1px 5px rgba(0,0,0,0.3)',
    };
  }
  return {};
}

const getLogoStyle = (isDarkMode) => {
  return {
    fontSize: '30px',
    fontWeight: 'bold',
    color: isDarkMode ? '#64b5f6' : '#1a73e8',
    transition: 'color 0.3s ease',
  };
};

const rowContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '30px',
  paddingRight: '30px',
  background: 'transparent',
  transition: 'all 0.3s ease'
};

const tabWrapper = {
  display: 'flex',
  gap: '30px',
  background: 'transparent'
};

const actionsWrapper = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  marginLeft: 'auto',
};

const actionLinkStyle = {
  textDecoration: 'none'
};

const primaryButton = {
  backgroundColor: '#1a73e8',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)'
};

const secondaryButton = {
  backgroundColor: 'transparent',
  color: '#1a73e8',
  border: '2px solid #1a73e8',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',
  transition: 'all 0.3s ease',
};

const getSecondaryButtonStyle = (isDarkMode) => {
  if (isDarkMode) {
    return {
      ...secondaryButton,
      backgroundColor: 'transparent',
      color: '#64b5f6',
      borderColor: '#64b5f6'
    };
  }
  return secondaryButton;
};

const logoutButton = {
  backgroundColor: 'transparent',
  color: '#dc3545',
  border: '0px solid #dc3545',
  padding: '6px 12px',
  borderRadius: '2px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '13px',
  marginLeft: '15px',
};

const themeToggleButton = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  padding: '8px',
  marginLeft: '15px',
  transition: 'transform 0.3s ease',
};

const themeToggleButtonHover = {
  transform: 'scale(1.2)',
};
