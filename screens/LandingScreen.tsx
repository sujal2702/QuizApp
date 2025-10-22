import React from 'react';
import { Screen } from '../hooks/useQuiz';
import Button from '../components/Button';
import { QuizIcon } from '../components/icons/QuizIcon';
import { AiIcon } from '../components/icons/AiIcon';
import { RealtimeIcon } from '../components/icons/RealtimeIcon';
import { AnalyticsIcon } from '../components/icons/AnalyticsIcon';
import PixelBlast from '../components/PixelBlast';
// FloatingSymbols removed for a cleaner, minimal dark hero
import { MiniQuiz } from '../components/MiniQuiz';

interface LandingScreenProps {
  setScreen: (screen: Screen) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; color: 'yellow' | 'cyan' | 'gray' }> = ({ icon, title, description, color }) => {
  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
    cyan: 'bg-cyan-50 border-cyan-200 hover:border-cyan-400',
    gray: 'bg-gray-50 border-gray-200 hover:border-gray-400',
  };
  
  const iconColorClasses = {
    yellow: 'bg-yellow-400 text-gray-900',
    cyan: 'bg-cyan-200 text-gray-900',
    gray: 'bg-gray-900 text-white',
  };
  
  return (
    <div className={`${colorClasses[color]} border-2 p-8 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1`}>
      <div className={`flex items-center justify-center h-16 w-16 mb-6 rounded-2xl ${iconColorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const LandingScreen: React.FC<LandingScreenProps> = ({ setScreen }) => {
  return (
    <div className="w-full bg-white min-h-screen relative">
      {/* Content */}
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-white via-yellow-50/30 to-cyan-50/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
              <QuizIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6">
            Interactive Quiz Platform<br/>for Modern Teams
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 lg:mb-12 px-4">
            Create engaging quizzes with AI-powered questions, host live sessions with real-time leaderboards, and track detailed analytics—all in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button onClick={() => setScreen('home')} variant="secondary" size="lg">
              Get Started →
            </Button>
            <Button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} variant="outline" size="lg">
              See Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose ArenaQuest?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to create interactive learning experiences and engaging events.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={<AiIcon className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="AI-Powered Questions"
              description="Generate relevant and challenging quiz questions on any topic instantly with our powerful AI engine."
              color="yellow"
            />
            <FeatureCard
              icon={<RealtimeIcon className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Real-Time Engagement"
              description="Host live quizzes where participants join with a simple code and see results instantly. Perfect for interactive sessions."
              color="cyan"
            />
            <FeatureCard
              icon={<AnalyticsIcon className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Detailed Analytics"
              description="Track performance with detailed leaderboards, question breakdowns, and response times for every participant."
              color="gray"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get Started in 3 Easy Steps</h2>
            <p className="text-lg sm:text-xl text-gray-600">Simple, fast, and effective.</p>
          </div>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 xl:gap-16">
            <div className="text-center max-w-xs lg:max-w-sm">
              <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-yellow-400 text-gray-900 rounded-full text-3xl sm:text-4xl font-bold shadow-lg">1</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900">Generate</h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Describe your topic and let our AI create a complete quiz for you.</p>
            </div>
             <div className="text-center max-w-xs lg:max-w-sm">
              <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-cyan-200 text-gray-900 rounded-full text-3xl sm:text-4xl font-bold shadow-lg">2</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900">Host</h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Create a room and share the unique code with your participants to join.</p>
            </div>
             <div className="text-center max-w-xs lg:max-w-sm">
              <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-900 text-white rounded-full text-3xl sm:text-4xl font-bold shadow-lg">3</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900">Play</h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Run the quiz in real-time, control the pace, and see the leaderboard update live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Quiz Section */}
      <section id="demo" className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">Experience ArenaQuest Live</h2>
           <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">Try our interactive demo quiz below to see how it works.</p>
           <div className="max-w-4xl mx-auto">
             <MiniQuiz />
           </div>
        </div>
      </section>

       {/* Final CTA Section */}
       <section className="py-16 sm:py-20 lg:py-28 bg-yellow-50">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Ready to Create Your First Quiz?</h2>
           <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto">No sign-up required. Jump right in and experience the future of interactive learning and engagement with ArenaQuest.</p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
             <Button onClick={() => setScreen('home')} variant="secondary" size="lg">
                Get Started →
              </Button>
             <Button onClick={() => setScreen('admin_login')} variant="outline" size="lg">
                Admin Login
              </Button>
           </div>
        </div>
      </section>

      {/* Footer - removed, using separate Footer component */}
      </div>
    </div>
  );
};

export default LandingScreen;