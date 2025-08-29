import React from 'react';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  content?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, content }) => {
  const user = useAppSelector(selectUser);

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-medium text-sm">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            type="button"
            className="lg:hidden p-1 text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {content || (
            <div className="space-y-4">
              {/* Quick Stats */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Estado de Cuenta
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Membresía</span>
                    <span className="text-green-600 font-medium">Activa</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Renovación</span>
                    <span className="text-gray-900">31 Dic 2025</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Acciones Rápidas
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                    Actualizar Perfil
                  </button>
                  <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                    Ver Mensajes
                  </button>
                  <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                    Descargar Credencial
                  </button>
                </div>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Soporte
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                    Centro de Ayuda
                  </button>
                  <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                    Contactar Soporte
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Federación Mexicana de Pickleball
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;