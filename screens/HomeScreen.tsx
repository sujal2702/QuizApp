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
    <div className="w-full max-w-5xl animate-fade-in-up space-y-8 px-4">
      {/* Header Section */}
      <Card variant="elevated" className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
            <QuizIcon className="w-10 h-10 text-gray-900" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900">
            Welcome to ArenaQuest
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Choose your role to get started with interactive live quizzes
        </p>
      </Card>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz Master Card */}
        <Card 
          variant="elevated" 
          hover 
          onClick={handleAdminClick}
          className="group cursor-pointer overflow-hidden relative bg-yellow-50 border-2 border-yellow-200 hover:border-yellow-400 min-h-[280px]"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <CrownIcon className="w-12 h-12 text-gray-900" />
              </div>
              <div className="text-left">
                <h3 className="text-3xl font-black text-gray-900 group-hover:text-yellow-600 transition-colors">
                  Quiz Master
                </h3>
                <p className="text-sm text-yellow-600 font-bold">Admin Access</p>
              </div>
            </div>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="font-medium">Create and manage quizzes</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="font-medium">Host live quiz sessions</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="font-medium">View analytics & results</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-gray-900 font-bold group-hover:translate-x-2 transition-transform">
                Get Started →
              </span>
              <div className="px-3 py-1 rounded-full bg-yellow-400 text-gray-900 text-xs font-bold">
                LOGIN REQUIRED
              </div>
            </div>
          </div>
        </Card>

        {/* Participant Card */}
        <Card 
          variant="elevated" 
          hover 
          onClick={handleStudentClick}
          className="group cursor-pointer overflow-hidden relative bg-cyan-50 border-2 border-cyan-200 hover:border-cyan-400 min-h-[280px]"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-cyan-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <GraduationCapIcon className="w-12 h-12 text-gray-900" />
              </div>
              <div className="text-left">
                <h3 className="text-3xl font-black text-gray-900 group-hover:text-cyan-600 transition-colors">
                  Participant
                </h3>
                <p className="text-sm text-cyan-600 font-bold">Student Access</p>
              </div>
            </div>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="font-medium">Join quiz with room code</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="font-medium">Answer questions in real-time</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="font-medium">Compete on the leaderboard</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-gray-900 font-bold group-hover:translate-x-2 transition-transform">
                Join Now →
              </span>
              <div className="px-3 py-1 rounded-full bg-cyan-200 text-gray-900 text-xs font-bold">
                NO LOGIN NEEDED
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Section */}
      <Card variant="elevated" className="bg-white">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose ArenaQuest?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-6 rounded-2xl bg-yellow-50 border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all">
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-4 text-3xl">⚡</div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">Real-Time</h4>
            <p className="text-sm text-gray-600">Instant updates and live leaderboards</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-cyan-50 border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-lg transition-all">
            <div className="w-16 h-16 rounded-full bg-cyan-200 flex items-center justify-center mx-auto mb-4 text-3xl">🎯</div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">Interactive</h4>
            <p className="text-sm text-gray-600">Engaging quiz experience</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gray-100 border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg transition-all">
            <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center mx-auto mb-4 text-3xl">📊</div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">Analytics</h4>
            <p className="text-sm text-gray-600">Track performance and insights</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;