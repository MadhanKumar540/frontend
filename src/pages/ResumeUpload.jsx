// ResumeUpload.jsx (Modern Enhanced Design)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

export default function ResumeUpload() {
  const [files, setFiles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { isDarkMode } = useTheme();

  // Modern styling objects
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f7fa',
      minHeight: '100vh',
      position: 'relative',
      transition: 'all 0.3s ease'
    },
    header: {
      background: isDarkMode ? '#7c3aed' : '#8b5cf6',
      padding: '2rem',
      borderRadius: '16px',
      marginBottom: '2rem',
      color: 'white',
      boxShadow: isDarkMode ? '0 10px 30px rgba(124, 58, 237, 0.3)' : '0 10px 30px rgba(139, 92, 246, 0.3)',
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      margin: '0 0 0.5rem 0',
      color: '#ef4444',
      textShadow: '0 2px 10px rgba(239, 68, 68, 0.5)'
    },
    subtitle: {
      fontSize: '1.1rem',
      opacity: 0.95,
      margin: '0',
      color: '#fee2e2'
    },
    jobSection: {
      background: isDarkMode ? '#2d2d2d' : 'white',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
      border: isDarkMode ? '1px solid #404040' : '1px solid #e5e7eb'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #f3f4f6'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#1f2937',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    clearAllButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    noJobsMessage: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #78350f 0%, #92400e 100%)' 
        : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      padding: '1.5rem',
      borderRadius: '12px',
      color: isDarkMode ? '#fbbf24' : '#92400e',
      fontSize: '1rem',
      fontWeight: '500',
      textAlign: 'center',
      border: isDarkMode ? '1px solid #f59e0b' : '1px solid #fcd34d'
    },
    jobsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    jobCard: {
      background: isDarkMode ? '#373737' : 'white',
      border: isDarkMode ? '2px solid #404040' : '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    jobCardSelected: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' 
        : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      borderColor: '#3b82f6',
      transform: 'translateY(-2px)',
      boxShadow: isDarkMode 
        ? '0 8px 16px rgba(37, 99, 235, 0.4)' 
        : '0 8px 16px rgba(59, 130, 246, 0.2)'
    },
    jobCardTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#1f2937',
      marginBottom: '0.25rem'
    },
    jobCardCompany: {
      fontSize: '0.875rem',
      color: isDarkMode ? '#a0a0a0' : '#6b7280'
    },
    deleteButton: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '28px',
      height: '28px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
    },
    jobDetails: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)' 
        : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginTop: '1.5rem',
      border: isDarkMode ? '1px solid #3b82f6' : '1px solid #bae6fd'
    },
    detailsTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: isDarkMode ? '#93c5fd' : '#1e40af',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    detailRow: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '0.75rem',
      flexWrap: 'wrap'
    },
    detailLabel: {
      fontWeight: '600',
      color: isDarkMode ? '#d1d5db' : '#374151',
      minWidth: '100px'
    },
    detailValue: {
      color: isDarkMode ? '#ffffff' : '#1f2937',
      flex: '1'
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    skillTag: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '0.375rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    uploadSection: {
      background: isDarkMode ? '#2d2d2d' : 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
      border: isDarkMode ? '1px solid #404040' : '1px solid #e5e7eb',
      textAlign: 'center'
    },
    themeToggleButton: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: isDarkMode ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
      zIndex: 1000
    },
    fileInputWrapper: {
      position: 'relative',
      display: 'inline-block',
      width: '100%',
      maxWidth: '500px'
    },
    fileInput: {
      position: 'absolute',
      opacity: '0',
      width: '100%',
      height: '100%',
      cursor: 'pointer'
    },
    fileInputButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)' 
        : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      border: isDarkMode ? '3px dashed #3b82f6' : '3px dashed #60a5fa',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      gap: '1rem',
      pointerEvents: 'none'
    },
    fileInputButtonHover: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' 
        : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      borderColor: '#3b82f6',
      transform: 'scale(1.02)'
    },
    uploadIcon: {
      fontSize: '3rem',
      color: isDarkMode ? '#60a5fa' : '#3b82f6'
    },
    uploadText: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: isDarkMode ? '#93c5fd' : '#1e40af',
      margin: '0'
    },
    uploadSubtext: {
      fontSize: '0.875rem',
      color: isDarkMode ? '#a0a0a0' : '#6b7280',
      margin: '0'
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/jobs`);
        const allJobs = res.data.jobs || [];
        
        // Filter out jobs with invalid ObjectIds
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;
        const validJobs = allJobs.filter(job => objectIdPattern.test(job._id));
        
        if (validJobs.length !== allJobs.length) {
          console.warn(`Filtered out ${allJobs.length - validJobs.length} invalid job IDs`);
          // Clean up invalid jobs from the database
          try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/cleanup-invalid-jobs`);
            console.log("✅ Cleaned up invalid jobs from database");
          } catch (cleanupErr) {
            console.error("Error cleaning up invalid jobs:", cleanupErr);
          }
        }
        
        setJobs(validJobs);
        if (validJobs.length === 0) {
          alert("⚠️ No valid jobs posted yet. Please process a Job Description first.");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        alert("❌ Error fetching jobs.");
      }
    };
    fetchJobs();
  }, []);

  const handleUpload = async (e) => {
    const selected = e.target.files;
    if (!selected.length) return;

    if (!selectedJobId) {
      alert("⚠️ Select a job first from the list below.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    for (const file of selected) {
      formData.append("resumes", file);
    }
    formData.append("job_id", selectedJobId);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload-resumes`, formData);
      localStorage.setItem("recruitai-results", JSON.stringify(res.data.results));
      alert("✅ Resumes processed! View results in the Results tab.");
    } catch (err) {
      alert("❌ Error uploading resumes: " + (err.response?.data?.error || err.message));
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    // Validate that jobId is a valid MongoDB ObjectId (24 hex characters)
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(jobId)) {
      alert("❌ Invalid job ID format. Cannot delete this job.");
      console.error('Invalid job ID:', jobId);
      return;
    }

    try {
      console.log('Deleting job with ID:', jobId);
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/delete-job?job_id=${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      if (selectedJobId === jobId) {
        setSelectedJobId(null);
        setSelectedJob(null);
      }
      alert("✅ Job deleted successfully!");
    } catch (err) {
      console.error('Delete error details:', err);
      console.error('Response:', err.response?.data);
      alert("❌ Error deleting job: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteAllJobs = async () => {
    if (!window.confirm("Are you sure you want to delete ALL jobs? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/delete-all-jobs`);
      setJobs([]);
      setSelectedJobId(null);
      setSelectedJob(null);
      alert("✅ All jobs deleted successfully!");
    } catch (err) {
      alert("❌ Error deleting jobs: " + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Modern Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📄 Resume Upload</h1>
        <p style={styles.subtitle}>Upload candidate resumes for automated screening and matching</p>
      </div>

      {/* Job Selection Section */}
      <div style={styles.jobSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            🎯 Select Target Job
          </h2>
          {jobs.length > 0 && (
            <button
              onClick={handleDeleteAllJobs}
              style={styles.clearAllButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
            >
              🗑️ Clear All
            </button>
          )}
        </div>

        {jobs.length === 0 ? (
          <div style={styles.noJobsMessage}>
            ⚠️ No jobs posted yet. Please process a Job Description first.
          </div>
        ) : (
          <div style={styles.jobsGrid}>
            {jobs.map((job) => (
              <div
                key={job._id}
                style={{
                  ...styles.jobCard,
                  ...(selectedJobId === job._id ? styles.jobCardSelected : {})
                }}
                onClick={() => {
                  setSelectedJobId(job._id);
                  setSelectedJob(job);
                }}
                onMouseEnter={(e) => {
                  if (selectedJobId !== job._id) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedJobId !== job._id) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteJob(job._id);
                  }}
                  style={styles.deleteButton}
                  title="Delete job"
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  ×
                </button>
                <div style={styles.jobCardTitle}>{job.title || '—'}</div>
                <div style={styles.jobCardCompany}>{job.company || '—'}</div>
              </div>
            ))}
          </div>
        )}

        {selectedJob && (
          <div style={styles.jobDetails}>
            <div style={styles.detailsTitle}>📋 Job Details</div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Title:</span>
              <span style={styles.detailValue}>{selectedJob.title || '—'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Company:</span>
              <span style={styles.detailValue}>{selectedJob.company || '—'}</span>
            </div>
            {Array.isArray(selectedJob.skills) && selectedJob.skills.length > 0 && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Skills:</span>
                <div style={styles.skillsContainer}>
                  {selectedJob.skills.map((skill, idx) => (
                    <span key={idx} style={styles.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(selectedJob.certifications) && selectedJob.certifications.length > 0 && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Certifications:</span>
                <div style={styles.skillsContainer}>
                  {selectedJob.certifications.map((cert, idx) => (
                    <span key={idx} style={styles.skillTag}>🎖️ {cert}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div style={styles.uploadSection}>
        <h2 style={styles.sectionTitle}>📤 Upload Resumes</h2>
        <div style={styles.fileInputWrapper}>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleUpload}
            disabled={!selectedJobId || isUploading}
            style={styles.fileInput}
          />
          <div style={{
            ...styles.fileInputButton,
            ...(selectedJobId && !isUploading ? styles.fileInputButtonHover : {}),
            opacity: selectedJobId ? 1 : 0.5
          }}>
            <div style={styles.uploadIcon}>📎</div>
            <p style={styles.uploadText}>
              {isUploading ? '⏳ Uploading...' : 'Click to Upload PDFs'}
            </p>
            <p style={styles.uploadSubtext}>
              Select multiple PDF resumes to upload
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}