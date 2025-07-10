import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

import Predict from './pages/Predict';
import Subscribe from './pages/Subscribe';
import History from './pages/History';
import About from './pages/About';
import MoodMapPage from './pages/MoodMapPage';
import AlertsPage from './pages/AlertsPage';
import ReportPage from './pages/ReportPage';
import TrendsPage from './pages/TrendsPage';
import ComparePage from './pages/ComparePage';
import AdminDashboard from './admin/AdminDashboard';
import SocialPage from './pages/SocialPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/predict" element={<Predict />} />
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/history" element={<History />} />
                <Route path="/about" element={<About />} />
                <Route path="/moodmap" element={<MoodMapPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/trends" element={<TrendsPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/social" element={<SocialPage />} />
              </Routes>
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 