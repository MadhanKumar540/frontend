// JobDescription.jsx (Updated with proper backend calls and navigation)
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router for navigation
import { useTheme } from '../contexts/ThemeContext';
import './JobDescription.css';

const JobDescription = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription) {
      alert("⚠️ Job Description is required.");
      return;
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/manual-jd`, {
        job_title: jobTitle,
        company_name: companyName,
        jd_text: jobDescription
      });
      console.log("Manual JD result:", res.data.jd);
      alert("✅ Job Description processed!");
      navigate("/upload");  // Navigate to ResumeUpload route
    } catch (err) {
      alert("❌ Error processing manual JD: " + (err.response?.data?.error || err.message));
      console.error(err);
    }
  }; 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("⚠️ Please select a CSV file first.");
      return;
    }
    if (!file.name.endsWith('.csv')) {
      alert("⚠️ File must be a CSV.");
      return;
    }

    const formData = new FormData();
    formData.append("jd", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload-jd`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("✅ Job Description CSV uploaded successfully!");
      navigate("/upload");
    } catch (err) {
      alert("❌ Error uploading JD CSV: " + (err.response?.data?.error || err.message) + "\nFix and retry before uploading resumes.");
      console.error("CSV JD error:", err);
    }
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: 'auto',
    padding: '2rem',
    background: isDarkMode ? '#1e2a3a' : '#fff',
    borderRadius: '12px',
    boxShadow: isDarkMode ? '0 6px 18px rgba(0, 0, 0, 0.5)' : '0 6px 18px rgba(0, 0, 0, 0.06)',
    fontFamily: "'Segoe UI', sans-serif",
    transition: 'all 0.3s ease'
  };

  const headingStyle = {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '10px',
    color: isDarkMode ? '#64b5f6' : '#333',
    textShadow: isDarkMode ? '0 0 10px rgba(100, 181, 246, 0.5)' : 'none',
    transition: 'all 0.3s ease'
  };

  const subtextStyle = {
    fontSize: '15px',
    color: isDarkMode ? '#b0b0b0' : '#555',
    marginBottom: '30px',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>📄 Process Job Description</h2>
      <p style={subtextStyle}>Fill in the job details below or upload a CSV file to extract key information.</p>

      <form className="jd-form" onSubmit={handleManualSubmit}>
        <div className="jd-row">
          <div className="jd-field">
            <label>Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div className="jd-field">
            <label>Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Google"
            />
          </div>
        </div>

        <div className="jd-field full-width">
          <label>Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Write the job description here..."
            rows={6}
          />
        </div>

        <button type="submit" className="jd-button">📌 Process Job Description</button>
      </form>

      <div className="jd-divider">OR</div>

      <div className="jd-upload">
        <label>Upload Job Description CSV</label>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleFileUpload} className="jd-button secondary">📤 Upload CSV</button>
      </div>
    </div>
  );
};

export default JobDescription;