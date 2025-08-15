import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Learn } from './components/Learn';
import { Practice } from './components/Practice';
import { Courses } from './components/Courses';
import { UserProvider } from './components/UserContext';

export default function App() {
  return (
    <UserProvider>
      <Router>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-auto min-w-0">
            {/* Mobile content padding to avoid hamburger menu overlap */}
            <div className="pt-16 md:pt-0">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/courses" element={<Courses />} />
                {/* Catch-all route for unmatched paths */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}
