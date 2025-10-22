import React from 'react';
import { Screen } from '../hooks/useQuiz';
import { CreativePricing, PricingTier } from '../components/ui/creative-pricing';
import { Sparkles, Zap, Users, Building2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface CreativePricingScreenProps {
  setScreen: (screen: Screen) => void;
}

const CreativePricingScreen: React.FC<CreativePricingScreenProps> = ({ setScreen }) => {
  const quizAppTiers: PricingTier[] = [
    {
      name: "Free",
      icon: <Sparkles className="w-6 h-6" />,
      price: 0,
      description: "Perfect for trying out ArenaQuest",
      color: "gray",
      features: [
        "5 quizzes per month",
        "Up to 15 participants",
        "Basic AI questions",
        "7-day analytics",
      ],
    },
    {
      name: "Pro",
      icon: <Zap className="w-6 h-6" />,
      price: 1499,
      description: "For serious educators",
      color: "yellow",
      features: [
        "Unlimited quizzes",
        "Up to 100 participants",
        "Advanced AI features",
        "Custom branding",
      ],
      popular: true,
    },
    {
      name: "Team",
      icon: <Users className="w-6 h-6" />,
      price: 3999,
      description: "For organizations",
      color: "cyan",
      features: [
        "Up to 500 participants",
        "Team collaboration",
        "API access",
        "Priority support",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <Header setScreen={setScreen} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => setScreen('home')}
            className="mb-8 flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>

          {/* Creative Pricing Component */}
          <CreativePricing
            tag="✨ Simple Pricing"
            title="Choose Your Plan"
            description="Start creating engaging quizzes today!"
            tiers={quizAppTiers}
          />

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">
              🎓 All plans include access to our AI-powered question generator
            </p>
            <p className="text-gray-500 text-sm">
              Need help choosing? Contact us at{' '}
              <a href="mailto:support@arenaquest.com" className="text-yellow-400 hover:text-yellow-300">
                support@arenaquest.com
              </a>
            </p>
          </div>

          {/* Features Comparison - Optional Section */}
          <div className="mt-20 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              💎 Why Choose ArenaQuest?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-3">🤖</div>
                <h4 className="text-lg font-semibold text-white mb-2">AI-Powered</h4>
                <p className="text-gray-400">
                  Generate engaging questions with Google Gemini AI
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h4 className="text-lg font-semibold text-white mb-2">Real-Time</h4>
                <p className="text-gray-400">
                  Live leaderboards and instant feedback
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <h4 className="text-lg font-semibold text-white mb-2">Analytics</h4>
                <p className="text-gray-400">
                  Track performance and engagement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreativePricingScreen;
