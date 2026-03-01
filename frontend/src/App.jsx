import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Curriculum from './pages/Curriculum';
import Predictions from './pages/Predictions';
import BurnoutAlerts from './pages/BurnoutAlerts';
import FacultyReports from './pages/FacultyReports';
import Collaboration from './pages/Collaboration';

import SplashScreen from './components/SplashScreen';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <SplashScreen />;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/curriculum" element={<ProtectedRoute><Curriculum /></ProtectedRoute>} />
          <Route path="/predictions" element={<ProtectedRoute><Predictions /></ProtectedRoute>} />
          <Route path="/burnout" element={<ProtectedRoute><BurnoutAlerts /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><FacultyReports /></ProtectedRoute>} />
          <Route path="/collaboration" element={<ProtectedRoute><Collaboration /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
