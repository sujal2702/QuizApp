import React from 'react';
import { Screen } from '../hooks/useQuiz';
import Button from '../components/Button';
import Card from '../components/Card';
import { CreativePricing, PricingTier } from '../components/ui/creative-pricing';
import { Sparkles, Zap, Users, Building2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface PricingScreenProps {
  setScreen: (screen: Screen) => void;
}

const PricingScreen: React.FC<PricingScreenProps> = ({ setScreen }) => {
  // Professional pricing tiers for CreativePricing component
  const pricingTiers: PricingTier[] = [
    {
      name: 'Free',
      icon: <Sparkles className="w-6 h-6" />,
      price: 0,
      description: 'Perfect for trying out ArenaQuest',
      features: [
        '5 quizzes per month',
        'Up to 15 participants',
        'Basic AI generation',
        '7-day analytics',
        'Community support'
      ],
      color: 'gray'
    },
    {
      name: 'Pro',
      icon: <Zap className="w-6 h-6" />,
      price: 1499,
      description: 'For serious educators and trainers',
      features: [
        'Unlimited quizzes',
        'Up to 100 participants',
        'Advanced AI features',
        'Unlimited analytics',
        'Custom branding',
        'Priority support'
      ],
      color: 'yellow',
      popular: true
    },
    {
      name: 'Team',
      icon: <Users className="w-6 h-6" />,
      price: 3999,
      description: 'For organizations and teams',
      features: [
        'Everything in Pro',
        'Up to 500 participants',
        'Team collaboration',
        'API access',
        'Advanced dashboards',
        'Priority chat support'
      ],
      color: 'purple'
    },
    {
      name: 'Enterprise',
      icon: <Building2 className="w-6 h-6" />,
      price: 0,
      description: 'For large organizations with custom needs',
      features: [
        'Everything in Team',
        'Unlimited participants',
        'White-label solution',
        'SSO/SAML',
        'Dedicated manager',
        'Custom development'
      ],
      color: 'blue'
    }
  ];

  const features = [
    {
      category: 'Quiz Creation',
      items: [
        { name: 'AI Question Generation', free: true, pro: true, team: true, enterprise: true },
        { name: 'Manual Question Entry', free: true, pro: true, team: true, enterprise: true },
        { name: 'Quiz Templates', free: '5 templates', pro: 'All templates', team: 'All templates', enterprise: 'All templates' },
        { name: 'Question Bank', free: false, pro: true, team: true, enterprise: true },
        { name: 'Media Support (Images/Video)', free: false, pro: true, team: true, enterprise: true },
        { name: 'Advanced Question Types', free: false, pro: true, team: true, enterprise: true }
      ]
    },
    {
      category: 'Participants & Delivery',
      items: [
        { name: 'Max Participants per Quiz', free: '15', pro: '100', team: '500', enterprise: 'Unlimited' },
        { name: 'Real-time Quiz Mode', free: true, pro: true, team: true, enterprise: true },
        { name: 'Practice Mode', free: false, pro: true, team: true, enterprise: true },
        { name: 'Scheduled Quizzes', free: false, pro: true, team: true, enterprise: true },
        { name: 'Recurring Quizzes', free: false, pro: false, team: true, enterprise: true }
      ]
    },
    {
      category: 'Analytics & Reporting',
      items: [
        { name: 'Basic Analytics', free: '7 days', pro: 'Unlimited', team: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Student Progress Tracking', free: false, pro: true, team: true, enterprise: true },
        { name: 'Export Reports', free: false, pro: 'PDF, Excel', team: 'PDF, Excel', enterprise: 'All formats' },
        { name: 'Advanced Dashboards', free: false, pro: false, team: true, enterprise: true },
        { name: 'Custom Reports', free: false, pro: false, team: false, enterprise: true }
      ]
    },
    {
      category: 'Customization',
      items: [
        { name: 'Custom Branding', free: false, pro: true, team: true, enterprise: true },
        { name: 'Remove ArenaQuest Branding', free: false, pro: true, team: true, enterprise: true },
        { name: 'Custom Domain', free: false, pro: false, team: false, enterprise: true },
        { name: 'White-Label', free: false, pro: false, team: false, enterprise: true }
      ]
    },
    {
      category: 'Collaboration & Integration',
      items: [
        { name: 'Team Members', free: '1', pro: '1', team: '10', enterprise: 'Unlimited' },
        { name: 'Shared Quiz Library', free: false, pro: false, team: true, enterprise: true },
        { name: 'API Access', free: false, pro: false, team: true, enterprise: true },
        { name: 'LMS Integration', free: false, pro: false, team: true, enterprise: true },
        { name: 'Custom Integrations', free: false, pro: false, team: false, enterprise: true }
      ]
    },
    {
      category: 'Support',
      items: [
        { name: 'Email Support', free: 'Community', pro: 'Priority', team: 'Priority', enterprise: 'Dedicated' },
        { name: 'Response Time', free: '48 hours', pro: '24 hours', team: '12 hours', enterprise: '2 hours' },
        { name: 'Phone Support', free: false, pro: false, team: false, enterprise: true },
        { name: 'Account Manager', free: false, pro: false, team: false, enterprise: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-purple-50">
      <Header setScreen={setScreen} />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Professional Pricing Component */}
        <CreativePricing
          tag="Pricing Plans"
          title="Choose Your Perfect Plan"
          description="Start free and scale as you grow. All paid plans include a 14-day trial."
          tiers={pricingTiers}
        />

      {/* Feature Comparison Table */}
      <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
          📊 Detailed Feature Comparison
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-bold text-gray-900">Feature</th>
                <th className="text-center py-4 px-4 font-bold text-gray-600">Free</th>
                <th className="text-center py-4 px-4 font-bold text-yellow-600">Pro</th>
                <th className="text-center py-4 px-4 font-bold text-cyan-600">Team</th>
                <th className="text-center py-4 px-4 font-bold text-purple-600">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((category) => (
                <React.Fragment key={category.category}>
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="py-3 px-4 font-bold text-gray-900">
                      {category.category}
                    </td>
                  </tr>
                  {category.items.map((item) => (
                    <tr key={item.name} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-700">{item.name}</td>
                      <td className="py-3 px-4 text-center text-sm">
                        {typeof item.free === 'boolean' ? (
                          item.free ? <span className="text-green-500 text-xl">✓</span> : <span className="text-gray-300 text-xl">✗</span>
                        ) : (
                          <span className="text-gray-600">{item.free}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {typeof item.pro === 'boolean' ? (
                          item.pro ? <span className="text-green-500 text-xl">✓</span> : <span className="text-gray-300 text-xl">✗</span>
                        ) : (
                          <span className="text-gray-600">{item.pro}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {typeof item.team === 'boolean' ? (
                          item.team ? <span className="text-green-500 text-xl">✓</span> : <span className="text-gray-300 text-xl">✗</span>
                        ) : (
                          <span className="text-gray-600">{item.team}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {typeof item.enterprise === 'boolean' ? (
                          item.enterprise ? <span className="text-green-500 text-xl">✓</span> : <span className="text-gray-300 text-xl">✗</span>
                        ) : (
                          <span className="text-gray-600">{item.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
          ❓ Frequently Asked Questions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: 'Can I change plans later?',
              a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate the difference.'
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can pay via invoice.'
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial.'
            },
            {
              q: 'What happens after my trial ends?',
              a: 'You\'ll be automatically moved to the Free plan unless you choose to upgrade. Your data is always safe and accessible.'
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Absolutely! No contracts, no cancellation fees. Cancel anytime from your account settings.'
            },
            {
              q: 'Do you offer educational discounts?',
              a: 'Yes! We offer 25% discount for verified educational institutions and non-profits. Contact us for details.'
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-8 md:p-12 text-center shadow-xl border-4 border-black">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
          🚀 Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-800 mb-6 max-w-2xl mx-auto">
          Join thousands of educators and trainers using ArenaQuest to create engaging quizzes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={() => setScreen('home')}
            variant="default"
            size="lg"
          >
            Start Free Trial ✨
          </Button>
          <Button
            onClick={() => setScreen('home')}
            variant="outline"
            size="lg"
            className="bg-white hover:bg-gray-100 border-2 border-black"
          >
            Contact Sales 💬
          </Button>
        </div>
      </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PricingScreen;
