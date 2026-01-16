import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [expandedSection, setExpandedSection] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="about-container">
      
      <header className="about-header">
        <div className="header-content">
          <h1 className="about-title">About</h1>
          <p className="about-subtitle">Learn about RVtracker</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 3l4 4-4 4M20 7H9" />
          </svg>
          Logout
        </button>
      </header>

      
      <div className="about-content">
        
        <section className="about-section">
          <div className="section-header" onClick={() => toggleSection('mission')}>
            <h2 className="section-title">Our Mission</h2>
            <span className={`expand-icon ${expandedSection === 'mission' ? 'expanded' : ''}`}>
              ▾
            </span>
          </div>
          {expandedSection === 'mission' && (
            <div className="section-body">
              <p>
                RVTracker is designed to guide students on a transformative journey of self-discovery and personal growth. 
                Through daily mindfulness practices, intentional reflections, and meaningful rituals, we help students 
                build a stronger connection with themselves and develop the inner wisdom needed to navigate life's challenges.
              </p>
              <p>
                Our platform emphasizes consistency, self-compassion, and the gradual cultivation of positive habits 
                that foster emotional resilience and mental clarity.
              </p>
            </div>
          )}
        </section>

        
        <section className="about-section">
          <div className="section-header" onClick={() => toggleSection('values')}>
            <h2 className="section-title">Core Values</h2>
            <span className={`expand-icon ${expandedSection === 'values' ? 'expanded' : ''}`}>
              ▾
            </span>
          </div>
          {expandedSection === 'values' && (
            <div className="section-body">
              <div className="values-grid">
                <div className="value-card">
                  <h3>Acceptance</h3>
                  <p>Embracing yourself and others with compassion and understanding</p>
                </div>
                <div className="value-card">
                  <h3>Responsibility</h3>
                  <p>Taking ownership of your actions and personal growth journey</p>
                </div>
                <div className="value-card">
                  <h3>Self-Discipline</h3>
                  <p>Building strength through consistent practice and commitment</p>
                </div>
                <div className="value-card">
                  <h3>Compassion</h3>
                  <p>Showing kindness and empathy to yourself and others</p>
                </div>
                <div className="value-card">
                  <h3>Commitment</h3>
                  <p>Dedicating yourself fully to your personal growth journey</p>
                </div>
              </div>
            </div>
          )}
        </section>

        
        <section className="about-section">
          <div className="section-header" onClick={() => toggleSection('rituals')}>
            <h2 className="section-title">Our Rituals</h2>
            <span className={`expand-icon ${expandedSection === 'rituals' ? 'expanded' : ''}`}>
              ▾
            </span>
          </div>
          {expandedSection === 'rituals' && (
            <div className="section-body">
              <p>
                Each ritual in RVTracker is carefully crafted to support specific aspects of personal development:
              </p>
              <ul className="rituals-list">
                <li><strong>Mindfulness</strong> - Cultivate present moment awareness and inner peace</li>
                <li><strong>Journal Writing</strong> - Express and explore your deepest thoughts and emotions</li>
                <li><strong>Tapping</strong> - Release emotional blocks and balance your energy</li>
                <li><strong>Positive Affirmation</strong> - Reprogram your mind with empowering beliefs</li>
                <li><strong>Visualization</strong> - Manifest your dreams through mental imagery</li>
                <li><strong>Forgiveness</strong> - Heal from past resentments and free yourself</li>
                <li><strong>Gratitude</strong> - Shift your perspective toward appreciation and abundance</li>
                <li><strong>Mirror Work</strong> - Build self-love and acceptance through self-compassion</li>
                <li><strong>Planning</strong> - Set intentions and align your actions with your values</li>
                <li><strong>Body Work</strong> - Release physical tension and reconnect with your body</li>
              </ul>
            </div>
          )}
        </section>

        
        <section className="about-section">
          <div className="section-header" onClick={() => toggleSection('howitworks')}>
            <h2 className="section-title">How It Works</h2>
            <span className={`expand-icon ${expandedSection === 'howitworks' ? 'expanded' : ''}`}>
              ▾
            </span>
          </div>
          {expandedSection === 'howitworks' && (
            <div className="section-body">
              <div className="steps-container">
                <div className="step">
                  <div className="step-number">1</div>
                  <h3>Choose a Ritual</h3>
                  <p>Select a ritual that resonates with what you need right now</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h3>Practice Mindfully</h3>
                  <p>Engage fully in the practice, following the guided instructions</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h3>Track Your Progress</h3>
                  <p>Log your practice and watch your journey of growth unfold</p>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <h3>Reflect & Integrate</h3>
                  <p>Observe the changes and insights that emerge from consistent practice</p>
                </div>
              </div>
            </div>
          )}
        </section>

        
        <section className="about-section">
          <div className="section-header" onClick={() => toggleSection('vision')}>
            <h2 className="section-title">Our Vision</h2>
            <span className={`expand-icon ${expandedSection === 'vision' ? 'expanded' : ''}`}>
              ▾
            </span>
          </div>
          {expandedSection === 'vision' && (
            <div className="section-body">
              <p>
                We envision a world where every student has access to tools and practices that support their inner development. 
                Through RVTracker, we aim to create a community where self-awareness, emotional intelligence, and personal growth 
                are valued and nurtured.
              </p>
              <p>
                Our goal is to empower students to become their best selves—resilient, compassionate, and fully aligned with 
                their deepest values and aspirations.
              </p>
            </div>
          )}
        </section>
      </div>

      
      <footer className="about-footer">
      </footer>

      
      <nav className="about-bottom-nav">
        <button className="about-nav-item" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Homepage</span>
        </button>
        <button className="about-nav-item" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Dashboard</span>
        </button>
        <button className="about-nav-item" onClick={() => navigate('/about')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>About</span>
        </button>
        <button className="about-nav-item" onClick={() => navigate('/settings')}>
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

export default AboutPage;


