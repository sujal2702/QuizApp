import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

interface AdminSidebarProps {
  onNavigate: (screen: string) => void;
  active: string;
}

const navLinks = [
  { key: 'admin_dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'quiz', label: 'Live Quiz', icon: '🎮' },
  { key: 'results', label: 'Results', icon: '🏆' },
  { key: 'home', label: 'Home', icon: '🏠' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate, active }) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <aside className="h-full w-64 bg-zinc-900 border-r border-zinc-800 shadow-xl flex flex-col">
      <div className="px-6 py-8 flex flex-col items-center border-b border-zinc-800">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white flex items-center justify-center text-3xl font-black mb-2">
          {user?.displayName ? user.displayName[0] : user?.email?.[0] || '?'}
        </div>
        <div className="text-lg font-bold text-white mb-1 truncate max-w-full text-center">
          {user?.displayName || user?.email}
        </div>
        {isAdmin && (
          <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs font-bold rounded-full">👑 Admin</span>
        )}
      </div>
      <nav className="flex-1 py-6 px-2 space-y-2">
        {navLinks.map(link => (
          <button
            key={link.key}
            onClick={() => onNavigate(link.key)}
            className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-lg transition-all
              ${active === link.key ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg scale-105' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:scale-105'}
            `}
          >
            <span className="text-2xl">{link.icon}</span>
            <span>{link.label}</span>
          </button>
        ))}
      </nav>
      <div className="px-6 py-6 border-t border-zinc-800">
        <Button
          onClick={logout}
          variant="secondary"
          className="!w-full !py-3 !text-lg !font-bold !bg-red-500/10 !text-red-400 hover:!bg-red-500/20"
        >
          🚪 Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
