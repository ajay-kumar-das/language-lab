import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, BookOpen, MessageSquare, GraduationCap, Languages, LogOut, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "./ui/utils";
import { useLanguage } from "./LanguageProvider";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  user?: any;
  onLogout?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export function Sidebar({ user, onLogout, isCollapsed = false, onToggleCollapse, isMobileOpen = false, onMobileToggle }: SidebarProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useLanguage();

  const navigation = [
    { name: t('dashboard'), key: 'dashboard', href: "/dashboard", icon: Home },
    { name: t('learn'), key: 'learn', href: "/learn", icon: BookOpen },
    { name: t('practice'), key: 'practice', href: "/practice", icon: MessageSquare },
    { name: t('courses'), key: 'courses', href: "/courses", icon: GraduationCap },
    { name: t('profile'), key: 'profile', href: "/profile", icon: User },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get user display info
  const userDisplayName = user ? 
    `${user.firstName} ${user.lastName}`.trim() || user.username || user.email.split('@')[0] : 
    'User';
  
  const userEmail = user?.email || '';

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileToggle}
        />
      )}
      
      {/* Mobile Header with Hamburger */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 p-4 flex items-center justify-between z-30 md:hidden" style={{ backgroundColor: 'var(--color-sidebar-background)', borderBottom: '1px solid var(--color-sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Languages className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--color-sidebar-text)' }}>LinguaLeap</h1>
          </div>
          <button
            onClick={onMobileToggle}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--color-sidebar-surface)', color: 'var(--color-sidebar-text)' }}
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" style={{ color: 'var(--color-sidebar-text)' }} />
            ) : (
              <Menu className="h-5 w-5" style={{ color: 'var(--color-sidebar-text)' }} />
            )}
          </button>
        </div>
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "sidebar flex flex-col h-full transition-all duration-300 relative",
        isMobile ? (
          cn(
            "fixed top-0 left-0 z-50 transform",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
            "w-64 pt-16"
          )
        ) : (
          isCollapsed ? "w-16" : "w-64"
        )
      )}>
      {/* Header with Logo */}
      {!isMobile && (
        <div className="flex items-center gap-3 p-6 relative" style={{ borderBottom: '1px solid var(--color-sidebar-border)' }}>
        <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
          <Languages className="h-6 w-6 text-white" />
        </div>
        {!isCollapsed && (
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-sidebar-text)' }}>
            LinguaLeap
          </h1>
        )}
        
        {/* Toggle Button */}
        {!isMobile && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors z-10"
            style={{ 
              backgroundColor: 'var(--color-sidebar-surface)', 
              color: 'var(--color-sidebar-text)' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-sidebar-surface)';
            }}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" style={{ color: 'var(--color-sidebar-text)' }} />
            ) : (
              <ChevronLeft className="h-4 w-4" style={{ color: 'var(--color-sidebar-text)' }} />
            )}
          </button>
        )}
      </div>
      )}
      
      {/* User Profile Section */}
      {user && (
        <div className="p-4" style={{ borderBottom: '1px solid var(--color-sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-sidebar-surface)' }}>
              <User className="h-5 w-5" style={{ color: 'var(--color-sidebar-textSecondary)' }} />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-sidebar-text)' }}>
                  {userDisplayName}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--color-sidebar-textMuted)' }}>
                  {userEmail}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "sidebar-nav-item flex items-center gap-3 px-3 py-4 rounded-lg transition-all duration-200 text-sm font-medium relative group",
                isActive 
                  ? "gradient-navigation text-white" 
                  : "",
                isCollapsed && !isMobile && "justify-center"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-6 w-6 flex-shrink-0" />
              {(!isCollapsed || isMobile) && item.name}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none" style={{ backgroundColor: 'var(--color-sidebar-surface)', color: 'var(--color-sidebar-text)' }}>
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-3" style={{ borderTop: '1px solid var(--color-sidebar-border)' }}>
        {/* Theme Toggle */}
        <ThemeToggle 
          showLabel={!isCollapsed}
          size="md"
          className={cn(
            "relative group",
            isCollapsed && !isMobile && "justify-center"
          )}
        />

        {/* Keep Learning Text */}
        {(!isCollapsed || isMobile) && (
          <div className="text-xs" style={{ color: 'var(--color-sidebar-textMuted)' }}>
            {t('keep_learning')}
          </div>
        )}

        {/* Logout Button */}
        {user && onLogout && (
          <button
            onClick={onLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-sm relative group",
              isCollapsed && !isMobile && "justify-center"
            )}
            style={{ 
              color: 'var(--color-sidebar-textSecondary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)';
              e.currentTarget.style.color = 'var(--color-sidebar-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-sidebar-textSecondary)';
            }}
            title={isCollapsed ? t('sign_out') : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" style={{ color: 'inherit' }} />
            {(!isCollapsed || isMobile) && t('sign_out')}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none" style={{ backgroundColor: 'var(--color-sidebar-surface)', color: 'var(--color-sidebar-text)' }}>
                {t('sign_out')}
              </div>
            )}
          </button>
        )}
      </div>
    </div>
    </>
  );
}
