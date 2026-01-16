import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [ritualStats, setRitualStats] = useState({});
  const [loading, setLoading] = useState(true);

  const allRituals = [
    { id: 1, name: 'Mindfulness', color: '#c65d3b' },
    { id: 2, name: 'Journal Writing', color: '#4a5d6b' },
    { id: 3, name: 'Tapping', color: '#c65d3b' },
    { id: 4, name: 'Positive Affirmation', color: '#4a5d6b' },
    { id: 5, name: 'Visualization', color: '#c65d3b' },
    { id: 6, name: 'Forgiveness', color: '#4a5d6b' },
    { id: 7, name: 'Gratitude', color: '#c65d3b' },
    { id: 8, name: 'Mirror Work', color: '#4a5d6b' },
    { id: 9, name: 'Planning', color: '#c65d3b' },
    { id: 10, name: 'Body Work', color: '#4a5d6b' },
  ];

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user?.id]);

  const loadStats = async () => {
    if (!user) return;
    
    const studentId = user.id;
    if (!studentId) {
      return;
    }
    
    try {
      const { data: sessions, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading stats:', error);
        return;
      }

      if (sessions && sessions.length > 0) {
        calculateStats(sessions);
      } else {
        const ritualData = {};
        allRituals.forEach(r => {
          ritualData[r.id] = { times: 0, totalMinutes: 0, streak: 0 };
        });
        setRitualStats(ritualData);
      }
    } catch (error) {
      console.error('Load stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (sessions) => {
    const ritualData = {};

    allRituals.forEach(r => {
      ritualData[r.id] = { times: 0, totalMinutes: 0, streak: 0 };
    });

    if (!sessions || sessions.length === 0) {
      setRitualStats(ritualData);
      return;
    }

    const ritualSessions = {};
    sessions.forEach(session => {
      if (!session.ritual_id) return;
      
      if (!ritualSessions[session.ritual_id]) {
        ritualSessions[session.ritual_id] = [];
      }
      ritualSessions[session.ritual_id].push(session);
    });

    Object.entries(ritualSessions).forEach(([ritualId, sessionList]) => {
      const id = parseInt(ritualId);
      if (ritualData[id]) {
        ritualData[id].times = sessionList.length;
        ritualData[id].totalMinutes = sessionList.reduce((sum, session) => {
          return sum + (session.duration_minutes || 0);
        }, 0);
        const dates = sessionList.map(s => new Date(s.created_at));
        ritualData[id].streak = calculateStreak(dates);
      }
    });

    setRitualStats(ritualData);
  };

  const calculateStreak = (dates) => {
    if (!dates || dates.length === 0) return 0;

    const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());

    const uniqueDays = [];
    const seenDays = new Set();

    sortedDates.forEach(date => {
      const dayDate = new Date(date);
      const dayStr = `${dayDate.getFullYear()}-${dayDate.getMonth()}-${dayDate.getDate()}`;

      if (!seenDays.has(dayStr)) {
        seenDays.add(dayStr);
        uniqueDays.push(dayDate);
      }
    });

    if (uniqueDays.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(uniqueDays[0], today) || isSameDay(uniqueDays[0], yesterday)) {
      streak = 1;
    } else {
      return 0;
    }

    for (let i = 0; i < uniqueDays.length - 1; i++) {
      const current = uniqueDays[i];
      const next = uniqueDays[i + 1];
      
      const diff = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigateToRitual = (ritual) => {
    navigate(`/rituals`);
  };

  return (
    <div className="dashboard-page">
      <div className="db-bg-wrapper">
        <div className="db-bg-gradient"></div>
        <div className="db-decorative-lines"></div>
      </div>

      <header className="db-header">
        <div className="db-header-content">
          <div className="db-logo-section">
            <h1 className="db-logo">RVtracker</h1>
            <p className="db-tagline">Your daily practice companion</p>
          </div>
          <div className="db-header-actions">
            <button className="db-theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button className="db-logout-btn" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="db-main">
        <section className="db-section">
          <div className="db-section-header">
            <div>
              <h2 className="db-section-title">Daily Rituals</h2>
              <p className="db-section-subtitle">nurture your practice</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="db-view-all-btn" onClick={loadStats} style={{ padding: '0.6rem 1.2rem' }}>
                ↻ Refresh
              </button>
              <button className="db-view-all-btn" onClick={() => navigate('/rituals')}>
                View All →
              </button>
            </div>
          </div>

          <div className="db-rituals-grid">
            {allRituals.map((ritual) => {
              const stats = ritualStats[ritual.id] || { times: 0, totalMinutes: 0, streak: 0 };
              return (
                <div key={ritual.id} className="db-ritual-card" style={{ '--accent-color': ritual.color }}>
                  <div className="db-card-header">
                    <h3 className="db-card-title">{ritual.name}</h3>
                    <div className="db-card-accent"></div>
                  </div>

                  <div className="db-card-stats">
                    <div className="db-stat">
                      <span className="db-stat-label">Time Practiced</span>
                      <span className="db-stat-value">{stats.totalMinutes} min</span>
                    </div>
                    <div className="db-stat">
                      <span className="db-stat-label">Streak</span>
                      <span className="db-stat-value">{stats.streak} days</span>
                    </div>
                  </div>

                  <div className="db-progress-bar">
                    <div className="db-progress-fill" style={{ width: `${Math.min((stats.streak / 20) * 100, 100)}%` }}></div>
                  </div>

                  <button
                    className="db-practice-btn"
                    onClick={() => handleNavigateToRitual(ritual)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Practice Now
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <nav className="db-bottom-nav">
        <button className="db-nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Dashboard</span>
        </button>
        <button className="db-nav-item" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </button>
        <button className="db-nav-item" onClick={() => navigate('/vision')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Vision</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;


