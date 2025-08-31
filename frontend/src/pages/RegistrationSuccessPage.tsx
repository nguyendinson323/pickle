import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import { UserRole } from '@/types/auth';

const RegistrationSuccessPage: React.FC = () => {
  const user = useAppSelector(selectUser);

  const getRoleTitle = (role: UserRole): string => {
    switch (role) {
      case 'player': return 'Player';
      case 'coach': return 'Coach';
      case 'club': return 'Club';
      case 'partner': return 'Commercial Partner';
      case 'state': return 'State Committee';
      case 'federation': return 'Federation';
      default: return 'User';
    }
  };

  const getNextSteps = (role: UserRole) => {
    switch (role) {
      case 'player':
        return [
          'Complete your profile with additional information',
          'Search for tournaments in your area',
          'Connect with other players',
          'Update your NRTP level if necessary'
        ];
      case 'coach':
        return [
          'Verify your coach certification',
          'Set up your training services',
          'Look for clinic opportunities',
          'Join the coaches network'
        ];
      case 'club':
        return [
          'Complete your club information',
          'Add photos of your facilities',
          'Set up your memberships',
          'Schedule your first events'
        ];
      case 'partner':
        return [
          'Review sponsorship opportunities',
          'Set up your commercial profile',
          'Explore partner benefits',
          'Contact the commercial team'
        ];
      case 'state':
        return [
          'Coordinate with the national federation',
          'Register clubs in your state',
          'Plan state events',
          'Establish contact with other committees'
        ];
      case 'federation':
        return [
          'Manage the national platform',
          'Supervise state committees',
          'Administer national tournaments',
          'Coordinate with international organizations'
        ];
      default:
        return ['Complete your profile', 'Explore the features'];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Welcome to the Mexican Pickleball Federation
          </p>
          
          {user && (
            <p className="text-lg text-gray-500">
              You have registered as <strong>{getRoleTitle(user.role)}</strong>
            </p>
          )}
        </div>

        {/* Account Details */}
        {user && (
          <div className="bg-white rounded-xl shadow-card p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Account Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Username</p>
                <p className="font-medium text-gray-900">{user.username}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Account Type</p>
                <p className="font-medium text-gray-900">{getRoleTitle(user.role)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Account Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Next Steps
          </h2>
          
          <div className="space-y-4">
            {user && getNextSteps(user.role).map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Important Information
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Your account has been created and is active immediately</li>
                <li>• You will receive a confirmation email shortly</li>
                <li>• You can update your profile at any time</li>
                <li>• For questions or support, contact the federation team</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="btn-primary px-8 py-3 text-center"
          >
            Go to Dashboard
          </Link>
          
          <Link
            to="/profile"
            className="btn-secondary px-8 py-3 text-center"
          >
            Complete Profile
          </Link>
          
          <Link
            to="/"
            className="btn-outline px-8 py-3 text-center"
          >
            Back to Home
          </Link>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 mb-4">
            Need help or have any questions?
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="mailto:soporte@pickleballmexico.org"
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Support Email
            </a>
            
            <a
              href="tel:+525512345678"
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Help Phone
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;