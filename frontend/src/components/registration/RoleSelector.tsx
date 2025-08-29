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
    title: 'Jugador',
    description: 'Registrate como jugador individual para participar en torneos y conectar con otros jugadores',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    features: ['Participación en torneos', 'Credencial digital', 'Perfil personalizado']
  },
  {
    type: 'coach' as UserRole,
    title: 'Entrenador',
    description: 'Registrate como entrenador certificado para ofrecer servicios de entrenamiento',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 21V5a2 2 0 012-2h6a2 2 0 012 2v16M9 7h6m-6 4h6m-6 4h3" />
      </svg>
    ),
    features: ['Certificaciones oficiales', 'Gestión de estudiantes', 'Credencial de entrenador']
  },
  {
    type: 'club' as UserRole,
    title: 'Club',
    description: 'Registra tu club para gestionar miembros, canchas y organizar torneos',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
    features: ['Gestión de miembros', 'Organización de torneos', 'Micrositio del club']
  },
  {
    type: 'partner' as UserRole,
    title: 'Socio/Empresa',
    description: 'Registrate como socio comercial para ofrecer servicios y canchas',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 21V5a2 2 0 012-2h6a2 2 0 012 2v16" />
      </svg>
    ),
    features: ['Gestión de canchas', 'Servicios comerciales', 'Promoción empresarial']
  },
  {
    type: 'state' as UserRole,
    title: 'Comité Estatal',
    description: 'Registra un comité estatal para administrar la federación a nivel estatal',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    features: ['Administración estatal', 'Supervisión de clubes', 'Organización de eventos']
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
          Selecciona tu Tipo de Cuenta
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Elige el tipo de cuenta que mejor se adapte a ti. Cada tipo de cuenta tiene características específicas diseñadas para tus necesidades.
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

      {selectedRole && (
        <div className="mt-8 text-center">
          <button
            type="button"
            className="btn-primary px-8 py-3 text-lg"
            onClick={() => {
              // This will be handled by parent component
              const event = new CustomEvent('continueRegistration', { detail: selectedRole });
              window.dispatchEvent(event);
            }}
          >
            Continuar con {roles.find(r => r.type === selectedRole)?.title}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;