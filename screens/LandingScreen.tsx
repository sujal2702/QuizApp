import React from 'react';
import { Screen } from '../hooks/useQuiz';
import Button from '../components/Button';
import { AiIcon } from '../components/icons/AiIcon';
import { RealtimeIcon } from '../components/icons/RealtimeIcon';
import { AnalyticsIcon } from '../components/icons/AnalyticsIcon';
import { FloatingSymbols } from '../components/FloatingSymbols';
import { MiniQuiz } from '../components/MiniQuiz';

interface LandingScreenProps {
  setScreen: (screen: Screen) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-card-bg/50 backdrop-blur-sm border border-border-color p-8 rounded-2xl transform transition-transform hover:-translate-y-2">
    <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-full bg-brand-cream text-brand-peach">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-subtle-text">{description}</p>
  </div>
);

const LandingScreen: React.FC<LandingScreenProps> = ({ setScreen }) => {
  return (
    <div className="w-full animate-fade-in">
      {/* Hero Section */}
      <section className="relative text-center py-20 sm:py-28 overflow-hidden">
        <FloatingSymbols />
        <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] bg-gradient-to-br from-brand-peach/30 via-brand-cream/10 to-transparent rounded-[100%] z-0 animate-[spin_20s_linear_infinite]" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-dark-text leading-tight mb-4">
            Create Engaging Quizzes in Seconds
          </h1>
          <p className="text-lg md:text-xl text-subtle-text max-w-3xl mx-auto mb-8">
            Power your classrooms, training sessions, or team events with AI-driven, real-time quizzes that everyone will love.
          </p>
          <div className="max-w-xs mx-auto">
            <Button onClick={() => setScreen('home')} className="text-lg">
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-brand-cream/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text">Why Choose Live Quiz Pro?</h2>
            <p className="text-subtle-text mt-2">Everything you need to create interactive learning experiences.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<AiIcon className="w-8 h-8" />}
              title="AI-Powered Questions"
              description="Generate relevant and challenging quiz questions on any topic instantly with our powerful AI engine."
            />
            <FeatureCard
              icon={<RealtimeIcon className="w-8 h-8" />}
              title="Real-Time Engagement"
              description="Host live quizzes where participants join with a simple code and see results instantly. Perfect for interactive sessions."
            />
            <FeatureCard
              icon={<AnalyticsIcon className="w-8 h-8" />}
              title="Detailed Analytics"
              description="Track performance with detailed leaderboards, question breakdowns, and response times for every participant."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text">Get Started in 3 Easy Steps</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
            <div className="text-center max-w-xs">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 border-2 border-brand-peach text-brand-peach rounded-full text-3xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Generate</h3>
              <p className="text-subtle-text">Describe your topic and let our AI create a complete quiz for you.</p>
            </div>
             <div className="text-center max-w-xs">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 border-2 border-brand-peach text-brand-peach rounded-full text-3xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Host</h3>
              <p className="text-subtle-text">Create a room and share the unique code with your participants to join.</p>
            </div>
             <div className="text-center max-w-xs">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 border-2 border-brand-peach text-brand-peach rounded-full text-3xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Play</h3>
              <p className="text-subtle-text">Run the quiz in real-time, control the pace, and see the leaderboard update live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Quiz Section */}
      <section className="py-20 bg-brand-cream/50">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-dark-text mb-8">Experience it Live</h2>
           <div className="max-w-3xl mx-auto">
             <MiniQuiz />
           </div>
        </div>
      </section>

       {/* Final CTA Section */}
       <section className="py-20">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-dark-text mb-4">Ready to Create Your First Quiz?</h2>
           <p className="text-lg text-subtle-text mb-8 max-w-2xl mx-auto">No sign-up required. Jump right in and experience the future of interactive learning and engagement.</p>
           <div className="max-w-xs mx-auto">
             <Button onClick={() => setScreen('home')} className="text-lg">
                Launch the App
              </Button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default LandingScreen;