import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  BoltIcon, 
  UsersIcon, 
  AcademicCapIcon,
  TrophyIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/common/Layout';

const LearnMorePage: React.FC = () => {
  const benefits = [
    {
      icon: HeartIcon,
      title: 'Complete Exercise',
      description: 'Improves cardiovascular endurance, strength and coordination'
    },
    {
      icon: BoltIcon,
      title: 'Mental Agility',
      description: 'Develops reflexes and quick decision making'
    },
    {
      icon: UsersIcon,
      title: 'Community',
      description: 'Meet people and be part of an active community'
    },
    {
      icon: AcademicCapIcon,
      title: 'Fun',
      description: 'It\'s addictive and exciting from the first game'
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Find a Court',
      description: 'Look for courts near you on our platform',
      icon: MapPinIcon
    },
    {
      step: 2,
      title: 'Get Basic Equipment',
      description: 'Paddle, balls and comfortable sportswear',
      icon: TrophyIcon
    },
    {
      step: 3,
      title: 'Take a Class',
      description: 'Connect with certified instructors',
      icon: AcademicCapIcon
    },
    {
      step: 4,
      title: 'Join Tournaments',
      description: 'Participate in local and national events',
      icon: TrophyIcon
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn More About Pickleball
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Discover everything you need to know about this exciting sport that's revolutionizing Mexico
            </p>
          </div>
        </div>
      </div>

      {/* What is Pickleball Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What is Pickleball?
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Pickleball is a racquet sport that combines elements of tennis, badminton, and ping-pong. 
                It's played on a smaller court than tennis, with a lower net and plastic balls with holes.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                The sport that's revolutionizing Mexico and becoming the fastest-growing sport worldwide.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl mb-4">🎾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy to Learn</h3>
              <p className="text-gray-600">Simple rules that you can start playing in minutes</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For All Ages</h3>
              <p className="text-gray-600">From children to seniors can enjoy it</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Low Impact</h3>
              <p className="text-gray-600">Gentler on joints than other racquet sports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benefits of Pickleball
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover why millions of people around the world are falling in love with this sport
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center group">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
                    <benefit.icon className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Start Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to Start Playing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to begin your pickleball journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {step.step}
                  </div>
                </div>
                <step.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rules Section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Basic Rules
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple and easy to understand rules that make the game accessible to everyone
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Court & Equipment</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Court: 20' x 44' (smaller than tennis)</li>
                  <li>• Net height: 36" at ends, 34" in center</li>
                  <li>• Paddles: Solid, no strings</li>
                  <li>• Ball: Plastic with holes (like wiffle ball)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Play</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Serve underhand, diagonal cross-court</li>
                  <li>• Ball must bounce once on each side</li>
                  <li>• No volleys in 7-foot "kitchen" zone</li>
                  <li>• Games to 11, win by 2</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Playing?
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            Join the largest pickleball community in Mexico and start enjoying all the benefits 
            of being part of the official admin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Register for Free
            </Link>
            <Link
              to="/tournaments"
              className="btn-ghost border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg"
            >
              Find Tournaments
            </Link>
          </div>
        </div>
      </div>

      {/* Mexican Pickleball Federation Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mexican Pickleball Federation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We are the official organization that regulates and promotes pickleball throughout Mexico, 
              connecting players, coaches, clubs, and organizers nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">2,500+</div>
              <p className="text-gray-600">Registered Players</p>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">150+</div>
              <p className="text-gray-600">Tournaments Organized</p>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">32</div>
              <p className="text-gray-600">Participating States</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearnMorePage;