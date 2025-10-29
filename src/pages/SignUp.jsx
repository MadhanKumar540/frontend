import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useTheme } from '../contexts/ThemeContext';

export default function Signup() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    role: 'recruiter',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email || !form.password || !form.company) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating user with email:', form.email);
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCred.user.uid;
      console.log('User created with UID:', uid);

      // Store user profile in Firestore (password is managed by Firebase Auth)
      console.log('Attempting to save to Firestore...');
      const userData = {
        uid,
        name: form.name,
        email: form.email,
        company: form.company,
        role: form.role,
        createdAt: serverTimestamp(),
      };
      console.log('User data to save:', userData);
      
      await setDoc(doc(db, 'users', uid), userData);
      console.log('✅ Successfully saved to Firestore!');

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      console.error('❌ Signup error details:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      // Provide more specific error messages
      let errorMsg = err.message || 'Failed to sign up.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered. Please login instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address. Please enter a valid email.';
      } else if (err.code === 'auth/configuration-not-found') {
        errorMsg = 'Firebase Authentication is not enabled. Please enable Email/Password auth in Firebase Console.';
      } else if (err.code?.includes('permission')) {
        errorMsg = 'Firestore permission error. Please check Firebase security rules.';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '480px',
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

  const selectStyle = {
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

  const successBoxStyle = {
    background: isDarkMode ? '#1b4332' : '#e6f4ea',
    color: isDarkMode ? '#66bb6a' : '#1e8e3e',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '14px',
    border: isDarkMode ? '1px solid #388e3c' : 'none',
    boxShadow: isDarkMode ? '0 0 10px rgba(102, 187, 106, 0.3)' : 'none',
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
      <h1 style={headingStyle}>Create your recruiter account</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Jane Doe"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
            placeholder="jane@company.com"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
            placeholder="••••••••"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Company</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Acme Inc."
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Role</label>
          <select name="role" value={form.role} onChange={handleChange} style={selectStyle}>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        {error && <div style={errorBoxStyle}>⚠️ {error}</div>}
        {success && <div style={successBoxStyle}>✅ {success}</div>}

        <button type="submit" style={submitButtonStyle} disabled={loading}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>

      <p style={footerTextStyle}>
        Already have an account?{' '}
        <a href="/login" style={linkStyle}>Login</a>
      </p>
    </div>
  );
}


