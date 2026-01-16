import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import './RitualsPage.css';

const RitualsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [selectedRitual, setSelectedRitual] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [practiceSessions, setPracticeSessions] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMsg, setCongratsMsg] = useState('');
  const [ritualStats, setRitualStats] = useState({});

  const rituals = [
    {
      id: 1,
      name: 'Mindfulness',
      subtitle: 'Present Moment Awareness',
      description: 'A practice of bringing your full attention to the present moment without judgment.',
      what: 'Mindfulness is the art of being fully present in the here and now. It involves paying attention to your thoughts, feelings, and sensations without judgment, allowing you to experience life more fully and respond to situations with clarity rather than react impulsively.',
      benefits: ['Reduces stress and anxiety', 'Improves focus and concentration', 'Enhances emotional regulation', 'Increases self-awareness', 'Promotes inner peace'],
      howToPractice: ['Find a quiet, comfortable place to sit', 'Close your eyes and take deep breaths', 'Focus your attention on your breathing', 'When your mind wanders, gently redirect it', 'Practice daily for 10-20 minutes'],
      color: '#c65d3b'
    },
    {
      id: 2,
      name: 'Journal Writing',
      subtitle: 'Expression Through Words',
      description: 'Write freely to explore your thoughts, feelings, and experiences.',
      what: 'Journaling is a reflective practice where you write your innermost thoughts, feelings, and experiences. It serves as a tool for self-discovery, emotional processing, and personal growth.',
      benefits: ['Clarifies thoughts and feelings', 'Reduces mental clutter', 'Promotes self-discovery', 'Enhances creativity', 'Provides emotional release'],
      howToPractice: ['Get a dedicated journal or notebook', 'Write freely without censoring yourself', 'Express your honest feelings and thoughts', 'Don\'t worry about grammar or spelling', 'Write for 15-20 minutes daily'],
      color: '#4a5d6b'
    },
    {
      id: 3,
      name: 'Tapping',
      subtitle: 'Energy Release Technique',
      description: 'A gentle technique using your fingertips to release emotional blocks.',
      what: 'Tapping, also known as Emotional Freedom Technique (EFT), involves gently tapping on specific acupressure points while focusing on negative emotions or physical sensations to release energy blockages.',
      benefits: ['Releases emotional blockages', 'Reduces anxiety and stress', 'Provides emotional clarity', 'Balances body energy', 'Promotes deep relaxation'],
      howToPractice: ['Identify the issue or emotion to address', 'Rate its intensity from 0-10', 'Tap on the side of your hand while stating the issue', 'Tap through the points: eyebrow, side of eye, under eye, under nose, chin, collarbone', 'Take deep breaths and reassess'],
      color: '#c65d3b'
    },
    {
      id: 4,
      name: 'Positive Affirmation',
      subtitle: 'Empowering Statements',
      description: 'Speak positive statements to reprogram your subconscious mind.',
      what: 'Positive affirmations are empowering statements that help rewire limiting beliefs and negative thought patterns. By repeating them consistently, you can transform your mindset and attract positive outcomes.',
      benefits: ['Boosts self-confidence', 'Rewires limiting beliefs', 'Increases positivity', 'Builds mental resilience', 'Attracts opportunities'],
      howToPractice: ['Choose affirmations that resonate with you', 'Speak them aloud with conviction', 'Repeat them in front of a mirror', 'Feel the emotion behind each word', 'Practice every morning upon waking'],
      color: '#4a5d6b'
    },
    {
      id: 5,
      name: 'Visualization',
      subtitle: 'Mental Imagery',
      description: 'Use the power of your imagination to manifest desired outcomes.',
      what: 'Visualization is the practice of creating vivid mental images of your desired outcomes. By engaging all your senses in this mental rehearsal, you can program your subconscious mind to help manifest your goals.',
      benefits: ['Helps manifest goals', 'Calms and focuses the mind', 'Enhances creativity', 'Builds confidence', 'Accelerates personal growth'],
      howToPractice: ['Find a quiet space and close your eyes', 'Imagine your desired outcome vividly', 'Engage all five senses in the visualization', 'Feel the emotions of achieving your goal', 'Practice for 5-10 minutes daily'],
      color: '#c65d3b'
    },
    {
      id: 6,
      name: 'Forgiveness',
      subtitle: 'Releasing Past Resentments',
      description: 'A healing practice to let go of grudges and past hurts.',
      what: 'Forgiveness is the conscious decision to release feelings of anger, resentment, and hurt towards others or yourself. It is a gift you give yourself, freeing your energy for more positive purposes.',
      benefits: ['Reduces stress and anger', 'Improves relationships', 'Promotes inner peace', 'Enhances emotional healing', 'Frees mental energy'],
      howToPractice: ['Acknowledge what happened honestly', 'Recognize how it affected you', 'Choose consciously to release the resentment', 'Practice compassion for all involved', 'Affirm your freedom from the past'],
      color: '#4a5d6b'
    },
    {
      id: 7,
      name: 'Gratitude',
      subtitle: 'Appreciation Practice',
      description: 'Cultivate appreciation for the gifts in your life.',
      what: 'Gratitude is the practice of consciously acknowledging and appreciating the good things in your life, big or small. It shifts your focus from lack to abundance and transforms your perspective.',
      benefits: ['Increases happiness and positivity', 'Improves mental health', 'Enhances relationships', 'Shifts perspective to abundance', 'Attracts more blessings'],
      howToPractice: ['Find a quiet moment each day', 'Think of 5-10 things you are grateful for', 'Feel genuine appreciation for each one', 'Write them down or say them aloud', 'Practice daily, especially in the morning'],
      color: '#c65d3b'
    },
    {
      id: 8,
      name: 'Mirror Work',
      subtitle: 'Self-Love Practice',
      description: 'Look yourself in the eye and practice self-acceptance.',
      what: 'Mirror work involves looking at yourself in the mirror while practicing self-affirmations and self-love statements. It helps you develop a deeper connection with yourself and heal past wounds.',
      benefits: ['Increases self-love', 'Reduces shame and guilt', 'Improves self-worth', 'Enhances confidence', 'Promotes self-acceptance'],
      howToPractice: ['Stand before a mirror', 'Look deeply into your own eyes', 'Speak affirmations of self-love', 'Accept what you see without judgment', 'Practice for 5-10 minutes daily'],
      color: '#4a5d6b'
    },
    {
      id: 9,
      name: 'Planning',
      subtitle: 'Intentional Direction',
      description: 'Set clear intentions and plan your day with purpose.',
      what: 'Intentional planning is the practice of setting clear goals and creating action steps aligned with your values. It brings structure and purpose to your days, helping you live more deliberately.',
      benefits: ['Increases productivity', 'Clarifies priorities', 'Reduces overwhelm', 'Aligns actions with values', 'Enhances focus'],
      howToPractice: ['Identify your top 3 priorities', 'Break them into actionable steps', 'Schedule time for each task', 'Review your plan throughout the day', 'Practice daily in the morning'],
      color: '#c65d3b'
    },
    {
      id: 10,
      name: 'Body Work',
      subtitle: 'Physical Release',
      description: 'Use movement and breathwork to release physical tension.',
      what: 'Body work includes gentle stretching, breathing exercises, and mindful movement practices to release stored tension and reconnect with your physical body.',
      benefits: ['Releases physical tension', 'Improves circulation', 'Reduces stress', 'Increases body awareness', 'Promotes relaxation'],
      howToPractice: ['Start with gentle stretches', 'Focus on deep, conscious breathing', 'Move slowly and mindfully', 'Listen to your body\'s signals', 'Practice for 10-15 minutes daily'],
      color: '#4a5d6b'
    },
  ];

  useEffect(() => {
    loadPracticeSessions();
  }, [user]);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const loadPracticeSessions = async () => {
    if (!user) return;
    const studentId = user.studentId || user.id;
    if (!studentId) return;

    try {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPracticeSessions(data);
        // Calculate stats per ritual
        const stats = {};
        data.forEach(session => {
          const ritualId = session.ritual_id;
          if (!stats[ritualId]) {
            stats[ritualId] = { totalSeconds: 0, sessions: 0 };
          }
          // Support both old duration_minutes and new duration_seconds fields
          const seconds = session.duration_seconds || (session.duration_minutes ? session.duration_minutes * 60 : 0);
          stats[ritualId].totalSeconds += seconds;
          stats[ritualId].sessions += 1;
        });
        setRitualStats(stats);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleExplore = (ritual) => {
    setSelectedRitual(ritual);
    setTimeSpent(0);
    setTimerActive(false);
  };

  const handleBack = () => {
    setSelectedRitual(null);
    setTimeSpent(0);
    setTimerActive(false);
  };

  const handleStartTimer = () => {
    setTimerActive(true);
  };

  const handleStopTimer = () => {
    setTimerActive(false);
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setTimeSpent(0);
  };

  const handleSaveSession = async () => {
    if (!selectedRitual || !user || timeSpent === 0) return;

    try {
      const studentId = user.studentId || user.id;
      // Store actual seconds for accurate tracking
      const durationSeconds = timeSpent;

      const { error } = await supabase
        .from('practice_sessions')
        .insert({
          student_id: studentId,
          ritual_id: selectedRitual.id,
          ritual_name: selectedRitual.name,
          duration_seconds: durationSeconds
        });

      if (!error) {
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        const msg = minutes >= 1
          ? `🎉 You practiced ${minutes} minute${minutes !== 1 ? 's' : ''} of ${selectedRitual.name}!`
          : `⭐ Great start! ${seconds} seconds of ${selectedRitual.name}!`;
        
        setCongratsMsg(msg);
        setShowCongrats(true);
        setTimeSpent(0);
        setTimerActive(false);
        loadPracticeSessions();
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds) => {
    if (!seconds) return '0 sec';
    if (seconds < 60) return `${seconds} sec`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes < 60) {
      return secs > 0 ? `${minutes}m ${secs}s` : `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getRitualSessions = (ritualId) => {
    return practiceSessions.filter(s => s.ritual_id === ritualId).slice(0, 5);
  };

  // Ritual Detail View
  if (selectedRitual) {
    const stats = ritualStats[selectedRitual.id] || { totalSeconds: 0, sessions: 0 };
    const recentSessions = getRitualSessions(selectedRitual.id);

    return (
      <div className="rituals-page" data-theme={theme}>
        <div className="rp-bg-wrapper">
          <div className="rp-bg-gradient"></div>
        </div>

        {/* Detail Header */}
        <header className="rp-detail-header">
          <div className="rp-detail-header-content">
            <button className="rp-back-btn" onClick={handleBack}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="rp-detail-title">
              <h1 className="rp-ritual-name" style={{ color: selectedRitual.color }}>{selectedRitual.name}</h1>
              <p className="rp-ritual-subtitle">{selectedRitual.subtitle}</p>
            </div>
            <div className="rp-detail-controls">
              <button className="rp-theme-btn" onClick={toggleTheme}>
                {theme === 'light' ? (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Detail Main */}
        <main className="rp-detail-main">
          {/* Total Practice Stats */}
          {stats.totalSeconds > 0 && (
            <div className="rp-stats-banner">
              <div className="rp-stat-item">
                <span className="rp-stat-value">{formatTotalTime(stats.totalSeconds)}</span>
                <span className="rp-stat-label">Total Practiced</span>
              </div>
              <div className="rp-stat-item">
                <span className="rp-stat-value">{stats.sessions}</span>
                <span className="rp-stat-label">Sessions</span>
              </div>
            </div>
          )}

          {/* What Is It Section */}
          <section className="rp-section">
            <h2 className="rp-section-title">What is it?</h2>
            <p className="rp-section-content">{selectedRitual.what}</p>
          </section>

          {/* Benefits Section */}
          <section className="rp-section">
            <h2 className="rp-section-title">Benefits</h2>
            <div className="rp-benefits-list">
              {selectedRitual.benefits.map((benefit, index) => (
                <div key={index} className="rp-benefit-item">
                  <span className="rp-benefit-dot"></span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How to Practice Section */}
          <section className="rp-section">
            <h2 className="rp-section-title">How to Practice</h2>
            <ol className="rp-steps-list">
              {selectedRitual.howToPractice.map((step, index) => (
                <li key={index} className="rp-step-item">{step}</li>
              ))}
            </ol>
          </section>

          {/* Practice Tracker Section */}
          <section className="rp-tracker-section">
            <h2 className="rp-section-title">Practice Tracker</h2>
            <div className="rp-tracker-display">
              <div className="rp-timer">{formatTime(timeSpent)}</div>
              <div className="rp-tracker-buttons">
                {!timerActive ? (
                  <button className="rp-btn-start" onClick={handleStartTimer}>START</button>
                ) : (
                  <button className="rp-btn-start" onClick={handleStopTimer}>PAUSE</button>
                )}
                <button className="rp-btn-save" onClick={handleSaveSession} disabled={timeSpent === 0}>SAVE SESSION</button>
                <button className="rp-btn-reset" onClick={handleResetTimer}>RESET</button>
              </div>
            </div>

            {/* Recent Sessions */}
            {recentSessions.length > 0 && (
              <div className="rp-sessions-list">
                <h3>Recent Sessions</h3>
                {recentSessions.map((session, index) => {
                  // Support both old and new data formats
                  const seconds = session.duration_seconds || (session.duration_minutes ? session.duration_minutes * 60 : 0);
                  return (
                    <div key={index} className="rp-session-item">
                      <span className="rp-session-time">{formatTotalTime(seconds)}</span>
                      <span className="rp-session-date">
                        {new Date(session.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        {/* Congrats Modal */}
        {showCongrats && (
          <div className="rp-congrats-overlay" onClick={() => setShowCongrats(false)}>
            <div className="rp-congrats-modal" onClick={e => e.stopPropagation()}>
              <h2>🎉 Well Done!</h2>
              <p>{congratsMsg}</p>
              <button onClick={() => setShowCongrats(false)}>Continue</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Rituals List View
  return (
    <div className="rituals-page" data-theme={theme}>
      <div className="rp-bg-wrapper">
        <div className="rp-bg-gradient"></div>
      </div>

      {/* Header */}
      <header className="rp-header">
        <div className="rp-header-content">
          <div className="rp-header-left">
            <div className="rp-logo">
              <img src="/icon.png" alt="Logo" className="rp-logo-img" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div className="rp-title-group">
              <h1 className="rp-page-title">Sacred Rituals</h1>
              <p className="rp-page-subtitle">DISCOVER OUR 10 PRACTICES</p>
            </div>
          </div>
          <div className="rp-header-right">
            <button className="rp-theme-btn" onClick={toggleTheme}>
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
            <button className="rp-theme-btn" onClick={() => {}}>
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Ritual Cards */}
      <main className="rp-main">
        <div className="rp-cards-container">
          {rituals.map((ritual, index) => {
            const stats = ritualStats[ritual.id];
            return (
              <div 
                key={ritual.id} 
                className="rp-ritual-card"
                style={{ '--card-accent': ritual.color }}
              >
                <div className="rp-card-accent-bar"></div>
                <div className="rp-card-content">
                  <span className="rp-card-number">{index + 1}</span>
                  <h3 className="rp-card-title">{ritual.name}</h3>
                  <p className="rp-card-subtitle">{ritual.subtitle}</p>
                  <p className="rp-card-description">{ritual.description}</p>
                  {stats && stats.totalSeconds > 0 && (
                    <div className="rp-card-stats">
                      <span>Practiced: {formatTotalTime(stats.totalSeconds)}</span>
                    </div>
                  )}
                  <button className="rp-card-btn" onClick={() => handleExplore(ritual)}>
                    EXPLORE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="rp-bottom-nav">
        <button className="rp-nav-item" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Dashboard</span>
        </button>
        <button className="rp-nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>Rituals</span>
        </button>
        <button className="rp-nav-item" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
          <span>Home</span>
        </button>
      </nav>
    </div>
  );
};

export default RitualsPage;

