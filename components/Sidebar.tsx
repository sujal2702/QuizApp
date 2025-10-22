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
    { id: 'admin_dashboard', label: 'Dashboard', icon: AnalyticsIcon, color: 'bg-yellow-400' },
    { id: 'lobby', label: 'Lobby', icon: GraduationCapIcon, color: 'bg-cyan-200' },
    { id: 'quiz', label: 'Quiz', icon: QuizIcon, color: 'bg-green-500' },
    { id: 'results', label: 'Results', icon: CrownIcon, color: 'bg-gray-900' },
  ] : userRole === 'student' ? [
    { id: 'lobby', label: 'Lobby', icon: GraduationCapIcon, color: 'bg-cyan-200' },
    { id: 'quiz', label: 'Quiz', icon: QuizIcon, color: 'bg-yellow-400' },
    { id: 'results', label: 'Results', icon: CrownIcon, color: 'bg-gray-900' },
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
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r-2 border-gray-200 z-50 transition-transform duration-300 ease-out shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
                  <QuizIcon className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900">
                    ArenaQuest
                  </h1>
                  <p className="text-xs text-gray-500 font-semibold">
                    {userRole === 'admin' ? 'Admin Panel' : 'Student Portal'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="lg:hidden w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                    isActive
                      ? `${item.color} text-gray-900 shadow-lg`
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-black/10' 
                      : 'bg-white'
                  }`}>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-gray-900' : 'text-gray-600'}`} />
                  </div>
                  <span className={`font-bold text-base ${
                    isActive ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-gray-900 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Info Section */}
          <div className="p-4 border-t-2 border-gray-200">
            <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-gray-50">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                userRole === 'admin' 
                  ? 'bg-yellow-400 text-gray-900 shadow-md' 
                  : 'bg-cyan-200 text-gray-900 shadow-md'
              }`}>
                {userRole === 'admin' ? 'A' : 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {userRole === 'admin' ? 'Administrator' : 'Student'}
                </p>
                <p className="text-xs text-gray-500 truncate">
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
