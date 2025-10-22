import React from 'react';
import { Screen } from '../hooks/useQuiz';
import Button from '../components/Button';
import Card from '../components/Card';

interface PricingScreenProps {
  setScreen: (screen: Screen) => void;
}

const PricingScreen: React.FC<PricingScreenProps> = ({ setScreen }) => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: '🎯',
      description: 'Perfect for trying out ArenaQuest',
      features: [
        '5 quizzes per month',
        'Up to 15 participants',
        'Basic AI question generation',
        '7-day analytics history',
        'Standard support',
        'Community features'
      ],
      limitations: [
        'No custom branding',
        'Limited quiz templates',
        'No API access'
      ],
      color: 'gray',
      popular: false,
      cta: 'Get Started Free'
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      icon: '⚡',
      description: 'For serious educators and trainers',
      features: [
        'Unlimited quizzes',
        'Up to 100 participants',
        'Advanced AI features',
        'Unlimited analytics',
        'Custom branding',
        'Priority email support',
        'Quiz templates library',
        'Export reports (PDF, Excel)',
        'Remove ArenaQuest branding',
        'Advanced question types'
      ],
      limitations: [],
      color: 'yellow',
      popular: true,
      cta: 'Start 14-Day Trial',
      badge: '🔥 Most Popular'
    },
    {
      name: 'Team',
      price: '$49',
      period: 'per month',
      icon: '👥',
      description: 'For organizations and teams',
      features: [
        'Everything in Pro, plus:',
        'Up to 500 participants',
        'Team collaboration tools',
        'Shared quiz library',
        'Role-based permissions',
        'Advanced analytics dashboard',
        'API access',
        'Webhook integrations',
        'Priority chat support',
        'Custom integrations',
        'Bulk operations'
      ],
      limitations: [],
      color: 'cyan',
      popular: false,
      cta: 'Start 14-Day Trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      icon: '🏢',
      description: 'For large organizations',
      features: [
        'Everything in Team, plus:',
        'Unlimited participants',
        'White-label solution',
        'Custom domain',
        'SSO/SAML authentication',
        'Dedicated account manager',
        '99.9% SLA guarantee',
        'Custom development',
        'On-premise deployment option',
        'Advanced security features',
        'Compliance support',
        'Training & onboarding'
      ],
      limitations: [],
      color: 'purple',
      popular: false,
      cta: 'Contact Sales'
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
    <div className="w-full max-w-7xl animate-fade-in-up space-y-8 px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-5xl">💳</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
          ✨ Simple, Transparent Pricing
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Choose the perfect plan for your needs. All plans include a 14-day free trial. 🚀
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            ✅ No credit card required
          </span>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            💰 Money-back guarantee
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
            🔄 Cancel anytime
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => {
          const colorClasses = {
            gray: 'border-gray-300 hover:border-gray-400',
            yellow: 'border-yellow-400 hover:border-yellow-500 ring-4 ring-yellow-100',
            cyan: 'border-cyan-300 hover:border-cyan-400',
            purple: 'border-purple-300 hover:border-purple-400'
          };

          return (
            <div
              key={plan.name}
              className={`relative bg-white border-2 ${colorClasses[plan.color]} rounded-3xl p-6 transition-all hover:shadow-xl ${
                plan.popular ? 'transform scale-105' : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  {plan.badge}
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{plan.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                  {plan.period !== 'contact us' && (
                    <span className="text-sm text-gray-600 ml-1">/ {plan.period}</span>
                  )}
                </div>
                <Button
                  onClick={() => setScreen('home')}
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>

              <div className="space-y-3 mb-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 text-lg flex-shrink-0">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="border-t pt-4 space-y-2">
                  {plan.limitations.map((limitation, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-gray-400 text-lg flex-shrink-0">✗</span>
                      <span className="text-sm text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

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
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-8 md:p-12 text-center shadow-xl">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
          🚀 Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-800 mb-6 max-w-2xl mx-auto">
          Join thousands of educators and trainers using ArenaQuest to create engaging quizzes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={() => setScreen('home')}
            variant="secondary"
            size="lg"
          >
            Start Free Trial ✨
          </Button>
          <Button
            onClick={() => setScreen('home')}
            variant="outline"
            size="lg"
            className="bg-white hover:bg-gray-100"
          >
            Contact Sales 💬
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingScreen;
