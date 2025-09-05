import React from 'react';
import { UserRole } from '@/types/registration';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  className?: string;
}

const roles = [
  {
    type: 'player' as UserRole,
    title: 'Player',
    description: 'Register as an individual player to participate in tournaments and connect with other players',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    features: ['Tournament participation', 'Digital credential', 'Personalized profile']
  },
  {
    type: 'coach' as UserRole,
    title: 'Coach',
    description: 'Register as a certified coach to offer training services',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 21V5a2 2 0 012-2h6a2 2 0 012 2v16M9 7h6m-6 4h6m-6 4h3" />
      </svg>
    ),
    features: ['Official certifications', 'Student management', 'Coach credential']
  },
  {
    type: 'club' as UserRole,
    title: 'Club',
    description: 'Register your club to manage members, courts and organize tournaments',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
    features: ['Member management', 'Tournament organization', 'Club microsite']
  },
  {
    type: 'partner' as UserRole,
    title: 'Partner/Company',
    description: 'Register as a business partner to offer services and courts',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 21V5a2 2 0 012-2h6a2 2 0 012 2v16" />
      </svg>
    ),
    features: ['Court management', 'Commercial services', 'Business promotion']
  },
  {
    type: 'state' as UserRole,
    title: 'State Committee',
    description: 'Register a state committee to administer the admin at state level',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    features: ['State administration', 'Club supervision', 'Event organization']
  }
];

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleSelect,
  className = ''
}) => {
  return (
    <div className={`role-selector ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Select Your Account Type
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the account type that best suits you. Each account type has specific features designed for your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {roles.map((role) => (
          <div
            key={role.type}
            onClick={() => onRoleSelect(role.type)}
            className={`
              relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
              hover:shadow-card-hover hover:-translate-y-1 group
              ${selectedRole === role.type
                ? 'border-primary-500 bg-primary-50 shadow-card-hover'
                : 'border-gray-200 bg-white hover:border-primary-300'
              }
            `}
          >
            {selectedRole === role.type && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}

            <div className={`
              text-primary-600 mb-4 transition-colors duration-200
              ${selectedRole === role.type ? 'text-primary-700' : 'group-hover:text-primary-600'}
            `}>
              {role.icon}
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {role.title}
            </h3>

            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {role.description}
            </p>

            <ul className="space-y-2">
              {role.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
};

export default RoleSelector;