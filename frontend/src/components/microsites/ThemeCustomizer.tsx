import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateMicrosite } from '../../store/slices/micrositeSlice';
import { Microsite } from '../../store/slices/micrositeSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { 
  PaintBrushIcon,
  SwatchIcon,
  PhotoIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface ThemeCustomizerProps {
  microsite: Microsite;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ microsite }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('templates');

  const [themeSettings, setThemeSettings] = useState({
    template: microsite.theme?.template || 'modern',
    primaryColor: microsite.theme?.primaryColor || '#3B82F6',
    secondaryColor: microsite.theme?.secondaryColor || '#10B981',
    accentColor: microsite.theme?.accentColor || '#F59E0B',
    backgroundColor: microsite.theme?.backgroundColor || '#FFFFFF',
    textColor: microsite.theme?.textColor || '#1F2937',
    headingFont: microsite.theme?.headingFont || 'Inter',
    bodyFont: microsite.theme?.bodyFont || 'Inter',
    borderRadius: microsite.theme?.borderRadius || 'medium',
    spacing: microsite.theme?.spacing || 'medium',
    headerStyle: microsite.theme?.headerStyle || 'default',
    navigationStyle: microsite.theme?.navigationStyle || 'horizontal',
    footerStyle: microsite.theme?.footerStyle || 'simple',
  });

  const templates = [
    {
      key: 'modern',
      name: 'Moderno',
      description: 'Diseño limpio y minimalista con tipografía moderna',
      preview: '/themes/modern-preview.jpg'
    },
    {
      key: 'classic',
      name: 'Clásico',
      description: 'Estilo tradicional con elementos elegantes',
      preview: '/themes/classic-preview.jpg'
    },
    {
      key: 'sport',
      name: 'Deportivo',
      description: 'Diseño dinámico perfecto para clubes deportivos',
      preview: '/themes/sport-preview.jpg'
    },
    {
      key: 'elegant',
      name: 'Elegante',
      description: 'Sofisticado con toques de lujo y clase',
      preview: '/themes/elegant-preview.jpg'
    },
    {
      key: 'vibrant',
      name: 'Vibrante',
      description: 'Colores llamativos y diseño energético',
      preview: '/themes/vibrant-preview.jpg'
    },
    {
      key: 'minimal',
      name: 'Minimalista',
      description: 'Menos es más - foco en el contenido',
      preview: '/themes/minimal-preview.jpg'
    }
  ];

  const colorPresets = [
    { name: 'Azul Océano', primary: '#0EA5E9', secondary: '#06B6D4', accent: '#8B5CF6' },
    { name: 'Verde Naturaleza', primary: '#10B981', secondary: '#059669', accent: '#F59E0B' },
    { name: 'Rojo Energía', primary: '#EF4444', secondary: '#DC2626', accent: '#F97316' },
    { name: 'Morado Creatividad', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#EC4899' },
    { name: 'Naranja Vibrante', primary: '#F97316', secondary: '#EA580C', accent: '#EF4444' },
    { name: 'Gris Profesional', primary: '#6B7280', secondary: '#4B5563', accent: '#3B82F6' }
  ];

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Moderno)' },
    { value: 'Roboto', label: 'Roboto (Amigable)' },
    { value: 'Open Sans', label: 'Open Sans (Legible)' },
    { value: 'Lato', label: 'Lato (Elegante)' },
    { value: 'Montserrat', label: 'Montserrat (Impactante)' },
    { value: 'Poppins', label: 'Poppins (Moderno)' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro (Profesional)' },
    { value: 'Raleway', label: 'Raleway (Sofisticado)' }
  ];

  const borderRadiusOptions = [
    { value: 'none', label: 'Sin Bordes Redondeados' },
    { value: 'small', label: 'Pequeño (4px)' },
    { value: 'medium', label: 'Medio (8px)' },
    { value: 'large', label: 'Grande (12px)' },
    { value: 'xl', label: 'Extra Grande (16px)' }
  ];

  const spacingOptions = [
    { value: 'compact', label: 'Compacto' },
    { value: 'medium', label: 'Medio' },
    { value: 'spacious', label: 'Espacioso' }
  ];

  const headerStyleOptions = [
    { value: 'default', label: 'Estándar' },
    { value: 'centered', label: 'Centrado' },
    { value: 'sidebar', label: 'Barra Lateral' },
    { value: 'overlay', label: 'Superpuesto' }
  ];

  const navigationStyleOptions = [
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'vertical', label: 'Vertical' },
    { value: 'dropdown', label: 'Menú Desplegable' },
    { value: 'hamburger', label: 'Menú Hamburguesa' }
  ];

  const footerStyleOptions = [
    { value: 'simple', label: 'Simple' },
    { value: 'detailed', label: 'Detallado' },
    { value: 'minimal', label: 'Minimalista' }
  ];

  const sections = [
    {
      key: 'templates',
      label: 'Plantillas',
      icon: SwatchIcon,
    },
    {
      key: 'colors',
      label: 'Colores',
      icon: PaintBrushIcon,
    },
    {
      key: 'typography',
      label: 'Tipografía',
      icon: PhotoIcon,
    },
    {
      key: 'layout',
      label: 'Diseño',
      icon: AdjustmentsHorizontalIcon,
    },
  ];

  const handleThemeChange = (key: string, value: any) => {
    setThemeSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyColorPreset = (preset: any) => {
    setThemeSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await dispatch(updateMicrosite({
        id: microsite.id,
        updates: {
          theme: themeSettings
        }
      }));
    } catch (error) {
      console.error('Error updating theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTemplatesSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Elige una Plantilla
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.key}
              onClick={() => handleThemeChange('template', template.key)}
              className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                themeSettings.template === template.key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {themeSettings.template === template.key && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                <PhotoIcon className="w-8 h-8 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Vista Previa</span>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderColorsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Paleta de Colores
        </h3>
        
        {/* Color Presets */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Presets Rápidos</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyColorPreset(preset)}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="flex gap-1">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
                <span className="text-sm font-medium">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Primario
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={themeSettings.primaryColor}
                onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={themeSettings.primaryColor}
                onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Secundario
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={themeSettings.secondaryColor}
                onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={themeSettings.secondaryColor}
                onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                placeholder="#10B981"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Acento
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={themeSettings.accentColor}
                onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={themeSettings.accentColor}
                onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                placeholder="#F59E0B"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Fondo
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={themeSettings.backgroundColor}
                onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={themeSettings.backgroundColor}
                onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Texto
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={themeSettings.textColor}
                onChange={(e) => handleThemeChange('textColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={themeSettings.textColor}
                onChange={(e) => handleThemeChange('textColor', e.target.value)}
                placeholder="#1F2937"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTypographySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tipografía
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Fuente para Títulos"
            value={themeSettings.headingFont}
            onChange={(e) => handleThemeChange('headingFont', e.target.value)}
            options={fontOptions}
          />

          <Select
            label="Fuente para Texto"
            value={themeSettings.bodyFont}
            onChange={(e) => handleThemeChange('bodyFont', e.target.value)}
            options={fontOptions}
          />
        </div>

        {/* Typography Preview */}
        <div className="mt-6 p-6 border rounded-lg bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Vista Previa</h4>
          <div 
            style={{ 
              fontFamily: themeSettings.headingFont,
              color: themeSettings.textColor 
            }}
          >
            <h1 className="text-2xl font-bold mb-2">Título Principal</h1>
            <h2 className="text-xl font-semibold mb-2">Subtítulo</h2>
          </div>
          <div 
            style={{ 
              fontFamily: themeSettings.bodyFont,
              color: themeSettings.textColor 
            }}
            className="text-base"
          >
            <p>
              Este es un ejemplo de cómo se verá el texto del cuerpo con la fuente seleccionada. 
              Puedes ajustar las fuentes para títulos y texto por separado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayoutSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Configuración de Diseño
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Bordes Redondeados"
              value={themeSettings.borderRadius}
              onChange={(e) => handleThemeChange('borderRadius', e.target.value)}
              options={borderRadiusOptions}
            />

            <Select
              label="Espaciado"
              value={themeSettings.spacing}
              onChange={(e) => handleThemeChange('spacing', e.target.value)}
              options={spacingOptions}
            />

            <Select
              label="Estilo de Encabezado"
              value={themeSettings.headerStyle}
              onChange={(e) => handleThemeChange('headerStyle', e.target.value)}
              options={headerStyleOptions}
            />

            <Select
              label="Estilo de Navegación"
              value={themeSettings.navigationStyle}
              onChange={(e) => handleThemeChange('navigationStyle', e.target.value)}
              options={navigationStyleOptions}
            />

            <Select
              label="Estilo de Pie de Página"
              value={themeSettings.footerStyle}
              onChange={(e) => handleThemeChange('footerStyle', e.target.value)}
              options={footerStyleOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex">
      {/* Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Personalizar Tema
          </h2>
          
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === section.key
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <EyeIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Vista Previa</span>
            </div>
            <p className="text-xs text-blue-700">
              Los cambios se aplicarán automáticamente en la vista previa de tu micrositio.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === 'templates' && renderTemplatesSection()}
          {activeSection === 'colors' && renderColorsSection()}
          {activeSection === 'typography' && renderTypographySection()}
          {activeSection === 'layout' && renderLayoutSection()}
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                // Reset to original theme
                setThemeSettings({
                  template: microsite.theme?.template || 'modern',
                  primaryColor: microsite.theme?.primaryColor || '#3B82F6',
                  secondaryColor: microsite.theme?.secondaryColor || '#10B981',
                  accentColor: microsite.theme?.accentColor || '#F59E0B',
                  backgroundColor: microsite.theme?.backgroundColor || '#FFFFFF',
                  textColor: microsite.theme?.textColor || '#1F2937',
                  headingFont: microsite.theme?.headingFont || 'Inter',
                  bodyFont: microsite.theme?.bodyFont || 'Inter',
                  borderRadius: microsite.theme?.borderRadius || 'medium',
                  spacing: microsite.theme?.spacing || 'medium',
                  headerStyle: microsite.theme?.headerStyle || 'default',
                  navigationStyle: microsite.theme?.navigationStyle || 'horizontal',
                  footerStyle: microsite.theme?.footerStyle || 'simple',
                });
              }}
              disabled={isLoading}
            >
              Restablecer
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="min-w-32"
            >
              {isLoading ? 'Guardando...' : 'Guardar Tema'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;