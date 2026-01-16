import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePageNew from './pages/HomePageNew'
import Dashboard from './pages/Dashboard'
import RitualsPage from './pages/RitualsPage'
import ValuesPage from './pages/ValuesPage'
import AboutPage from './pages/AboutPage'
import SettingsPage from './pages/SettingsPage'
import HomePageOrbital from './pages/HomePageOrbital'
import RitualDetail from './pages/RitualDetail'
import Practice from './pages/Practice'
import StudentVision from './pages/StudentVision'
import LoginPage from './pages/LoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminPage from './pages/AdminPage'
import './App.css'
import logo from './assets/logo.jpeg'

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <img
                        src={logo}
                        alt="School Logo"
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            zIndex: 1000,
                            objectFit: 'cover',
                            border: '2px solid rgba(255, 255, 255, 0.2)'
                        }}
                    />
                    <Routes>
                        
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/admin-login" element={<AdminLoginPage />} />

                        
                        <Route path="/" element={<ProtectedRoute><HomePageNew /></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/rituals" element={<ProtectedRoute><RitualsPage /></ProtectedRoute>} />
                        <Route path="/values" element={<ProtectedRoute><ValuesPage /></ProtectedRoute>} />
                        <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                        <Route path="/vision" element={<ProtectedRoute><StudentVision /></ProtectedRoute>} />
                        <Route path="/orbital" element={<ProtectedRoute><HomePageOrbital /></ProtectedRoute>} />
                        <Route path="/ritual/:id" element={<ProtectedRoute><RitualDetail /></ProtectedRoute>} />
                        <Route path="/practice/:id" element={<ProtectedRoute><Practice /></ProtectedRoute>} />

                        
                        <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default App


