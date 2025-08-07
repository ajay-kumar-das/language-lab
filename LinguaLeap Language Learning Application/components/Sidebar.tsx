import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, BookOpen, MessageSquare, GraduationCap, Languages } from 'lucide-react';
import { cn } from './ui/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Practice', href: '/practice', icon: MessageSquare },
  { name: 'Courses', href: '/courses', icon: GraduationCap },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border">
      <div className="flex items-center gap-2 p-6 border-b border-border">
        <Languages className="h-8 w-8 text-primary" />
        <h1 className="text-xl text-foreground">LinguaLeap</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}