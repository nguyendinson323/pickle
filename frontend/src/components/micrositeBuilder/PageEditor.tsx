import React, { useState, useCallback } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { toast } from 'react-hot-toast';
import ComponentEditor from './ComponentEditor';
import ComponentLibrary from './ComponentLibrary';

interface MicrositePage {
  id: string;
  name: string;
  slug: string;
  title: string;
  metaDescription: string;
  components: MicrositeComponent[];
  isPublished: boolean;
  sortOrder: number;
}

interface MicrositeComponent {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'contact_form' | 'event_list' | 'member_showcase' | 'stats' | 'testimonials' | 'map';
  position: number;
  settings: Record<string, any>;
  content: Record<string, any>;
  styling: {
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    shadow?: boolean;
  };
}

interface PageEditorProps {
  micrositeId: number;
  page: MicrositePage;
  onPageUpdate: (pageId: string, updates: Partial<MicrositePage>) => void;
}

const PageEditor: React.FC<PageEditorProps> = ({
  micrositeId,
  page,
  onPageUpdate
}) => {
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handlePageSettingsUpdate = (field: string, value: any) => {
    onPageUpdate(page.id, { [field]: value });
  };

  const generateComponentId = () => {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddComponent = (componentType: string) => {
    const newComponent: MicrositeComponent = {
      id: generateComponentId(),
      type: componentType as any,
      position: page.components.length,
      settings: {},
      content: getDefaultContent(componentType),
      styling: {
        margin: '0',
        padding: '20px',
        backgroundColor: 'transparent',
        textColor: '#1e293b'
      }
    };

    const updatedComponents = [...page.components, newComponent];
    onPageUpdate(page.id, { components: updatedComponents });
    setSelectedComponentId(newComponent.id);
    setShowComponentLibrary(false);
    toast.success('Componente agregado');
  };

  const handleComponentUpdate = (componentId: string, updates: Partial<MicrositeComponent>) => {
    const updatedComponents = page.components.map(comp =>
      comp.id === componentId ? { ...comp, ...updates } : comp
    );
    onPageUpdate(page.id, { components: updatedComponents });
  };

  const handleComponentDelete = (componentId: string) => {
    const updatedComponents = page.components.filter(comp => comp.id !== componentId);
    // Update positions
    const reorderedComponents = updatedComponents.map((comp, index) => ({
      ...comp,
      position: index
    }));
    
    onPageUpdate(page.id, { components: reorderedComponents });
    
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
    
    toast.success('Componente eliminado');
  };

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(page.components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedComponents = items.map((comp, index) => ({
      ...comp,
      position: index
    }));

    onPageUpdate(page.id, { components: updatedComponents });
  }, [page.components, onPageUpdate]);

  const moveComponent = (componentId: string, direction: 'up' | 'down') => {
    const currentIndex = page.components.findIndex(comp => comp.id === componentId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= page.components.length) return;

    const items = [...page.components];
    [items[currentIndex], items[newIndex]] = [items[newIndex], items[currentIndex]];

    const updatedComponents = items.map((comp, index) => ({
      ...comp,
      position: index
    }));

    onPageUpdate(page.id, { components: updatedComponents });
  };

  const getDefaultContent = (componentType: string): Record<string, any> => {
    const defaults: Record<string, any> = {
      hero: {
        title: 'Título Principal',
        subtitle: 'Subtítulo descriptivo',
        backgroundImage: '',
        buttonText: 'Llamada a la acción',
        buttonLink: '#'
      },
      text: {
        content: '<p>Agrega tu contenido de texto aquí. Puedes usar <strong>formato</strong> y <em>estilos</em>.</p>',
        textAlign: 'left'
      },
      image: {
        src: '',
        alt: 'Descripción de la imagen',
        caption: '',
        link: ''
      },
      gallery: {
        images: [],
        columns: 3,
        showCaptions: true
      },
      contact_form: {
        title: 'Contáctanos',
        fields: ['name', 'email', 'message'],
        submitText: 'Enviar',
        successMessage: 'Mensaje enviado correctamente'
      },
      event_list: {
        title: 'Próximos Eventos',
        events: []
      },
      member_showcase: {
        title: 'Nuestro Equipo',
        members: []
      },
      stats: {
        title: 'Estadísticas',
        stats: []
      },
      testimonials: {
        title: 'Testimonios',
        testimonials: []
      },
      map: {
        address: '',
        coordinates: null,
        zoom: 15
      }
    };

    return defaults[componentType] || {};
  };

  const getComponentTypeName = (type: string): string => {
    const names: Record<string, string> = {
      hero: 'Hero/Banner',
      text: 'Texto',
      image: 'Imagen',
      gallery: 'Galería',
      contact_form: 'Formulario de Contacto',
      event_list: 'Lista de Eventos',
      member_showcase: 'Miembros',
      stats: 'Estadísticas',
      testimonials: 'Testimonios',
      map: 'Mapa'
    };
    
    return names[type] || type;
  };

  const renderComponentPreview = (component: MicrositeComponent) => {
    // This would render a preview of each component type
    // For now, we'll show a simple placeholder
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[100px] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-1">
            {getComponentTypeName(component.type)}
          </div>
          <div className="text-sm text-gray-500">
            Haz clic para editar
          </div>
        </div>
      </div>
    );
  };

  if (previewMode) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Vista Previa: {page.name}
            </h3>
            <button
              onClick={() => setPreviewMode(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              <EyeSlashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {page.components.map((component) => (
              <div key={component.id}>
                {renderComponentPreview(component)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg h-full flex flex-col">
      {/* Page Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Editando: {page.name}
            </h3>
            <p className="text-sm text-gray-600">
              /{page.slug}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreviewMode(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              Vista Previa
            </button>
            
            <button
              onClick={() => setShowComponentLibrary(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Agregar Componente
            </button>
          </div>
        </div>

        {/* Page Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la página
            </label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => handlePageSettingsUpdate('title', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta descripción
            </label>
            <input
              type="text"
              value={page.metaDescription}
              onChange={(e) => handlePageSettingsUpdate('metaDescription', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="Descripción para SEO"
            />
          </div>
        </div>

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="isPublished"
            checked={page.isPublished}
            onChange={(e) => handlePageSettingsUpdate('isPublished', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
            Página publicada (visible en el sitio web)
          </label>
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto">
        {page.components.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <PlusIcon className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay componentes
              </h3>
              <p className="text-gray-600 mb-4">
                Agrega componentes para comenzar a construir tu página.
              </p>
              <button
                onClick={() => setShowComponentLibrary(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Agregar Primer Componente
              </button>
            </div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="components">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-6 space-y-4"
                >
                  {page.components
                    .sort((a, b) => a.position - b.position)
                    .map((component, index) => (
                    <Draggable
                      key={component.id}
                      draggableId={component.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border rounded-lg ${
                            selectedComponentId === component.id
                              ? 'border-blue-500 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                        >
                          {/* Component Header */}
                          <div
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 cursor-move"
                          >
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {getComponentTypeName(component.type)}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => moveComponent(component.id, 'up')}
                                disabled={index === 0}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-25"
                              >
                                <ArrowUpIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => moveComponent(component.id, 'down')}
                                disabled={index === page.components.length - 1}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-25"
                              >
                                <ArrowDownIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleComponentDelete(component.id)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Component Content */}
                          <div
                            onClick={() => setSelectedComponentId(
                              selectedComponentId === component.id ? null : component.id
                            )}
                            className="p-4 cursor-pointer"
                          >
                            {selectedComponentId === component.id ? (
                              <ComponentEditor
                                component={component}
                                onUpdate={(updates) => handleComponentUpdate(component.id, updates)}
                              />
                            ) : (
                              renderComponentPreview(component)
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Component Library Modal */}
      {showComponentLibrary && (
        <ComponentLibrary
          onComponentSelect={handleAddComponent}
          onClose={() => setShowComponentLibrary(false)}
        />
      )}
    </div>
  );
};

export default PageEditor;