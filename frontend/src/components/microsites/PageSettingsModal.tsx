import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updatePage } from '../../store/micrositeSlice';
import { MicrositePage } from '../../store/micrositeSlice';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Switch from '../ui/Switch';
import FormField from '../ui/FormField';
import {
  DocumentTextIcon,
  GlobeAltIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface PageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: MicrositePage | null;
}

const PageSettingsModal: React.FC<PageSettingsModalProps> = ({
  isOpen,
  onClose,
  page
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    template: 'default',
    isPublished: false,
    sortOrder: 1,
    seoSettings: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      noIndex: false,
      noFollow: false,
    },
    settings: {
      showInNavigation: true,
      requireAuth: false,
      customCSS: '',
      customJS: '',
    }
  });

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        description: page.description || '',
        template: page.template || 'default',
        isPublished: page.isPublished || false,
        sortOrder: page.sortOrder || 1,
        seoSettings: {
          metaTitle: page.seoSettings?.metaTitle || '',
          metaDescription: page.seoSettings?.metaDescription || '',
          metaKeywords: page.seoSettings?.metaKeywords || '',
          ogTitle: page.seoSettings?.ogTitle || '',
          ogDescription: page.seoSettings?.ogDescription || '',
          ogImage: page.seoSettings?.ogImage || '',
          noIndex: page.seoSettings?.noIndex || false,
          noFollow: page.seoSettings?.noFollow || false,
        },
        settings: {
          showInNavigation: page.settings?.showInNavigation !== false,
          requireAuth: page.settings?.requireAuth || false,
          customCSS: page.settings?.customCSS || '',
          customJS: page.settings?.customJS || '',
        }
      });
    }
  }, [page]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [section, subField] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as any),
          [subField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    if (!page?.isHomePage) {
      const newSlug = generateSlug(title);
      handleInputChange('slug', newSlug);
    }
  };

  const handleSave = async () => {
    if (!page) return;

    setIsLoading(true);
    try {
      await dispatch(updatePage({
        id: page.id,
        data: formData
      }));
      onClose();
    } catch (error) {
      console.error('Error updating page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const templates = [
    { value: 'default', label: 'Default' },
    { value: 'landing', label: 'Landing Page' },
    { value: 'about', label: 'About' },
    { value: 'contact', label: 'Contact' },
    { value: 'events', label: 'Events' },
    { value: 'gallery', label: 'Gallery' },
  ];

  const tabs = [
    {
      key: 'general',
      label: 'General',
      icon: DocumentTextIcon,
    },
    {
      key: 'seo',
      label: 'SEO',
      icon: GlobeAltIcon,
    },
    {
      key: 'visibility',
      label: 'Visibility',
      icon: EyeIcon,
    },
    {
      key: 'advanced',
      label: 'Advanced',
      icon: Cog6ToothIcon,
    },
  ];

  const renderGeneralTab = () => (
    <div className="space-y-4">
      <FormField label="Page Title" required>
        <input
          type="text"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTitleChange(e.target.value)}
          placeholder="e.g. About Us"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      {!page?.isHomePage && (
        <FormField label="URL (Slug)" required help="The URL will be: /your-slug">
          <input
            type="text"
            value={formData.slug}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('slug', generateSlug(e.target.value))}
            placeholder="about-us"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FormField>
      )}

      <FormField label="Description">
        <textarea
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
          placeholder="Describe the content of this page..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      <FormField label="Template">
        <select
          value={formData.template}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('template', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {templates.map(template => (
            <option key={template.value} value={template.value}>{template.label}</option>
          ))}
        </select>
      </FormField>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Navigation Order
        </label>
        <input
          type="number"
          value={formData.sortOrder.toString()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('sortOrder', parseInt(e.target.value) || 1)}
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderSEOTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Meta Tags</h3>
        <div className="space-y-4">
          <FormField label="Meta Title">
            <input
              type="text"
              value={formData.seoSettings.metaTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('seoSettings.metaTitle', e.target.value)}
              placeholder="Title that appears on Google (50-60 characters)"
              maxLength={60}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormField>

          <FormField label="Meta Description">
            <textarea
              value={formData.seoSettings.metaDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('seoSettings.metaDescription', e.target.value)}
              placeholder="Description that appears on Google (150-160 characters)"
              maxLength={160}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormField>

          <FormField label="Keywords">
            <input
              type="text"
              value={formData.seoSettings.metaKeywords}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('seoSettings.metaKeywords', e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormField>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Open Graph (Social Media)</h3>
        <div className="space-y-4">
          <FormField label="OG Title">
            <input
              type="text"
              value={formData.seoSettings.ogTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('seoSettings.ogTitle', e.target.value)}
              placeholder="Title when sharing on social media"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormField>

          <FormField label="OG Description">
            <textarea
              value={formData.seoSettings.ogDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('seoSettings.ogDescription', e.target.value)}
              placeholder="Description when sharing on social media"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormField>

          <FormField label="OG Image (URL)">
            <input
              type="text"
              value={formData.seoSettings.ogImage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('seoSettings.ogImage', e.target.value)}
              placeholder="https://example.com/share-image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormField>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Indexing</h3>
        <div className="space-y-3">
          <Switch
            label="No Index"
            description="Prevent search engines from indexing this page"
            checked={formData.seoSettings.noIndex}
            onChange={(checked) => handleInputChange('seoSettings.noIndex', checked)}
          />

          <Switch
            label="No Follow"
            description="Prevent search engines from following links on this page"
            checked={formData.seoSettings.noFollow}
            onChange={(checked) => handleInputChange('seoSettings.noFollow', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderVisibilityTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Publication Status</h3>
        <Switch
          label="Page Published"
          description="The page will be visible to site visitors"
          checked={formData.isPublished}
          onChange={(checked) => handleInputChange('isPublished', checked)}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Navigation</h3>
        <Switch
          label="Show in Navigation"
          description="The page will appear in the main navigation menu"
          checked={formData.settings.showInNavigation}
          onChange={(checked) => handleInputChange('settings.showInNavigation', checked)}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Access</h3>
        <Switch
          label="Requires Authentication"
          description="Only authenticated users can view this page"
          checked={formData.settings.requireAuth}
          onChange={(checked) => handleInputChange('settings.requireAuth', checked)}
        />
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Custom CSS</h3>
        <FormField label="Custom CSS for this Page">
          <textarea
            value={formData.settings.customCSS}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('settings.customCSS', e.target.value)}
            placeholder="/* Add your custom CSS here */"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </FormField>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Custom JavaScript</h3>
        <FormField label="Custom JavaScript for this Page">
          <textarea
            value={formData.settings.customJS}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('settings.customJS', e.target.value)}
            placeholder="// Add your custom JavaScript here"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </FormField>
      </div>
    </div>
  );

  if (!page) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Page Settings"
      size="xl"
    >
      <div className="flex h-96">
        {/* Tabs */}
        <div className="w-48 border-r border-gray-200 pr-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 pl-6 overflow-y-auto">
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'seo' && renderSEOTab()}
          {activeTab === 'visibility' && renderVisibilityTab()}
          {activeTab === 'advanced' && renderAdvancedTab()}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Modal>
  );
};

export default PageSettingsModal;