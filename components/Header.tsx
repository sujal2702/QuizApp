import React, { useState } from 'react';
import { QuizIcon } from './icons/QuizIcon';
import { Screen } from '../hooks/useQuiz';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

interface HeaderProps {
  screen: Screen;
  setScreen: (screen: Screen) => void;
}

const Header: React.FC<HeaderProps> = ({ screen, setScreen }) => {
  const { user, isAdmin, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isLandingPage = screen === 'landing';
  
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
    <header className="flex-shrink-0 w-full bg-white/95 backdrop-blur-md py-4 border-b border-slate-200 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setScreen('landing')}
        >
          <div className="relative">
            <QuizIcon className="w-10 h-10 text-violet-600 group-hover:text-fuchsia-600 transition-colors" />
            <div className="absolute inset-0 bg-violet-400/20 blur-xl group-hover:bg-fuchsia-400/30 transition-all"></div>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
            Live Quiz Pro
          </h1>
        </div>
        
        {isLandingPage ? (
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-slate-600 hover:text-violet-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-violet-600 font-medium transition-colors">How It Works</a>
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
            {/* Navigation for logged-in users */}
            {user && (
              <nav className="hidden md:flex items-center space-x-4">
                {isAdmin && (
                  <button
                    onClick={() => setScreen('admin_dashboard')}
                    className="text-slate-600 hover:text-violet-600 font-medium transition-colors"
                  >
                    📊 Dashboard
                  </button>
                )}
                <button
                  onClick={() => setScreen('home')}
                  className="text-slate-600 hover:text-violet-600 font-medium transition-colors"
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
                  className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-4 py-2 rounded-xl font-bold hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-md hover:shadow-lg"
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
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in-up">
                      <div className="px-4 py-3 border-b border-slate-200">
                        <p className="text-sm font-bold text-slate-800">{user.displayName || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
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
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                          >
                            📊 Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setScreen('home');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                        >
                          🏠 Home
                        </button>
                      </div>

                      <div className="border-t border-slate-200 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
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