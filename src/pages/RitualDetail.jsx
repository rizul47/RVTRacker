import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rituals } from '../data/rituals';
import { supabase } from '../lib/supabase';
import './RitualDetail.css';

const RitualDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ritual, setRitual] = useState(null);
  const [stats, setStats] = useState({ totalMinutes: 0, totalSessions: 0, streakDays: 0 });
  const [isTimer, setIsTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const found = rituals.find(r => r.id === parseInt(id));
    setRitual(found);
    if (found) {
      setTimeLeft(found.duration * 60);
    }
  }, [id]);

  // Load stats for this ritual
  useEffect(() => {
    if (!user || !ritual) return;
    loadStats();
  }, [user, ritual]);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('duration_minutes, duration_seconds, created_at')
        .eq('student_id', user.id)
        .eq('ritual_id', ritual.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const totalMinutes = data.reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
        
        // Calculate streak (consecutive days with practice)
        const dates = data.map(s => new Date(s.created_at).toDateString()).filter((v, i, a) => a.indexOf(v) === i);
        let streak = 0;
        let currentDate = new Date();
        for (let i = 0; i < 365; i++) {
          const dateStr = currentDate.toDateString();
          if (dates.includes(dateStr)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }

        setStats({
          totalMinutes,
          totalSessions: data.length,
          streakDays: streak
        });
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(ritual.duration * 60);
    setTimeSpent(0);
    setIsPaused(false);
  };

  const handleSave = async () => {
    if (timeSpent === 0) return;

    try {
      const minutes = Math.floor(timeSpent / 60);
      const seconds = timeSpent % 60;

      const { error } = await supabase
        .from('practice_sessions')
        .insert([{
          student_id: user.id,
          ritual_id: ritual.id,
          ritual_name: ritual.name,
          duration_minutes: minutes,
          duration_seconds: seconds,
          created_at: new Date()
        }]);

      if (error) throw error;

      // Reload stats
      await loadStats();
      alert('Session saved!');
      handleReset();
    } catch (err) {
      console.error('Error saving session:', err);
      alert('Error saving session');
    }
  };

  if (!ritual) {
    return <div className="ritual-loading">Loading...</div>;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isTimer) {
    return (
      <div className="ritual-detail ritual-timer-page">
        <div className="ritual-header">
          <button className="ritual-back-btn" onClick={() => setIsTimer(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="ritual-timer-title">{ritual.name}</h1>
        </div>

        <div className="ritual-content">
          <div className="timer-tracker">
            <h2 className="timer-label">Time Practiced</h2>
            <div className="timer-display">{formatTime(timeSpent)}</div>
            
            <div className="timer-buttons">
              {!isRunning ? (
                <button className="timer-btn timer-start" onClick={handleStart}>
                  START
                </button>
              ) : (
                <button className="timer-btn timer-pause" onClick={handlePause}>
                  {isPaused ? 'RESUME' : 'PAUSE'}
                </button>
              )}
              
              {isRunning && (
                <button className="timer-btn timer-stop" onClick={handleStop}>
                  STOP
                </button>
              )}
            </div>

            <div className="timer-actions">
              <button className="timer-save-btn" onClick={handleSave} disabled={timeSpent === 0}>
                SAVE SESSION
              </button>
              <button className="timer-reset-btn" onClick={handleReset}>
                RESET
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ritual-detail">
      <div className="ritual-header">
        <button className="ritual-back-btn" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="ritual-detail-title">{ritual.name}</h1>
        <div className="ritual-icon-placeholder">{ritual.icon}</div>
      </div>

      <div className="ritual-content">
        {/* Stats Section */}
        <div className="ritual-stats">
          <div className="stat-card">
            <div className="stat-label">Time Practiced</div>
            <div className="stat-value">{stats.totalMinutes} min</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Streak</div>
            <div className="stat-value">{stats.streakDays} days</div>
          </div>
        </div>

        <div className="ritual-divider"></div>

        {/* What is it Section */}
        <section className="ritual-section">
          <h2>What is it?</h2>
          <p className="ritual-description">{ritual.description}</p>
          <p className="ritual-details">{ritual.details}</p>
        </section>

        {/* How it is Practiced Section */}
        <section className="ritual-section">
          <h2>How to Practice</h2>
          <div className="steps-container">
            {ritual.howToPractice.map((step, index) => (
              <div key={index} className="step">
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <p>{step}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="ritual-section">
          <h2>Benefits</h2>
          <div className="benefits-list">
            {ritual.benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <span className="benefit-dot"></span>
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Practice Button */}
        <button className="practice-now-btn" onClick={() => setIsTimer(true)}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Practice Now
        </button>
      </div>
    </div>
  );
};

export default RitualDetail;


