import React from 'react';
import { Screen, UserRole } from '../hooks/useQuiz';
import { QuizIcon } from './icons/QuizIcon';
import { AnalyticsIcon } from './icons/AnalyticsIcon';
import { GraduationCapIcon } from './icons/GraduationCapIcon';
import { CrownIcon } from './icons/CrownIcon';

interface SidebarProps {
  screen: Screen;
  userRole: UserRole | null;
  setScreen: (screen: Screen) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ screen, userRole, setScreen, isOpen, onClose }) => {
  const menuItems = userRole === 'admin' ? [
    { id: 'admin_dashboard', label: 'Dashboard', icon: AnalyticsIcon, color: 'from-violet-500 to-purple-600' },
    { id: 'lobby', label: 'Lobby', icon: GraduationCapIcon, color: 'from-blue-500 to-cyan-600' },
    { id: 'quiz', label: 'Quiz', icon: QuizIcon, color: 'from-green-500 to-emerald-600' },
    { id: 'results', label: 'Results', icon: CrownIcon, color: 'from-orange-500 to-red-600' },
  ] : userRole === 'student' ? [
    { id: 'lobby', label: 'Lobby', icon: GraduationCapIcon, color: 'from-blue-500 to-cyan-600' },
    { id: 'quiz', label: 'Quiz', icon: QuizIcon, color: 'from-green-500 to-emerald-600' },
    { id: 'results', label: 'Results', icon: CrownIcon, color: 'from-orange-500 to-red-600' },
  ] : [];

  if (menuItems.length === 0) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-zinc-900 via-zinc-900 to-black border-r border-zinc-800/50 backdrop-blur-xl z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-zinc-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/50">
                  <QuizIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
                    ArenaQuest
                  </h1>
                  <p className="text-xs text-zinc-500 font-semibold">
                    {userRole === 'admin' ? 'Admin Panel' : 'Student Portal'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="lg:hidden w-8 h-8 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = screen === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setScreen(item.id as Screen);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} shadow-lg shadow-${item.color.split(' ')[1]}/20 scale-105`
                      : 'bg-zinc-800/30 hover:bg-zinc-800/50 hover:scale-102'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-white/20 shadow-inner' 
                      : 'bg-zinc-800/50 group-hover:bg-zinc-700/50'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`} />
                  </div>
                  <span className={`font-bold text-sm ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Info Section */}
          <div className="p-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-800/30">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                userRole === 'admin' 
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
              }`}>
                {userRole === 'admin' ? 'A' : 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {userRole === 'admin' ? 'Administrator' : 'Student'}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {userRole === 'admin' ? 'Full Access' : 'Participant'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
