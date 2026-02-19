import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Shield, LogOut, Menu, X } from 'lucide-react';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import ThemeToggle from './components/ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, currentPageName }) {
  const [isDark, setIsDark] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // Get user profile
    const getProfile = async () => {
      try {
        const user = await base44.auth.me();
        const profiles = await base44.entities.Profile.filter({ email: user.email });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
        }
      } catch (error) {
        // Not logged in
      }
    };
    getProfile();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const isAdmin = profile?.role === 'admin' && profile?.status === 'active';
  const isActive = profile?.status === 'active';

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <style>{`
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --primary: 221.2 83.2% 53.3%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96.1%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96.1%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96.1%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 221.2 83.2% 53.3%;
          --radius: 0.75rem;
        }

        .dark {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 217.2 91.2% 59.8%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 224.3 76.3% 48%;
        }
      `}</style>

      {/* Top Navigation Bar */}
      {isActive && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">שק״מ</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white hidden sm:block">אופוזיציה</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden sm:flex items-center gap-2">
                <Link to={createPageUrl('Dashboard')}>
                  <Button
                    variant={currentPageName === 'Dashboard' ? 'default' : 'ghost'}
                    size="sm"
                    className={currentPageName === 'Dashboard' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  >
                    <Home className="w-4 h-4 me-2" />
                    ראשי
                  </Button>
                </Link>
                
                {isAdmin && (
                  <Link to={createPageUrl('Admin')}>
                    <Button
                      variant={currentPageName === 'Admin' ? 'default' : 'ghost'}
                      size="sm"
                      className={currentPageName === 'Admin' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                    >
                      <Shield className="w-4 h-4 me-2" />
                      ניהול
                    </Button>
                  </Link>
                )}

                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-slate-700">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex sm:hidden items-center gap-2">
                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <div className="p-4 space-y-2">
                  <Link to={createPageUrl('Dashboard')} onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant={currentPageName === 'Dashboard' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${currentPageName === 'Dashboard' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                    >
                      <Home className="w-4 h-4 me-2" />
                      ראשי
                    </Button>
                  </Link>
                  
                  {isAdmin && (
                    <Link to={createPageUrl('Admin')} onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant={currentPageName === 'Admin' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${currentPageName === 'Admin' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                      >
                        <Shield className="w-4 h-4 me-2" />
                        ניהול
                      </Button>
                    </Link>
                  )}
                  
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-slate-500">
                    <LogOut className="w-4 h-4 me-2" />
                    התנתק
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      )}

      {/* Main Content */}
      <main className={isActive ? 'pt-16' : ''}>
        {children}
      </main>
    </div>
  );
}
