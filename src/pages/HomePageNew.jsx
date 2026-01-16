import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './HomePageNew.css';

const HomePageNew = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="artistic-home">
      
      <div className="art-bg-wrapper">
        <div className="art-bg-gradient" />
        <div className="art-decorative-lines" />
      </div>

      
      <header className="art-header">
        <div className="art-header-content">
          <div className="art-logo-section">
            <h1 className="display-4 fw-bold mb-0">RVTracker</h1>
            <p className="lead text-muted fst-italic">Embrace the Journey of Self-Growth</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div className="art-controls">
              <button className="art-theme-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
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
              <button className="art-logout-btn" onClick={handleLogout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      
      <main className="art-main">
        <div className="art-hero">
          <p className="art-intro-text">Discover your daily practice</p>
          <h2 className="art-main-title">Daily Rituals</h2>
          <div className="art-divider" />
        </div>

        <div className="art-cards-container">
          
          <button
            className="art-nav-card art-card-rituals"
            onClick={() => navigate('/rituals')}
          >
            <div className="art-card-bg" />
            <div className="art-card-content">
              <div className="art-card-header">
                <span className="art-card-label">Experience</span>
                <h3 className="art-card-title">rituals</h3>
              </div>
              <p className="art-card-description">
                Transform your days through ten mindful practices
              </p>
              <div className="art-card-cta">
                <span className="art-cta-text">Explore</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="art-card-accent art-accent-1" />
          </button>

          
          <button
            className="art-nav-card art-card-values"
            onClick={() => navigate('/values')}
          >
            <div className="art-card-bg" />
            <div className="art-card-content">
              <div className="art-card-header">
                <span className="art-card-label">Principles</span>
                <h3 className="art-card-title">values</h3>
              </div>
              <p className="art-card-description">
                Learn the principles that guide our community
              </p>
              <div className="art-card-cta">
                <span className="art-cta-text">Discover</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="art-card-accent art-accent-2" />
          </button>
        </div>

        <div className="art-footer-text">
          <p>Designed for every moment of your journey</p>
        </div>
      </main>

      
      <div className="art-user-badge">
        👋 Welcome, {user?.name || 'Student'}
      </div>
    </div>
  );
};

export default HomePageNew;


