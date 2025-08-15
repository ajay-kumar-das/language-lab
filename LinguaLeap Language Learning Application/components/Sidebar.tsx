import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, BookOpen, MessageSquare, GraduationCap, Languages, Menu, X } from 'lucide-react';
import { cn } from './ui/utils';
import { useIsMobile } from './ui/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Practice', href: '/practice', icon: MessageSquare },
  { name: 'Courses', href: '/courses', icon: GraduationCap },
  { name: 'Profile', href: '/profile', icon: User },
];

// Desktop Sidebar Component
function DesktopSidebar() {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:flex-col w-64 bg-card border-r border-border">
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

// Mobile Sidebar Component using Sheet
function MobileSidebar() {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="fixed top-4 left-4 z-40 p-2 bg-card border border-border rounded-lg shadow-md"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b border-border p-6">
            <SheetTitle className="flex items-center gap-2">
              <Languages className="h-8 w-8 text-primary" />
              <span className="text-xl text-foreground">LinguaLeap</span>
            </SheetTitle>
          </SheetHeader>
          
          <nav className="px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setOpen(false)} // Close sheet when navigating
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-colors touch-target',
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
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Main Sidebar Component - Responsive
export function Sidebar() {
  const isMobile = useIsMobile();

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
