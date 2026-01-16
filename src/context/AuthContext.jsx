import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Check if there's an existing Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          type: 'student'
        });
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (studentId, password) => {
    try {
      setIsLoading(true);
      
      if (!studentId || !password) {
        setIsLoading(false);
        return { success: false, error: 'Student ID and password are required' };
      }

      // If studentId doesn't contain @, assume it's an email without domain
      let email = studentId;
      if (!studentId.includes('@')) {
        email = `${studentId}@student.local`;
      }

      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Auth error:', error);
        setIsLoading(false);
        return { success: false, error: 'Invalid student ID or password' };
      }

      if (data.session && data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          type: 'student'
        });
        setIsAdmin(false);
        setIsLoading(false);
        return { success: true, user: data.user };
      }

      setIsLoading(false);
      return { success: false, error: 'No session created' };
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const adminLogin = async (username, password) => {
    try {
      setIsLoading(true);
      
      // Treat username as email and sign in with Supabase Auth
      let email = username;
      if (!username.includes('@')) {
        email = `${username}@admin.local`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Admin auth error:', error);
        setIsLoading(false);
        return { success: false, error: 'Invalid username or password' };
      }

      if (data.session && data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          type: 'admin'
        });
        setIsAdmin(true);
        setIsLoading(false);
        return { success: true, user: data.user };
      }

      setIsLoading(false);
      return { success: false, error: 'No session created' };
    } catch (error) {
      console.error('Admin login error:', error);
      setIsLoading(false);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setIsAdmin(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAdmin,
    isAuthenticated: !!user,
    login,
    adminLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
