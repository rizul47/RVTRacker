import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [studentStats, setStudentStats] = useState({});
  const [rituals, setRituals] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    loadStudents();
    loadRituals();
  }, [isAdmin, navigate]);

  const loadRituals = async () => {
    try {
      const { data, error } = await supabase
        .from('rituals')
        .select('id, name, color')
        .order('id');

      if (error) throw error;
      setRituals(data || []);
    } catch (error) {
    }
  };

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
      
      if (data && data.length > 0) {
        const statsMap = {};
        for (const student of data) {
          const stats = await loadStudentStats(student.student_id);
          statsMap[student.student_id] = stats;
        }
        setStudentStats(statsMap);
      }
    } catch (error) {
    }
  };

  const loadStudentStats = async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('ritual_id, ritual_name, duration_minutes, duration_seconds')
        .eq('student_id', studentId);

      if (error) throw error;

      const stats = {};
      if (data) {
        data.forEach(session => {
          if (!stats[session.ritual_id]) {
            stats[session.ritual_id] = {
              name: session.ritual_name,
              total_sessions: 0,
              total_minutes: 0,
              total_seconds: 0
            };
          }
          stats[session.ritual_id].total_sessions += 1;
          stats[session.ritual_id].total_minutes += session.duration_minutes || 0;
          stats[session.ritual_id].total_seconds += session.duration_seconds || 0;
        });

        Object.keys(stats).forEach(ritualId => {
          const stat = stats[ritualId];
          const totalMinutes = stat.total_minutes + Math.floor(stat.total_seconds / 60);
          const remainingSeconds = stat.total_seconds % 60;
          stat.total_minutes = totalMinutes;
          stat.total_seconds = remainingSeconds;

          const ritual = rituals.find(r => r.id === parseInt(ritualId));
          stat.color = ritual?.color || '#8fa8a0';
        });
      }

      return stats;
    } catch (error) {
      return {};
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!formData.name || !formData.email || !formData.student_id) {
      alert('Please fill in all fields');
      return;
    }

    if (!editingId && !newPassword) {
      alert('Password is required for new students');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please provide a valid email address (e.g., student@example.com)');
      return;
    }

    setIsLoading(true);

    try {
      if (editingId) {
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update({
            name: formData.name,
            email: formData.email
          })
          .eq('student_id', editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        // Add new student - store directly in students table with plain text password
        const { error: dbError } = await supabase
          .from('students')
          .insert([{
            student_id: formData.student_id,
            name: formData.name,
            email: formData.email,
            password: newPassword,
            is_active: true
          }]);

        if (dbError) {
          if (dbError.message.includes('duplicate')) {
            throw new Error('Student ID already exists');
          }
          throw new Error(`Failed to add student: ${dbError.message}`);
        }

        setNewPassword('');
      }

      loadStudents();
      setFormData({ student_id: '', name: '', email: '' });
      setSelectedStudent(null);
      alert('Student saved successfully!');
    } catch (error) {
      alert(`Failed to save student: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      student_id: student.student_id,
      name: student.name,
      email: student.email || ''
    });
    setEditingId(student.student_id);
    setNewPassword('');
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('student_id', studentId);

      if (error) throw error;
      loadStudents();
      setSelectedStudent(null);
    } catch (error) {
      alert('Failed to delete student');
    }
  };

  const handleLogout = async () => {
    logout();
    navigate('/admin-login');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        
        <div className="admin-header">
          <div className="admin-header-content">
            <div className="admin-title-section">
              <h1 className="admin-title">Admin Panel</h1>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
          <p className="admin-subtitle">Manage student accounts and track practice for Sehaj</p>
        </div>

        <div className="admin-content">

          <div className="admin-form-section">
            <h2 className="section-title">
              {editingId ? 'Edit Student' : 'Add New Student'}
            </h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <input
                  type="text"
                  id="studentId"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  placeholder="e.g., 2024001"
                  disabled={editingId !== null || isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Student Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., John Doe"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (Optional)</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@school.edu"
                  disabled={isLoading}
                />
              </div>

              {!editingId && (
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Set password"
                    disabled={isLoading}
                    required={!editingId}
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  {isLoading ? 'Saving...' : (editingId ? 'Update Student' : 'Add Student')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ student_id: '', name: '', email: '' });
                      setNewPassword('');
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          
          <div className="admin-layout">
            
            <div className="admin-list-section">
              <h2 className="section-title">
                Registered Students ({students.length})
              </h2>

              {students.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📚</span>
                  <p>No students registered yet</p>
                  <p className="empty-subtitle">Add your first student above</p>
                </div>
              ) : (
                <div className="students-list">
                  {students.map((student) => (
                    <div
                      key={student.student_id}
                      className={`student-card ${selectedStudent?.student_id === student.student_id ? 'active' : ''}`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="student-card-header">
                        <div className="student-info">
                          <h3 className="student-name">{student.name}</h3>
                          <p className="student-id">ID: {student.student_id}</p>
                        </div>
                        <div className="student-actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(student);
                            }}
                            title="Edit"
                            disabled={isLoading}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(student.student_id);
                            }}
                            title="Delete"
                            disabled={isLoading}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {student.email && (
                        <p className="student-email">{student.email}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            
            <div className="student-details-section">
              {selectedStudent ? (
                <>
                  <div className="details-header">
                    <h2 className="details-title">{selectedStudent.name}</h2>
                    <p className="details-subtitle">{selectedStudent.student_id}</p>
                  </div>

                  <div className="details-content">
                    <div className="detail-item">
                      <label>Email</label>
                      <p>{selectedStudent.email || 'Not provided'}</p>
                    </div>

                    <div className="detail-item">
                      <label>Joined</label>
                      <p>{new Date(selectedStudent.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>

                    <div className="practices-section">
                      <h3 className="practices-title">Practice Stats</h3>
                      
                      {studentStats[selectedStudent.student_id] && Object.keys(studentStats[selectedStudent.student_id]).length > 0 ? (
                        <div className="practices-list">
                          {Object.entries(studentStats[selectedStudent.student_id])
                            .sort(([, a], [, b]) => {
                              if (b.total_minutes !== a.total_minutes) {
                                return b.total_minutes - a.total_minutes;
                              }
                              return b.total_seconds - a.total_seconds;
                            })
                            .map(([ritualId, stat]) => (
                              <div key={ritualId} className="practice-item">
                                <div 
                                  className="practice-color" 
                                  style={{ backgroundColor: stat.color || '#8fa8a0' }}
                                />
                                <div className="practice-info">
                                  <span className="practice-name">{stat.name}</span>
                                  <span className="practice-stats">
                                    {stat.total_sessions} session{stat.total_sessions !== 1 ? 's' : ''} · {stat.total_minutes}m {stat.total_seconds}s
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="empty-practices">
                          <p>No practice sessions yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-selection">
                  <span className="empty-icon">👈</span>
                  <p>Select a student to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
