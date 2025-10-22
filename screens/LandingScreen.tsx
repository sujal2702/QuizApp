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

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-2xl transform transition-transform hover:-translate-y-2 hover:border-violet-500/50">
    <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-full bg-violet-500/10 text-violet-400">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-zinc-400">{description}</p>
  </div>
);

const LandingScreen: React.FC<LandingScreenProps> = ({ setScreen }) => {
  return (
    <div className="w-full animate-fade-in bg-gradient-to-br from-black via-zinc-950 to-zinc-900 min-h-screen relative">
      {/* PixelBlast Background */}
      <div className="fixed inset-0 z-0">
        <PixelBlast
          variant="circle"
          pixelSize={5}
          color="#A78BFA"
          patternScale={2.5}
          patternDensity={1.1}
          pixelSizeJitter={0.4}
          enableRipples
          rippleSpeed={0.5}
          rippleThickness={0.15}
          rippleIntensityScale={1.8}
          liquid
          liquidStrength={0.15}
          liquidRadius={1.5}
          liquidWobbleSpeed={4}
          speed={0.5}
          edgeFade={0.3}
          transparent
        />
      </div>
      
      {/* Content - positioned above background */}
      <div className="relative z-10">
      {/* Header */}
      <header className="relative z-20 py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gradient">ArenaQuest</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-zinc-300 hover:text-violet-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-zinc-300 hover:text-violet-400 transition-colors">How It Works</a>
            <a href="#demo" className="text-zinc-300 hover:text-violet-400 transition-colors">Demo</a>
          </nav>
          <Button onClick={() => setScreen('home')} variant="secondary">Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
            {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/50">
              <QuizIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              ArenaQuest
            </h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-zinc-400 max-w-2xl mx-auto mb-8 lg:mb-12 px-4">
            The ultimate platform for creating and hosting interactive quizzes. Engage your audience with AI-powered questions, real-time leaderboards, and detailed analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button onClick={() => setScreen('home')} className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              Start Creating Quizzes
            </Button>
            <Button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-28 bg-zinc-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Why Choose ArenaQuest?</h2>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">Everything you need to create interactive learning experiences and engaging events.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={<AiIcon className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="AI-Powered Questions"
              description="Generate relevant and challenging quiz questions on any topic instantly with our powerful AI engine."
            />
            <FeatureCard
              icon={<RealtimeIcon className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Real-Time Engagement"
              description="Host live quizzes where participants join with a simple code and see results instantly. Perfect for interactive sessions."
            />
            <FeatureCard
              icon={<AnalyticsIcon className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Detailed Analytics"
              description="Track performance with detailed leaderboards, question breakdowns, and response times for every participant."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Get Started in 3 Easy Steps</h2>
            <p className="text-lg sm:text-xl text-zinc-400">Simple, fast, and effective.</p>
          </div>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 xl:gap-16">
            <div className="text-center max-w-xs lg:max-w-sm">
              <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 border-4 border-violet-500 text-violet-400 rounded-full text-3xl sm:text-4xl font-bold bg-zinc-900/50">1</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Generate</h3>
              <p className="text-zinc-400 text-sm sm:text-base lg:text-lg">Describe your topic and let our AI create a complete quiz for you.</p>
            </div>
             <div className="text-center max-w-xs lg:max-w-sm">
              <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 border-4 border-violet-500 text-violet-400 rounded-full text-3xl sm:text-4xl font-bold bg-zinc-900/50">2</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Host</h3>
              <p className="text-zinc-400 text-sm sm:text-base lg:text-lg">Create a room and share the unique code with your participants to join.</p>
            </div>
             <div className="text-center max-w-xs lg:max-w-sm">
              <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 border-4 border-violet-500 text-violet-400 rounded-full text-3xl sm:text-4xl font-bold bg-zinc-900/50">3</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Play</h3>
              <p className="text-zinc-400 text-sm sm:text-base lg:text-lg">Run the quiz in real-time, control the pace, and see the leaderboard update live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Quiz Section */}
      <section id="demo" className="py-16 sm:py-20 lg:py-28 bg-zinc-950/50">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8">Experience ArenaQuest Live</h2>
           <p className="text-lg sm:text-xl text-zinc-400 mb-8 sm:mb-12 max-w-2xl mx-auto">Try our interactive demo quiz below to see how it works.</p>
           <div className="max-w-4xl mx-auto">
             <MiniQuiz />
           </div>
        </div>
      </section>

       {/* Final CTA Section */}
       <section className="py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Ready to Create Your First Quiz?</h2>
           <p className="text-lg sm:text-xl text-zinc-400 mb-8 sm:mb-10 max-w-3xl mx-auto">No sign-up required. Jump right in and experience the future of interactive learning and engagement with ArenaQuest.</p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
             <Button onClick={() => setScreen('home')} className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                Launch ArenaQuest
              </Button>
             <Button onClick={() => setScreen('admin_login')} variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                Admin Login
              </Button>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-950/80 border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold text-gradient mb-4">ArenaQuest</div>
          <p className="text-zinc-400 mb-6">© 2025 ArenaQuest. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-zinc-400 hover:text-violet-400 transition-colors">Privacy</a>
            <a href="#" className="text-zinc-400 hover:text-violet-400 transition-colors">Terms</a>
            <a href="#" className="text-zinc-400 hover:text-violet-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default LandingScreen;