import React, { useState } from 'react';
import { 
  XMarkIcon,
  MegaphoneIcon,
  DocumentTextIcon,
  PhotoIcon,
  RectangleGroupIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  UsersIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface ComponentLibraryProps {
  onComponentSelect: (componentType: string) => void;
  onClose: () => void;
}

interface ComponentType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'content' | 'media' | 'interactive' | 'business';
  isPremium?: boolean;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onComponentSelect,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const componentTypes: ComponentType[] = [
    // Content Components
    {
      id: 'hero',
      name: 'Hero/Banner',
      description: 'Sección principal con imagen de fondo, título y llamada a la acción',
      icon: MegaphoneIcon,
      category: 'content'
    },
    {
      id: 'text',
      name: 'Texto',
      description: 'Bloque de texto con formato rico (negritas, cursivas, listas)',
      icon: DocumentTextIcon,
      category: 'content'
    },

    // Media Components
    {
      id: 'image',
      name: 'Imagen',
      description: 'Imagen individual con opciones de alineación y enlaces',
      icon: PhotoIcon,
      category: 'media'
    },
    {
      id: 'gallery',
      name: 'Galería',
      description: 'Galería de imágenes con disposición en cuadrícula',
      icon: RectangleGroupIcon,
      category: 'media'
    },

    // Interactive Components
    {
      id: 'contact_form',
      name: 'Formulario de Contacto',
      description: 'Formulario personalizable para recibir mensajes de visitantes',
      icon: EnvelopeIcon,
      category: 'interactive'
    },
    {
      id: 'map',
      name: 'Mapa',
      description: 'Mapa interactivo con marcador de ubicación',
      icon: MapPinIcon,
      category: 'interactive'
    },

    // Business Components
    {
      id: 'event_list',
      name: 'Lista de Eventos',
      description: 'Muestra próximos eventos y torneos',
      icon: CalendarDaysIcon,
      category: 'business',
      isPremium: true
    },
    {
      id: 'member_showcase',
      name: 'Directorio de Miembros',
      description: 'Galería de miembros del club con información de contacto',
      icon: UsersIcon,
      category: 'business',
      isPremium: true
    },
    {
      id: 'stats',
      name: 'Estadísticas',
      description: 'Muestra números importantes con contadores animados',
      icon: ChartBarIcon,
      category: 'business'
    },
    {
      id: 'testimonials',
      name: 'Testimonios',
      description: 'Reseñas y testimonios de miembros o visitantes',
      icon: ChatBubbleOvalLeftEllipsisIcon,
      category: 'business'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', count: componentTypes.length },
    { id: 'content', name: 'Contenido', count: componentTypes.filter(c => c.category === 'content').length },
    { id: 'media', name: 'Media', count: componentTypes.filter(c => c.category === 'media').length },
    { id: 'interactive', name: 'Interactivo', count: componentTypes.filter(c => c.category === 'interactive').length },
    { id: 'business', name: 'Negocio', count: componentTypes.filter(c => c.category === 'business').length }
  ];

  const filteredComponents = selectedCategory === 'all' 
    ? componentTypes 
    : componentTypes.filter(comp => comp.category === selectedCategory);

  const handleComponentSelect = (componentType: ComponentType) => {
    if (componentType.isPremium) {
      // Here you would check if user has premium subscription
      alert('Este componente requiere una suscripción premium');
      return;
    }
    
    onComponentSelect(componentType.id);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Biblioteca de Componentes
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Selecciona un componente para agregar a tu página
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex h-[calc(90vh-140px)]">
            {/* Categories Sidebar */}
            <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Components Grid */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComponents.map((component) => {
                  const Icon = component.icon;
                  return (
                    <div
                      key={component.id}
                      onClick={() => handleComponentSelect(component)}
                      className={`relative p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200 ${
                        component.isPremium ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {/* Premium Badge */}
                      {component.isPremium && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            Premium
                          </span>
                        </div>
                      )}

                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                        component.isPremium 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {component.name}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {component.description}
                        </p>
                      </div>

                      {/* Category Tag */}
                      <div className="mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {component.category === 'content' && 'Contenido'}
                          {component.category === 'media' && 'Media'}
                          {component.category === 'interactive' && 'Interactivo'}
                          {component.category === 'business' && 'Negocio'}
                        </span>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 border-2 border-transparent rounded-lg transition-colors hover:border-blue-300"></div>
                    </div>
                  );
                })}
              </div>

              {filteredComponents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No se encontraron componentes en esta categoría.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {filteredComponents.length} componente{filteredComponents.length !== 1 ? 's' : ''} disponible{filteredComponents.length !== 1 ? 's' : ''}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;