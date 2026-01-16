import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { rituals } from '../data/rituals';
import './HomePageOrbital.css';

const RitualIcon = ({ ritual }) => {
  const iconMap = {
    1: <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
    2: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2v20M2 12h20M6 6l12 12M18 6L6 18" /></svg>,
    3: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M2 9h20m-4-4h-8m6 14h2m-14 0h2" /></svg>,
    4: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    5: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 9h12M9 13h6M8 17h8" /></svg>,
    6: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    7: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg>,
    8: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg>,
    9: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    10: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg>
  };

  return iconMap[ritual.id] || <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>;
};

const HomePageOrbital = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  const anglePerSlide = 360 / rituals.length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToPrev = () => {
    const newIndex = activeIndex === 0 ? rituals.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    setRotation(rotation + anglePerSlide);
  };

  const goToNext = () => {
    const newIndex = activeIndex === rituals.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    setRotation(rotation - anglePerSlide);
  };

  const handleCardClick = (index) => {
    if (index === activeIndex) {
      navigate(`/ritual/${rituals[index].id}`);
    } else {
      const diff = index - activeIndex;
      const newRotation = rotation - (diff * anglePerSlide);
      setRotation(newRotation);
      setActiveIndex(index);
    }
  };

  const goToSlide = (index) => {
    if (index === activeIndex) {
      navigate(`/ritual/${rituals[index].id}`);
    } else {
      const diff = index - activeIndex;
      const newRotation = rotation - (diff * anglePerSlide);
      setRotation(newRotation);
      setActiveIndex(index);
    }
  };

  return (
    <section 
      className="orbital"
      ref={containerRef}
    >
      <div className="orbital-space">
        <div className="space-gradient" />
        <div className="space-stars">
          {[...Array(60)].map((_, i) => (
            <div 
              key={i}
              className="star"
              style={{
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                '--size': `${1 + Math.random() * 1.5}px`,
                '--duration': `${3 + Math.random() * 4}s`,
                '--delay': `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div 
        className="orbital-center-glow"
        style={{ 
          boxShadow: `0 0 150px 80px ${rituals[activeIndex].color}15`,
          background: `radial-gradient(circle, ${rituals[activeIndex].color}08 0%, transparent 60%)`
        }}
      />

      <div className="orbital-particles">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              '--x': `${Math.random() * 100}%`,
              '--y': `${50 + Math.random() * 50}%`,
              '--size': `${1.5 + Math.random() * 2.5}px`,
              '--duration': `${15 + Math.random() * 20}s`,
              '--delay': `${Math.random() * 10}s`,
              '--color': rituals[Math.floor(Math.random() * rituals.length)].color
            }}
          />
        ))}
      </div>

      <div className="orbital-header">
        <div className="header-content">
          <div className="header-left">
            <span className="orbital-label">Daily Practices</span>
            <h2 className="orbital-title">10 Rituals</h2>
            <p className="orbital-subtitle">Transform your life through mindful practices</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">👋 {user?.name || 'Student'}</span>
              <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                {theme === 'dark' ? (
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
              <button className="logout-btn-home" onClick={handleLogout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="orbital-scene">
        <div className="orbit-path">
          <div className="orbit-ring orbit-ring-1" />
          <div className="orbit-ring orbit-ring-2" />
          <div className="orbit-ring orbit-ring-3" />
        </div>

        <div 
          className="orbital-ring"
          style={{
            transform: `rotateX(65deg) rotateZ(${rotation}deg)`
          }}
        >
          {rituals.map((ritual, index) => {
            const angle = index * anglePerSlide;
            const isActive = index === activeIndex;
            
            return (
              <div
                key={ritual.id}
                className={`orbital-card ${isActive ? 'active' : ''}`}
                style={{
                  '--card-angle': `${angle}deg`,
                  '--card-color': ritual.color,
                  transform: `rotateZ(${angle}deg) translateX(340px) rotateZ(${-angle - rotation}deg) rotateX(-65deg)`
                }}
                onClick={() => handleCardClick(index)}
              >
                <div className="orbital-card-inner">
                  <div className="card-icon-bg">
                    <div className="card-icon-wrapper" style={{ color: ritual.color }}>
                      <RitualIcon ritual={ritual} />
                    </div>
                  </div>
                  <div className="card-overlay" />
                  
                  <div className="card-content">
                    <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="card-title">{ritual.name}</h3>
                    <p className="card-subtitle">{ritual.description}</p>
                    <span className="card-duration">{ritual.duration} min</span>
                  </div>

                  <div className="card-glow" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="orbital-center">
          <div className="center-core">
            <div className="core-ring core-ring-1" />
            <div className="core-ring core-ring-2" />
            <div className="core-ring core-ring-3" />
            <div className="core-dot" style={{ background: rituals[activeIndex].color }} />
          </div>
        </div>

        <button className="nav-arrow nav-arrow-left" onClick={goToPrev} aria-label="Previous ritual">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button className="nav-arrow nav-arrow-right" onClick={goToNext} aria-label="Next ritual">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="orbital-info">
        <div className="info-indicator">
          {rituals.map((ritual, index) => (
            <button
              key={ritual.id}
              className={`indicator-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to ${ritual.name}`}
            />
          ))}
        </div>
        
        <div className="info-content">
          <h3 className="info-title">
            {rituals[activeIndex].name}
          </h3>
          <p className="info-subtitle">{rituals[activeIndex].description}</p>
        </div>

        <button 
          className="info-cta"
          onClick={() => navigate(`/ritual/${rituals[activeIndex].id}`)}
        >
          Explore
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HomePageOrbital;
