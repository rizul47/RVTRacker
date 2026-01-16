import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './StudentVision.css';
import PrincipalImage from '../assets/Principal.jpeg';
import RnVVideo from '../assets/RnV.mp4';

const StudentVision = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sv-artistic-page">
      
      <div className="sv-bg-wrapper">
        <div className="sv-bg-gradient"></div>
        <div className="sv-decorative-lines"></div>
      </div>

      
      <header className="sv-art-header">
        <div className="sv-header-content">
          <div className="sv-logo-section">
            <h1 className="sv-logo">RVtracker</h1>
            <p className="sv-tagline">Your daily practice companion</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div className="sv-controls">
              <button className="sv-theme-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
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
              <button className="sv-logout-btn" onClick={handleLogout}>
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
      </header>

      
      <main className="sv-main">
        
        <section className="sv-hero">
          <div className="sv-intro-text">welcome to RVTracker</div>
          <h2 className="sv-main-title">School's Vision</h2>
          <div className="sv-divider">
            <div className="sv-divider-line"></div>
            <div className="sv-divider-dot"></div>
            <div className="sv-divider-line"></div>
          </div>
          <p className="sv-hero-subtitle">To bring out hidden, unlimited In-born talent and potential, joyfully in every child to the maximum.</p>
        </section>

        
        <div className="sv-user-greeting">
          <p>Welcome, <span className="sv-user-name">{user?.name || 'Student'}</span></p>
        </div>

        
        <section className="sv-principal-section">
          <div className="sv-principal-container">
            
            <div className="sv-principal-photo-wrapper">
              <div
                className="sv-principal-photo"
                onClick={() => setVideoOpen(true)}
              >
                <img src={PrincipalImage} alt="Mr. Inder Malik , Principal" className="sv-principal-img" />
                <div className="sv-photo-overlay">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Watch message</span>
                </div>
              </div>
              <h3 className="sv-principal-name">Dr Inder Malik</h3>
              <p className="sv-principal-title">Director Principal of Lovely Group of School</p>
            </div>

            
            <div className="sv-principal-message">
              <h3>Principal's Message</h3>
              <p className="sv-principal-name">Mr. Inder Malik, Principal</p>
              <div className="sv-message-text">
                <p>
                  We believe that true success is not just about academic excellence but also about building a strong character, fostering joy, and nurturing emotional well-being. By integrating significant values and rituals into daily life, we empower our students to thrive academically, socially, and emotionally. We don't just educate minds; we nurture hearts, build resilience, and inspire greatness in every child.
                </p>
              </div>
            </div>
          </div>
        </section>

        
        <section className="sv-values-section">
          <h3 className="sv-values-title">Our Core Values</h3>
          <div className="sv-values-divider"></div>
          <div className="sv-values-grid">
            <div className="sv-value-card sv-value-1">
              <div className="sv-value-accent"></div>
              <h4 className="sv-value-title">Excellence</h4>
              <p>Striving for the highest standards in all endeavors</p>
            </div>
            <div className="sv-value-card sv-value-2">
              <div className="sv-value-accent"></div>
              <h4 className="sv-value-title">Integrity</h4>
              <p>Building trust through honest and ethical practices</p>
            </div>
            <div className="sv-value-card sv-value-3">
              <div className="sv-value-accent"></div>
              <h4 className="sv-value-title">Innovation</h4>
              <p>Embracing new ideas and creative solutions</p>
            </div>
            <div className="sv-value-card sv-value-4">
              <div className="sv-value-accent"></div>
              <h4 className="sv-value-title">Community</h4>
              <p>Fostering unity and mutual support among all</p>
            </div>
          </div>
        </section>
      </main>

      
      {videoOpen && (
        <div className="sv-video-modal" onClick={() => setVideoOpen(false)}>
          <div className="sv-video-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="sv-video-close"
              onClick={() => setVideoOpen(false)}
            >
              ✕
            </button>
            <video width="100%" height="auto" controls autoPlay>
              <source src={RnVVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      
      <nav className="sv-bottom-nav">
        <button className="sv-nav-item" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Homepage</span>
        </button>
        <button className="sv-nav-item" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Dashboard</span>
        </button>
        <button className="sv-nav-item" onClick={() => navigate('/about')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>About</span>
        </button>
        <button className="sv-nav-item" onClick={() => navigate('/settings')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.98 2.98l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m2.98-2.98l4.24-4.24" />
          </svg>
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default StudentVision;


