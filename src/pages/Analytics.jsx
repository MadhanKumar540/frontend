import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

export default function Analytics() {
  const { isDarkMode } = useTheme();

  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    
    // Add CSS animation styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);

    // Cleanup function to remove the style sheet
    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching analytics data...');
      
      // Fetch candidates
      const candidatesRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-results`);
      console.log('Candidates data:', candidatesRes.data);
      setCandidates(candidatesRes.data.results || []);
      
      // Fetch jobs
      const jobsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/jobs`);
      console.log('Jobs data:', jobsRes.data);
      setJobs(jobsRes.data.jobs || []);
      
    } catch (err) {
      console.error("❌ Error fetching analytics data:", err);
      const errorMsg = err.response 
        ? `Server error: ${err.response.status} - ${err.response.data}`
        : `Network error: ${err.message}`;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCandidates = () => {
    if (selectedJobId === 'all') return candidates;
    return candidates.filter(c => c.job_id === selectedJobId);
  };

  const calculateAnalytics = () => {
    const filteredCandidates = getFilteredCandidates();
    const totalCandidates = filteredCandidates.length;
    
    if (totalCandidates === 0) {
      return {
        totalCandidates: 0,
        averageScore: 0,
        shortlistedCount: 0,
        shortlistRate: 0,
        emailsSent: 0,
        emailRate: 0,
        scoreDistribution: { excellent: 0, good: 0, average: 0, poor: 0 },
        topSkills: [],
        jobBreakdown: []
      };
    }

    const scores = filteredCandidates.map(c => Number(c.score) || 0);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / totalCandidates;
    
    const shortlistedCount = filteredCandidates.filter(c => c.shortlisted).length;
    const shortlistRate = (shortlistedCount / totalCandidates) * 100;
    
    const emailsSent = filteredCandidates.filter(c => c.email_sent).length;
    const emailRate = shortlistedCount > 0 ? (emailsSent / shortlistedCount) * 100 : 0;

    // Score distribution
    const scoreDistribution = {
      excellent: scores.filter(s => s >= 80).length,
      good: scores.filter(s => s >= 60 && s < 80).length,
      average: scores.filter(s => s >= 40 && s < 60).length,
      poor: scores.filter(s => s < 40).length
    };

    // Job breakdown
    const jobBreakdown = {};
    filteredCandidates.forEach(c => {
      const jobId = c.job_id || 'Unknown';
      if (!jobBreakdown[jobId]) {
        jobBreakdown[jobId] = { count: 0, avgScore: 0, shortlisted: 0 };
      }
      jobBreakdown[jobId].count++;
      jobBreakdown[jobId].avgScore += Number(c.score) || 0;
      if (c.shortlisted) jobBreakdown[jobId].shortlisted++;
    });

    // Calculate averages for job breakdown
    Object.keys(jobBreakdown).forEach(jobId => {
      jobBreakdown[jobId].avgScore = jobBreakdown[jobId].avgScore / jobBreakdown[jobId].count;
    });

    return {
      totalCandidates,
      averageScore,
      shortlistedCount,
      shortlistRate,
      emailsSent,
      emailRate,
      scoreDistribution,
      jobBreakdown: Object.entries(jobBreakdown).map(([jobId, data]) => ({
        jobId,
        ...data
      }))
    };
  };

  const analytics = calculateAnalytics();

  const getJobTitle = (jobId) => {
    const job = jobs.find(j => j._id === jobId);
    return job ? `${job.title} - ${job.company}` : jobId;
  };

  // Debug information
  console.log('Current state:', {
    loading,
    error,
    candidatesCount: candidates.length,
    jobsCount: jobs.length,
    selectedJobId,
    isDarkMode,
    analytics
  });

  if (loading) {
    return (
      <div style={getStyles(isDarkMode).container}>
        <h1 style={getStyles(isDarkMode).heading}>Analytics Dashboard</h1>
        <div style={getStyles(isDarkMode).loadingContainer}>
          <div style={getStyles(isDarkMode).spinner}>⏳</div>
          <p style={getStyles(isDarkMode).loadingText}>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={getStyles(isDarkMode).container}>
        <h1 style={getStyles(isDarkMode).heading}>Analytics Dashboard</h1>
        <div style={getStyles(isDarkMode).errorContainer}>
          <div style={getStyles(isDarkMode).errorIcon}>❌</div>
          <h3 style={getStyles(isDarkMode).errorTitle}>Failed to Load Data</h3>
          <p style={getStyles(isDarkMode).errorMessage}>{error}</p>
          <button onClick={fetchData} style={getStyles(isDarkMode).retryButton}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  const styles = getStyles(isDarkMode);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Analytics Dashboard</h1>
      
      {/* Debug Info - Remove in production */}
      <div style={styles.debugInfo}>
        <small>
          Candidates: {candidates.length} | Jobs: {jobs.length} | 
          Dark Mode: {isDarkMode ? 'Yes' : 'No'}
        </small>
      </div>
      
      {/* Job Filter */}
      <div style={styles.filterContainer}>
        <label htmlFor="jobFilter" style={styles.filterLabel}>Filter by Job:</label>
        <select
          id="jobFilter"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Jobs</option>
          {jobs.map(job => (
            <option key={job._id} value={job._id}>
              {job.title} - {job.company}
            </option>
          ))}
        </select>
      </div>

      {/* Key Metrics */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricNumber}>{analytics.totalCandidates}</div>
          <div style={styles.metricLabel}>Total Candidates</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricNumber}>{analytics.averageScore.toFixed(1)}%</div>
          <div style={styles.metricLabel}>Average Score</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricNumber}>{analytics.shortlistedCount}</div>
          <div style={styles.metricLabel}>Shortlisted</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricNumber}>{analytics.shortlistRate.toFixed(1)}%</div>
          <div style={styles.metricLabel}>Shortlist Rate</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricNumber}>{analytics.emailsSent}</div>
          <div style={styles.metricLabel}>Emails Sent</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricNumber}>{analytics.emailRate.toFixed(1)}%</div>
          <div style={styles.metricLabel}>Email Rate</div>
        </div>
      </div>

      {/* No Data Message */}
      {analytics.totalCandidates === 0 && (
        <div style={styles.noDataContainer}>
          <div style={styles.noDataIcon}>📊</div>
          <h3 style={styles.noDataTitle}>No Data Available</h3>
          <p style={styles.noDataMessage}>
            No candidate data found. Please upload resumes and process them first.
          </p>
        </div>
      )}

      {/* Score Distribution */}
      {analytics.totalCandidates > 0 && (
        <>
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Score Distribution</h3>
            <div style={styles.distributionChart}>
              {[
                { label: 'Excellent (80-100%)', count: analytics.scoreDistribution.excellent, color: '#4CAF50' },
                { label: 'Good (60-79%)', count: analytics.scoreDistribution.good, color: '#2196F3' },
                { label: 'Average (40-59%)', count: analytics.scoreDistribution.average, color: '#FF9800' },
                { label: 'Poor (0-39%)', count: analytics.scoreDistribution.poor, color: '#F44336' }
              ].map((item, index) => (
                <div key={index} style={styles.distributionBar}>
                  <div style={styles.distributionLabel}>{item.label}</div>
                  <div style={styles.distributionBarContainer}>
                    <div 
                      style={{
                        ...styles.distributionBarFill,
                        width: `${analytics.totalCandidates > 0 ? (item.count / analytics.totalCandidates) * 100 : 0}%`,
                        backgroundColor: item.color
                      }}
                    />
                    <span style={styles.distributionCount}>{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Performance */}
          {selectedJobId === 'all' && analytics.jobBreakdown.length > 1 && (
            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>Performance by Job</h3>
              <div style={styles.jobTable}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Job</th>
                      <th style={styles.th}>Candidates</th>
                      <th style={styles.th}>Avg Score</th>
                      <th style={styles.th}>Shortlisted</th>
                      <th style={styles.th}>Shortlist Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.jobBreakdown.map((job, index) => (
                      <tr key={job.jobId} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                        <td style={styles.td}>{getJobTitle(job.jobId)}</td>
                        <td style={styles.td}>{job.count}</td>
                        <td style={styles.td}>{job.avgScore.toFixed(1)}%</td>
                        <td style={styles.td}>{job.shortlisted}</td>
                        <td style={styles.td}>{((job.shortlisted / job.count) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Refresh Button */}
      <div style={styles.refreshContainer}>
        <button onClick={fetchData} style={styles.refreshButton}>
          🔄 Refresh Analytics
        </button>
      </div>
    </div>
  );
}

const getStyles = (isDarkMode) => ({
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '40px 20px',
    background: isDarkMode 
      ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
      : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    borderRadius: '20px',
    boxShadow: isDarkMode 
      ? '0 20px 40px rgba(0,0,0,0.3)' 
      : '0 20px 40px rgba(0,0,0,0.1)',
    minHeight: '500px',
    fontFamily: 'Segoe UI, system-ui, sans-serif',
    transition: 'all 0.3s ease',
  },
  heading: {
    textAlign: 'center',
    color: isDarkMode ? '#F1F5F9' : '#1E293B',
    marginBottom: '30px',
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  debugInfo: {
    textAlign: 'center',
    color: isDarkMode ? '#94A3B8' : '#64748B',
    fontSize: '12px',
    marginBottom: '20px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    boxShadow: isDarkMode ? '0 8px 25px rgba(0,0,0,0.2)' : '0 8px 25px rgba(0,0,0,0.08)',
  },
  spinner: {
    fontSize: '3rem',
    marginBottom: '20px',
    animation: 'spin 1s linear infinite',
    color: isDarkMode ? '#64B5F6' : '#1A73E8',
  },
  loadingText: {
    color: isDarkMode ? '#CBD5E1' : '#334155',
    fontSize: '18px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px 20px',
    background: isDarkMode ? 'rgba(45, 31, 31, 0.8)' : 'rgba(255, 234, 234, 0.9)',
    borderRadius: '12px',
    margin: '20px 0',
    boxShadow: isDarkMode ? '0 8px 25px rgba(0,0,0,0.2)' : '0 8px 25px rgba(0,0,0,0.08)',
    border: isDarkMode ? '1px solid rgba(255, 99, 99, 0.2)' : '1px solid rgba(211, 47, 47, 0.2)',
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '20px',
    color: isDarkMode ? '#FF6B6B' : '#D32F2F',
  },
  errorTitle: {
    color: isDarkMode ? '#FF6B6B' : '#D32F2F',
    marginBottom: '10px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: isDarkMode ? '#CBD5E1' : '#334155',
    marginBottom: '20px',
    fontSize: '16px',
  },
  noDataContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    margin: '20px 0',
    boxShadow: isDarkMode ? '0 8px 25px rgba(0,0,0,0.2)' : '0 8px 25px rgba(0,0,0,0.08)',
  },
  noDataIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
    color: isDarkMode ? '#64B5F6' : '#1A73E8',
  },
  noDataTitle: {
    color: isDarkMode ? '#F1F5F9' : '#1E293B',
    marginBottom: '10px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  noDataMessage: {
    color: isDarkMode ? '#CBD5E1' : '#334155',
    fontSize: '16px',
  },
  retryButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '30px',
    padding: '16px',
    background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    boxShadow: isDarkMode ? '0 8px 25px rgba(0,0,0,0.2)' : '0 8px 25px rgba(0,0,0,0.08)',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
  },
  filterLabel: {
    fontWeight: 'bold',
    color: isDarkMode ? '#F1F5F9' : '#1E293B',
    fontSize: '14px',
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid #3B82F6',
    fontSize: '14px',
    minWidth: '200px',
    background: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : '#FFFFFF',
    color: isDarkMode ? '#F1F5F9' : '#1E293B',
    transition: 'all 0.3s ease',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  metricCard: {
    background: isDarkMode 
      ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    padding: '24px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: isDarkMode ? '0 8px 25px rgba(0,0,0,0.2)' : '0 8px 25px rgba(0,0,0,0.08)',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
  },
  metricNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: isDarkMode ? '#64B5F6' : '#1A73E8',
    marginBottom: '8px',
  },
  metricLabel: {
    fontSize: '14px',
    color: isDarkMode ? '#CBD5E1' : '#334155',
    fontWeight: '500',
  },
  chartContainer: {
    background: isDarkMode 
      ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: isDarkMode ? '0 8px 25px rgba(0,0,0,0.2)' : '0 8px 25px rgba(0,0,0,0.08)',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.8)',
  },
  chartTitle: {
    color: isDarkMode ? '#F1F5F9' : '#1E293B',
    marginBottom: '20px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  distributionChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  distributionBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  distributionLabel: {
    minWidth: '140px',
    fontSize: '14px',
    fontWeight: '500',
    color: isDarkMode ? '#CBD5E1' : '#334155',
  },
  distributionBarContainer: {
    flex: 1,
    height: '24px',
    background: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(241, 245, 249, 0.8)',
    borderRadius: '12px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  distributionBarFill: {
    height: '100%',
    borderRadius: '12px',
    transition: 'width 0.3s ease',
  },
  distributionCount: {
    position: 'absolute',
    right: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: isDarkMode ? '#F1F5F9' : '#1E293B',
  },
  jobTable: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    background: isDarkMode 
      ? 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
      : '#1A73E8',
    color: isDarkMode ? '#F1F5F9' : 'white',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  td: {
    padding: '12px',
    borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee',
    fontSize: '14px',
    color: isDarkMode ? '#CBD5E1' : '#334155',
  },
  trEven: {
    background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 249, 250, 0.9)',
  },
  trOdd: {
    background: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
  },
  refreshContainer: {
    textAlign: 'center',
    marginTop: '30px',
  },
  refreshButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
  },
});