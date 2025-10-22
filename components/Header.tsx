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
    <header className="flex-shrink-0 w-full bg-gradient-to-r from-zinc-900/95 via-zinc-900/98 to-zinc-900/95 backdrop-blur-md py-4 border-b border-zinc-800/50 shadow-2xl sticky top-0 z-40">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Menu Button for Mobile/Tablet */}
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 flex items-center justify-center transition-all shadow-lg hover:shadow-violet-500/30"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setScreen('landing')}
          >
            <div className="relative">
              <QuizIcon className="w-10 h-10 text-violet-500 group-hover:text-violet-400 transition-colors drop-shadow-glow" />
              <div className="absolute inset-0 bg-violet-500/30 blur-xl group-hover:bg-violet-400/40 transition-all"></div>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tight">
              ArenaQuest
            </h1>
          </div>
        </div>
        
        {isLandingPage ? (
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-zinc-400 hover:text-violet-400 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-zinc-400 hover:text-violet-400 font-medium transition-colors">How It Works</a>
            </nav>
            <Button 
              onClick={() => setScreen('home')} 
              className="!w-auto !py-2 !px-6 !text-sm"
            >
              🚀 Launch App
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {/* Prev / Next navigation */}
            <div className="hidden md:flex items-center gap-2 mr-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => prevScreen && setScreen(prevScreen)}
                disabled={!hasPrev}
                className="!w-10 !h-10"
                aria-label="Previous"
              >
                <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => nextScreen && setScreen(nextScreen)}
                disabled={!hasNext}
                className="!w-10 !h-10"
                aria-label="Next"
              >
                <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
            {/* Navigation for logged-in users */}
            {user && (
              <nav className="hidden md:flex items-center space-x-4">
                {isAdmin && (
                  <button
                    onClick={() => setScreen('admin_dashboard')}
                    className="text-zinc-400 hover:text-violet-400 font-medium transition-colors"
                  >
                    📊 Dashboard
                  </button>
                )}
                <button
                  onClick={() => setScreen('home')}
                  className="text-zinc-400 hover:text-violet-400 font-medium transition-colors"
                >
                  🏠 Home
                </button>
              </nav>
            )}

            {/* User Menu or Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:from-violet-500 hover:to-purple-500 transition-all shadow-md hover:shadow-lg"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-black">
                    {getUserInitials()}
                  </div>
                  <span className="hidden sm:inline">{user.displayName || user.email?.split('@')[0]}</span>
                  <span className="text-xs">▼</span>
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 py-2 z-50 animate-fade-in-up">
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-sm font-bold text-white">{user.displayName || 'User'}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs font-bold rounded-full">
                            👑 Admin
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
                            className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-violet-400 transition-colors"
                          >
                            📊 Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setScreen('home');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-violet-400 transition-colors"
                        >
                          🏠 Home
                        </button>
                      </div>

                      <div className="border-t border-zinc-800 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors font-medium"
                        >
                          🚪 Logout
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
                  variant="secondary"
                  className="!w-auto !py-2 !px-4 !text-sm"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => setScreen('home')} 
                  className="!w-auto !py-2 !px-4 !text-sm"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;