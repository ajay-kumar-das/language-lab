import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./components/AuthProvider";
import { LanguageProvider } from "./components/LanguageProvider";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthWrapper } from "./components/auth/AuthWrapper";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Learn } from "./components/Learn";
import { Practice } from "./components/Practice";
import { Courses } from "./components/Courses";
import { Profile } from "./components/Profile";
import { AuthCallback } from "./components/auth/AuthCallback";

/**
 * Protected Route Component
 * Handles authentication and routing logic
 */
const ProtectedApp: React.FC = () => {
  const { isAuthenticated, user, login, register, logout, isLoading, error, clearError } = useAuthContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-collapse on mobile by default and close mobile menu
      if (mobile) {
        setSidebarCollapsed(true);
        setMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show authentication forms if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthWrapper
        onLogin={login}
        onRegister={register}
        isLoading={isLoading}
        error={error}
        clearError={clearError}
      />
    );
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Show main application with responsive sidebar layout
  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Sidebar 
        user={user} 
        onLogout={logout} 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobileOpen={mobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />
      <main className={`flex-1 overflow-auto ${isMobile ? 'pt-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/profile" element={<Profile />} />
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

/**
 * Main App Component
 * Provides authentication context and routing
 */
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth callback route - handles Google OAuth redirect */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              {/* All other routes go through ProtectedApp */}
              <Route path="*" element={<ProtectedApp />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
