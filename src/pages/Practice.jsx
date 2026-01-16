import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rituals } from '../data/rituals';
import { supabase } from '../lib/supabase';
import './Practice.css';

const Practice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ritual, setRitual] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const found = rituals.find(r => r.id === parseInt(id));
    setRitual(found);
    if (found) {
      setTimeLeft(found.duration * 60);
    }
  }, [id]);

  useEffect(() => {
    let interval;

    if (isStarted && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsCompleted(true);
            setIsStarted(false);
            setTimeSpent(ritual.duration * 60);
            return 0;
          }
          setTimeSpent(ritual.duration * 60 - prev + 1);
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isStarted, isPaused, timeLeft, ritual]);

  if (!ritual) {
    return <div className="practice-loading">Loading...</div>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((ritual.duration * 60 - timeLeft) / (ritual.duration * 60)) * 100;

  const handleStart = () => {
    setIsStarted(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsStarted(false);
    setIsPaused(false);
    setIsCompleted(false);
    setTimeLeft(ritual.duration * 60);
  };

  const handleFinish = async () => {
    // Save practice session to database
    if (user?.id && ritual && timeSpent > 0) {
      try {
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        
        await supabase
          .from('practice_sessions')
          .insert([{
            student_id: user.id,
            ritual_id: ritual.id,
            ritual_name: ritual.name,
            duration_minutes: minutes,
            duration_seconds: seconds,
            created_at: new Date().toISOString()
          }]);
      } catch (error) {
        console.error('Error saving practice session:', error);
      }
    }
    
    navigate(`/ritual/${ritual.id}`);
  };

  return (
    <div className="practice-container">
      <div className="practice-header">
        <button className="back-button" onClick={() => navigate(`/ritual/${ritual.id}`)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1>Practice Session</h1>
      </div>

      <div className="practice-content">
        <div className="timer-wrapper">
          <svg className="progress-ring" viewBox="0 0 200 200">
            <circle className="progress-ring-bg" cx="100" cy="100" r="90" />
            <circle
              className="progress-ring-fill"
              cx="100"
              cy="100"
              r="90"
              style={{
                strokeDasharray: `${2 * Math.PI * 90}`,
                strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`,
              }}
            />
          </svg>

          <div className="timer-content">
            <div className="ritual-icon-large">{ritual.icon}</div>
            <div className="timer-display">
              <span className="timer-minutes">{String(minutes).padStart(2, '0')}</span>
              <span className="timer-separator">:</span>
              <span className="timer-seconds">{String(seconds).padStart(2, '0')}</span>
            </div>
            <h2 className="ritual-name-timer">{ritual.name}</h2>
            <p className="progress-text">
              {isCompleted ? 'Session Complete!' : `${progress.toFixed(0)}% Complete`}
            </p>
          </div>
        </div>

        <div className="practice-controls">
          {!isStarted && !isCompleted && (
            <button className="control-btn btn-primary" onClick={handleStart}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Practice
            </button>
          )}

          {isStarted && !isCompleted && (
            <>
              <button className="control-btn btn-secondary" onClick={handlePause}>
                {isPaused ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Resume
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    Pause
                  </>
                )}
              </button>
              <button className="control-btn btn-reset" onClick={handleReset}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                Reset
              </button>
            </>
          )}

          {isCompleted && (
            <button className="control-btn btn-primary btn-large" onClick={handleFinish}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Complete & Return
            </button>
          )}
        </div>

        {!isStarted && !isCompleted && (
          <div className="practice-tips">
            <h3>Tips for Your Practice</h3>
            <ul>
              <li>Find a quiet, comfortable space</li>
              <li>Minimize distractions</li>
              <li>Focus on your breathing</li>
              <li>Be present in this moment</li>
              <li>Don't judge your experience</li>
            </ul>
          </div>
        )}

        {isCompleted && (
          <div className="completion-message">
            <div className="completion-icon">🎉</div>
            <h3>Wonderful!</h3>
            <p>You've completed a {ritual.duration}-minute {ritual.name} session.</p>
            <p className="completion-sub">Great job staying committed to your practice!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;


