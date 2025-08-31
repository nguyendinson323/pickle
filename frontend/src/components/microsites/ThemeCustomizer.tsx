import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateMicrosite } from '../../store/micrositeSlice';
import { Microsite } from '../../store/micrositeSlice';
import Button from '../ui/Button';
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
    template: microsite.settings?.theme?.template || 'modern',
    primaryColor: microsite.settings?.theme?.primaryColor || '#3B82F6',
    secondaryColor: microsite.settings?.theme?.secondaryColor || '#10B981',
    accentColor: microsite.settings?.theme?.accentColor || '#F59E0B',
    backgroundColor: microsite.settings?.theme?.backgroundColor || '#FFFFFF',
    textColor: microsite.settings?.theme?.textColor || '#1F2937',
    headingFont: microsite.settings?.theme?.headingFont || 'Inter',
    bodyFont: microsite.settings?.theme?.bodyFont || 'Inter',
    borderRadius: microsite.settings?.theme?.borderRadius || 'medium',
    spacing: microsite.settings?.theme?.spacing || 'medium',
    headerStyle: microsite.settings?.theme?.headerStyle || 'default',
    navigationStyle: microsite.settings?.theme?.navigationStyle || 'horizontal',
    footerStyle: microsite.settings?.theme?.footerStyle || 'simple',
  });

  const templates = [
    {
      key: 'modern',
      name: 'Modern',
      description: 'Clean and minimalist design with modern typography',
      preview: '/themes/modern-preview.jpg'
    },
    {
      key: 'classic',
      name: 'Classic',
      description: 'Traditional style with elegant elements',
      preview: '/themes/classic-preview.jpg'
    },
    {
      key: 'sport',
      name: 'Sport',
      description: 'Dynamic design perfect for sports clubs',
      preview: '/themes/sport-preview.jpg'
    },
    {
      key: 'elegant',
      name: 'Elegant',
      description: 'Sophisticated with touches of luxury and class',
      preview: '/themes/elegant-preview.jpg'
    },
    {
      key: 'vibrant',
      name: 'Vibrant',
      description: 'Eye-catching colors and energetic design',
      preview: '/themes/vibrant-preview.jpg'
    },
    {
      key: 'minimal',
      name: 'Minimalist',
      description: 'Less is more - focus on content',
      preview: '/themes/minimal-preview.jpg'
    }
  ];

  const colorPresets = [
    { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#06B6D4', accent: '#8B5CF6' },
    { name: 'Nature Green', primary: '#10B981', secondary: '#059669', accent: '#F59E0B' },
    { name: 'Energy Red', primary: '#EF4444', secondary: '#DC2626', accent: '#F97316' },
    { name: 'Creative Purple', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#EC4899' },
    { name: 'Vibrant Orange', primary: '#F97316', secondary: '#EA580C', accent: '#EF4444' },
    { name: 'Professional Gray', primary: '#6B7280', secondary: '#4B5563', accent: '#3B82F6' }
  ];

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Roboto', label: 'Roboto (Friendly)' },
    { value: 'Open Sans', label: 'Open Sans (Readable)' },
    { value: 'Lato', label: 'Lato (Elegant)' },
    { value: 'Montserrat', label: 'Montserrat (Striking)' },
    { value: 'Poppins', label: 'Poppins (Modern)' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro (Professional)' },
    { value: 'Raleway', label: 'Raleway (Sophisticated)' }
  ];

  const borderRadiusOptions = [
    { value: 'none', label: 'No Rounded Borders' },
    { value: 'small', label: 'Small (4px)' },
    { value: 'medium', label: 'Medium (8px)' },
    { value: 'large', label: 'Large (12px)' },
    { value: 'xl', label: 'Extra Large (16px)' }
  ];

  const spacingOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'medium', label: 'Medium' },
    { value: 'spacious', label: 'Spacious' }
  ];

  const headerStyleOptions = [
    { value: 'default', label: 'Standard' },
    { value: 'centered', label: 'Centered' },
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'overlay', label: 'Overlay' }
  ];

  const navigationStyleOptions = [
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'vertical', label: 'Vertical' },
    { value: 'dropdown', label: 'Dropdown Menu' },
    { value: 'hamburger', label: 'Hamburger Menu' }
  ];

  const footerStyleOptions = [
    { value: 'simple', label: 'Simple' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'minimal', label: 'Minimalist' }
  ];

  const sections = [
    {
      key: 'templates',
      label: 'Templates',
      icon: SwatchIcon,
    },
    {
      key: 'colors',
      label: 'Colors',
      icon: PaintBrushIcon,
    },
    {
      key: 'typography',
      label: 'Typography',
      icon: PhotoIcon,
    },
    {
      key: 'layout',
      label: 'Layout',
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
        data: {
          settings: {
            ...microsite.settings,
            theme: themeSettings
          }
        }
      })).unwrap();
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
          Choose a Template
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
                <span className="ml-2 text-sm text-gray-500">Preview</span>
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
          Color Palette
        </h3>
        
        {/* Color Presets */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Presets</h4>
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
              Primary Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={themeSettings.primaryColor}
                onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={themeSettings.primaryColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleThemeChange('primaryColor', e.target.value)}
                placeholder="#3B82F6"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={themeSettings.secondaryColor}
                onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={themeSettings.secondaryColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleThemeChange('secondaryColor', e.target.value)}
                placeholder="#10B981"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={themeSettings.accentColor}
                onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={themeSettings.accentColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleThemeChange('accentColor', e.target.value)}
                placeholder="#F59E0B"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={themeSettings.backgroundColor}
                onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={themeSettings.backgroundColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleThemeChange('backgroundColor', e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={themeSettings.textColor}
                onChange={(e) => handleThemeChange('textColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={themeSettings.textColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleThemeChange('textColor', e.target.value)}
                placeholder="#1F2937"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
          Typography
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heading Font
            </label>
            <select
              value={themeSettings.headingFont}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleThemeChange('headingFont', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {fontOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Font
            </label>
            <select
              value={themeSettings.bodyFont}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleThemeChange('bodyFont', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {fontOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Typography Preview */}
        <div className="mt-6 p-6 border rounded-lg bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Preview</h4>
          <div 
            style={{ 
              fontFamily: themeSettings.headingFont,
              color: themeSettings.textColor 
            }}
          >
            <h1 className="text-2xl font-bold mb-2">Main Title</h1>
            <h2 className="text-xl font-semibold mb-2">Subtitle</h2>
          </div>
          <div 
            style={{ 
              fontFamily: themeSettings.bodyFont,
              color: themeSettings.textColor 
            }}
            className="text-base"
          >
            <p>
              This is an example of how the body text will look with the selected font. 
              You can adjust fonts for headings and text separately.
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
          Layout Configuration
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Radius
              </label>
              <select
                value={themeSettings.borderRadius}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleThemeChange('borderRadius', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {borderRadiusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spacing
              </label>
              <select
                value={themeSettings.spacing}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleThemeChange('spacing', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {spacingOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Style
              </label>
              <select
                value={themeSettings.headerStyle}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleThemeChange('headerStyle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {headerStyleOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Navigation Style
              </label>
              <select
                value={themeSettings.navigationStyle}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleThemeChange('navigationStyle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {navigationStyleOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Style
              </label>
              <select
                value={themeSettings.footerStyle}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleThemeChange('footerStyle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {footerStyleOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
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
            Customize Theme
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
              <span className="text-sm font-medium text-blue-900">Preview</span>
            </div>
            <p className="text-xs text-blue-700">
              Changes will be automatically applied to your microsite preview.
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
                  template: microsite.settings?.theme?.template || 'modern',
                  primaryColor: microsite.settings?.theme?.primaryColor || '#3B82F6',
                  secondaryColor: microsite.settings?.theme?.secondaryColor || '#10B981',
                  accentColor: microsite.settings?.theme?.accentColor || '#F59E0B',
                  backgroundColor: microsite.settings?.theme?.backgroundColor || '#FFFFFF',
                  textColor: microsite.settings?.theme?.textColor || '#1F2937',
                  headingFont: microsite.settings?.theme?.headingFont || 'Inter',
                  bodyFont: microsite.settings?.theme?.bodyFont || 'Inter',
                  borderRadius: microsite.settings?.theme?.borderRadius || 'medium',
                  spacing: microsite.settings?.theme?.spacing || 'medium',
                  headerStyle: microsite.settings?.theme?.headerStyle || 'default',
                  navigationStyle: microsite.settings?.theme?.navigationStyle || 'horizontal',
                  footerStyle: microsite.settings?.theme?.footerStyle || 'simple',
                });
              }}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="min-w-32"
            >
              {isLoading ? 'Saving...' : 'Save Theme'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;