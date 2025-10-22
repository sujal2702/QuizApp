import React, { useState } from 'react';
import { QuizIcon } from './icons/QuizIcon';
import { Screen } from '../hooks/useQuiz';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

interface HeaderProps {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ screen, setScreen, onMenuClick, showMenuButton = false }) => {
  const { user, isAdmin, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isLandingPage = screen === 'landing';
  
  // Define simple linear flows for navigation (used by Prev / Next buttons)
  const studentFlow: Screen[] = ['home', 'student_join', 'lobby', 'quiz', 'results'];
  const adminFlow: Screen[] = ['home', 'admin_login', 'admin_signup', 'admin_dashboard', 'quiz', 'results'];

  const getFlow = (): Screen[] => {
    // Prefer admin flow for admins, otherwise student flow
    if (isAdmin) return adminFlow;
    return studentFlow;
  };

  const flow = getFlow();
  const idx = flow.indexOf(screen as Screen);
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < flow.length - 1;
  const prevScreen = hasPrev ? flow[idx - 1] : undefined;
  const nextScreen = hasNext ? flow[idx + 1] : undefined;
  
  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    setScreen('home');
  };

  const getUserInitials = () => {
    if (!user) return '?';
    if (user.displayName) {
      return user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.[0].toUpperCase() || '?';
  };
  
  return (
    <header className="flex-shrink-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50 transition-all">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Left Section: Menu + Logo */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Menu Button for Mobile/Tablet */}
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="lg:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                aria-label="Menu"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <div 
              className="flex items-center space-x-2 lg:space-x-3 cursor-pointer group"
              onClick={() => setScreen('landing')}
            >
              <div className="relative flex items-center">
                {/* Sparkle Symbol */}
                <div className="text-2xl lg:text-3xl group-hover:scale-110 transition-transform duration-300 animate-pulse">
                  ✨
                </div>
                <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h1 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent group-hover:from-yellow-500 group-hover:to-yellow-700 transition-all">
                ArenaQuest
              </h1>
            </div>
          </div>
          
          {isLandingPage ? (
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                <a 
                  href="#features" 
                  className="px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 hover:text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  className="px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 hover:text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  How It Works
                </a>
                <a 
                  href="#demo" 
                  className="px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 hover:text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  Demo
                </a>
              </nav>
              
              {/* CTA Button */}
              <Button 
                onClick={() => setScreen('home')} 
                variant="secondary"
                size="md"
                className="shadow-lg hover:shadow-xl"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
                <span className="ml-1">→</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Prev / Next navigation */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => prevScreen && setScreen(prevScreen)}
                  disabled={!hasPrev}
                  className="w-9 h-9 rounded-lg border-2 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
                  aria-label="Previous"
                >
                  <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => nextScreen && setScreen(nextScreen)}
                  disabled={!hasNext}
                  className="w-9 h-9 rounded-lg border-2 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
                  aria-label="Next"
                >
                  <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Navigation for logged-in users */}
              {user && (
                <nav className="hidden lg:flex items-center space-x-1">
                  {isAdmin && (
                    <button
                      onClick={() => setScreen('admin_dashboard')}
                      className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-1.5"
                    >
                      <span className="text-base">📊</span>
                      <span>Dashboard</span>
                    </button>
                  )}
                  <button
                    onClick={() => setScreen('home')}
                    className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <span className="text-base">🏠</span>
                    <span>Home</span>
                  </button>
                </nav>
              )}

              {/* User Menu or Login Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white pl-1 pr-3 lg:pr-4 py-1 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 rounded-full flex items-center justify-center text-sm font-black shadow-inner">
                      {getUserInitials()}
                    </div>
                    <span className="hidden sm:inline text-sm lg:text-base">{user.displayName || user.email?.split('@')[0]}</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50 overflow-hidden backdrop-blur-sm">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                          <p className="text-sm font-bold text-gray-900">{user.displayName || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                              <span>👑</span>
                              <span>Admin</span>
                            </span>
                          )}
                        </div>
                        
                        <div className="py-1">
                          {isAdmin && (
                            <button
                              onClick={() => {
                                setScreen('admin_dashboard');
                                setShowUserMenu(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-150 flex items-center gap-2.5"
                            >
                              <span className="text-base">📊</span>
                              <span className="font-medium">Dashboard</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setScreen('home');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-150 flex items-center gap-2.5"
                          >
                            <span className="text-base">🏠</span>
                            <span className="font-medium">Home</span>
                          </button>
                        </div>

                        <div className="border-t border-gray-200 py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-150 font-medium flex items-center gap-2.5"
                          >
                            <span className="text-base">🚪</span>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={() => setScreen('admin_login')} 
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => setScreen('home')} 
                    variant="secondary"
                    size="sm"
                    className="shadow-lg hover:shadow-xl"
                  >
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Start</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;