import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/home');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      
      // Provide more specific error messages
      let errorMsg = 'Failed to login. Please try again.';
      if (err.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this email. Please sign up first.';
      } else if (err.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed attempts. Please try again later.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = 'Network error. Please check your connection.';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '420px',
    margin: '40px auto',
    padding: '24px',
    background: isDarkMode ? '#1e2a3a' : '#fff',
    borderRadius: '12px',
    boxShadow: isDarkMode ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  };

  const headingStyle = {
    textAlign: 'center',
    color: isDarkMode ? '#64b5f6' : '#1a73e8',
    marginBottom: '20px',
    textShadow: isDarkMode ? '0 0 10px rgba(100, 181, 246, 0.5)' : 'none',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    marginBottom: '6px',
    color: isDarkMode ? '#90caf9' : '#333',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    padding: '10px 12px',
    borderRadius: '8px',
    border: isDarkMode ? '1px solid #2d3a4a' : '1px solid #ddd',
    backgroundColor: isDarkMode ? '#0d1b26' : '#fff',
    color: isDarkMode ? '#e0e0e0' : '#333',
    transition: 'all 0.3s ease'
  };

  const submitButtonStyle = {
    backgroundColor: isDarkMode ? '#1976d2' : '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: isDarkMode ? '0 4px 12px rgba(25, 118, 210, 0.4)' : '0 2px 8px rgba(26, 115, 232, 0.3)'
  };

  const errorBoxStyle = {
    background: isDarkMode ? '#3e2723' : '#fdecea',
    color: isDarkMode ? '#ef5350' : '#d93025',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '14px',
    border: isDarkMode ? '1px solid #d32f2f' : 'none',
    boxShadow: isDarkMode ? '0 0 10px rgba(239, 83, 80, 0.3)' : 'none',
    transition: 'all 0.3s ease'
  };

  const linkStyle = {
    color: isDarkMode ? '#64b5f6' : '#1a73e8',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  };

  const footerTextStyle = {
    textAlign: 'center',
    marginTop: '16px',
    color: isDarkMode ? '#b0b0b0' : '#333',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="jane@company.com"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="••••••••"
          />
        </div>

        {error && <div style={errorBoxStyle}>⚠️ {error}</div>}

        <button type="submit" style={submitButtonStyle} disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p style={footerTextStyle}>
        New here?{' '}
        <a href="/signup" style={linkStyle}>Create an account</a>
      </p>
    </div>
  );
}
