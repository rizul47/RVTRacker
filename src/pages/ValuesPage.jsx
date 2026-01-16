import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './ValuesPage.css';

const ValuesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="values-page">
      
      <header className="vp-header">
        <div className="vp-header-content">
          <div className="vp-header-left">
            <button className="vp-back-btn" onClick={() => navigate('/')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1>Values</h1>
              <p>Discover our core values</p>
            </div>
          </div>
          <div className="vp-header-right">
            <span className="vp-user-name">👋 {user?.name || 'Student'}</span>
            <button className="vp-theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
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
            <button className="vp-logout-btn" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      
      <main className="vp-main">
        <div className="vp-container">
          <div className="vp-intro">
            <h2 className="vp-title">Our Core Values</h2>
            <div className="vp-divider">
              <div className="vp-divider-line"></div>
              <div className="vp-divider-dot"></div>
              <div className="vp-divider-line"></div>
            </div>
            <p className="vp-subtitle">The guiding principles of our community</p>
          </div>

          <div className="vp-values-grid">
            
            <div className="vp-value-card">
              <div className="vp-card-content">
                <h3 className="vp-card-title">Acceptance</h3>
                <p className="vp-card-text">Embracing others and ourselves without judgment, creating a welcoming environment for all.</p>
                <div className="vp-card-decoration"></div>
              </div>
            </div>

            
            <div className="vp-value-card">
              <div className="vp-card-content">
                <h3 className="vp-card-title">Responsibility</h3>
                <p className="vp-card-text">Owning our actions and their consequences, appearing as reliable and trustworthy members of society.</p>
                <div className="vp-card-decoration"></div>
              </div>
            </div>

            
            <div className="vp-value-card">
              <div className="vp-card-content">
                <h3 className="vp-card-title">Self-discipline</h3>
                <p className="vp-card-text">The inner power to control one's feelings and overcome weaknesses to achieve greatness.</p>
                <div className="vp-card-decoration"></div>
              </div>
            </div>

            
            <div className="vp-value-card">
              <div className="vp-card-content">
                <h3 className="vp-card-title">Compassion</h3>
                <p className="vp-card-text">Feeling and showing deep empathy and concern for the well-being of others.</p>
                <div className="vp-card-decoration"></div>
              </div>
            </div>

            
            <div className="vp-value-card">
              <div className="vp-card-content">
                <h3 className="vp-card-title">Commitment</h3>
                <p className="vp-card-text">Unwavering dedication to our goals, our community, and our personal growth.</p>
                <div className="vp-card-decoration"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ValuesPage;


