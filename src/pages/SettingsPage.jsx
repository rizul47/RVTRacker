import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [expandedSection, setExpandedSection] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordChange.newPassword || !passwordChange.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordChange.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordChange.newPassword
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setSaveSuccess(true);
        setPasswordChange({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSaveSuccess(false), 2000);
        setExpandedSection(null);
      }
    } catch (err) {
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <header className="settings-header">
        <div className="header-content">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Customize your experience</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 3l4 4-4 4M20 7H9" />
          </svg>
          Logout
        </button>
      </header>

      {/* Success Message */}
      {saveSuccess && (
        <div className="success-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Settings saved
        </div>
      )}

      {/* Main Content */}
      <div className="settings-content">
        {/* Account Section */}
        <section className="settings-section">
          <div className="section-header" onClick={() => toggleSection('account')}>
            <div className="section-title-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="section-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <h2 className="section-title">Account</h2>
            </div>
            <span className={`expand-icon ${expandedSection === 'account' ? 'expanded' : ''}`}>
              ▾
            </span>
          </div>
          {expandedSection === 'account' && (
            <div className="section-body">
              <div className="setting-item">
                <div className="setting-info">
                  <p className="setting-label">Email Address</p>
                  <p className="setting-value">{user?.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <p className="setting-label">Account Type</p>
                  <p className="setting-value">Student</p>
                </div>
              </div>
              
              {/* Password Change Form */}
              <div className="password-section">
                <h3 className="password-title">Change Password</h3>
                {passwordError && (
                  <div className="error-message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {passwordError}
                  </div>
                )}
                <form onSubmit={handlePasswordChange} className="password-form">
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordChange.newPassword}
                      onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      disabled={isChangingPassword}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      value={passwordChange.confirmPassword}
                      onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      disabled={isChangingPassword}
                    />
                  </div>
                  <button type="submit" className="btn-secondary" disabled={isChangingPassword}>
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </section>

        {/* Appearance Section */}
        <section className="settings-section">
          <div className="section-header" onClick={() => toggleSection('appearance')}>
            <div className="section-title-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="section-icon">
                <circle cx="12" cy="12" r="1" />
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
              </svg>
              <h2 className="section-title">Appearance</h2>
            </div>
            <span className={`expand-icon ${expandedSection === 'appearance' ? 'expanded' : ''}`}>
              ▾
            </span>
          </div>
          {expandedSection === 'appearance' && (
            <div className="section-body">
              <div className="setting-item">
                <div className="setting-info">
                  <p className="setting-label">Dark Mode</p>
                  <p className="setting-description">Use dark theme for a calming experience</p>
                </div>
                <button 
                  className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={handleThemeToggle}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <p className="setting-label">Current Theme</p>
                  <p className="setting-value">{theme === 'dark' ? 'Dark' : 'Light'}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* About Section */}
        <section className="settings-section">
          <div className="section-header" onClick={() => toggleSection('about')}>
            <div className="section-title-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="section-icon">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <h2 className="section-title">About</h2>
            </div>
            <span className={`expand-icon ${expandedSection === 'about' ? 'expanded' : ''}`}>
              ▾
            </span>
          </div>
          {expandedSection === 'about' && (
            <div className="section-body">
              <div className="setting-item">
                <div className="setting-info">
                  <p className="setting-label">App Version</p>
                  <p className="setting-value">1.0.0</p>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <p className="setting-label">Last Updated</p>
                  <p className="setting-value">January 15, 2026</p>
                </div>
              </div>
              <button className="btn-secondary" onClick={() => navigate('/about')}>
                Learn More About RVTracker
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="settings-footer">
      </footer>

      {/* Bottom Navigation */}
      <nav className="settings-bottom-nav">
        <button className="settings-nav-item" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Homepage</span>
        </button>
        <button className="settings-nav-item" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Dashboard</span>
        </button>
        <button className="settings-nav-item" onClick={() => navigate('/about')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>About</span>
        </button>
        <button className="settings-nav-item" onClick={() => navigate('/settings')}>
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

export default SettingsPage;
