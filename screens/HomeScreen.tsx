import React from 'react';
import { Screen, UserRole } from '../hooks/useQuiz';
import Card from '../components/Card';
import { CrownIcon } from '../components/icons/CrownIcon';
import { GraduationCapIcon } from '../components/icons/GraduationCapIcon';
import { QuizIcon } from '../components/icons/QuizIcon';

interface HomeScreenProps {
  setScreen: (screen: Screen) => void;
  setUserRole: (role: UserRole) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setScreen, setUserRole }) => {
  const handleAdminClick = () => {
    setUserRole('admin');
    setScreen('admin_login');
  };

  const handleStudentClick = () => {
    setUserRole('student');
    setScreen('student_join');
  };

  return (
    <div className="w-full max-w-5xl animate-fade-in-up space-y-8">
      {/* Header Section */}
      <Card variant="glass" className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/50">
            <QuizIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Welcome to QuizPro
          </h1>
        </div>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Choose your role to get started with interactive live quizzes
        </p>
      </Card>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz Master Card */}
        <Card 
          variant="gradient" 
          hover 
          onClick={handleAdminClick}
          className="group cursor-pointer overflow-hidden relative border-2 border-transparent hover:border-violet-500/50"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <CrownIcon className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-white group-hover:text-violet-400 transition-colors">
                  Quiz Master
                </h3>
                <p className="text-sm text-violet-400 font-semibold">Admin Access</p>
              </div>
            </div>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-zinc-300">
                <div className="w-2 h-2 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />
                <span>Create and manage quizzes</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
                <span>Host live quiz sessions</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-lg shadow-fuchsia-500/50" />
                <span>View analytics & results</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-violet-400 font-bold group-hover:translate-x-2 transition-transform">
                Get Started →
              </span>
              <div className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">
                LOGIN REQUIRED
              </div>
            </div>
          </div>
        </Card>

        {/* Participant Card */}
        <Card 
          variant="gradient" 
          hover 
          onClick={handleStudentClick}
          className="group cursor-pointer overflow-hidden relative border-2 border-transparent hover:border-cyan-500/50"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <GraduationCapIcon className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
                  Participant
                </h3>
                <p className="text-sm text-cyan-400 font-semibold">Student Access</p>
              </div>
            </div>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-zinc-300">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50" />
                <span>Join quiz with room code</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                <span>Answer questions in real-time</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
                <span>Compete on the leaderboard</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-cyan-400 font-bold group-hover:translate-x-2 transition-transform">
                Join Now →
              </span>
              <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                NO LOGIN NEEDED
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Section */}
      <Card variant="glass">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Why Choose QuizPro?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="font-bold text-white mb-1">Real-Time</h4>
            <p className="text-xs text-zinc-400">Instant updates and live leaderboards</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-bold text-white mb-1">Interactive</h4>
            <p className="text-xs text-zinc-400">Engaging quiz experience</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="font-bold text-white mb-1">Analytics</h4>
            <p className="text-xs text-zinc-400">Track performance and insights</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;