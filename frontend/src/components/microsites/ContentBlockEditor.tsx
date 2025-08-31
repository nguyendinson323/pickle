import React, { useState, useEffect } from 'react';
import { ContentBlock } from '../../store/micrositeSlice';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
// FormField removed - using direct label/div structure instead
import SelectField from '../forms/SelectField';
import Tabs from '../ui/Tabs';
import MediaSelector from './MediaSelector';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ContentBlockEditorProps {
  block: ContentBlock;
  isOpen: boolean;
  onClose: () => void;
  onSave: (blockId: number, data: Partial<ContentBlock>) => void;
  micrositeId: number;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  block,
  isOpen,
  onClose,
  onSave,
  micrositeId,
}) => {
  const [content, setContent] = useState(block.content);
  const [settings, setSettings] = useState(block.settings || {});
  const [activeTab, setActiveTab] = useState('content');
  const [showMediaSelector, setShowMediaSelector] = useState(false);

  useEffect(() => {
    setContent(block.content);
    setSettings(block.settings || {});
  }, [block]);

  const handleSave = () => {
    onSave(block.id, { content, settings });
    onClose();
  };

  const handleContentChange = (field: string, value: any) => {
    setContent((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderContentEditor = () => {
    switch (block.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content.text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={8}
                placeholder="Write your content here... (HTML allowed)"
              />
            </div>

            <SelectField
              name="textAlign"
              label="Text Alignment"
              value={content.textAlign || 'left'}
              onChange={(value) => handleContentChange('textAlign', value)}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
                { value: 'justify', label: 'Justify' },
              ]}
            />

            <SelectField
              name="fontSize"
              label="Font Size"
              value={content.fontSize || 'medium'}
              onChange={(value) => handleContentChange('fontSize', value)}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
                { value: 'xl', label: 'Extra Large' },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={content.color || '#000000'}
                onChange={(e) => handleContentChange('color', e.target.value)}
                className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {content.imageUrl && (
                  <div className="relative">
                    <img
                      src={content.imageUrl}
                      alt={content.alt || 'Preview'}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowMediaSelector(true)}
                    className="flex items-center gap-2"
                  >
                    <PhotoIcon className="w-4 h-4" />
                    Select from Library
                  </Button>
                  
                  <div className="flex-1">
                    <input
                      type="url"
                      value={content.imageUrl || ''}
                      onChange={(e) => handleContentChange('imageUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Or enter URL: https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternative Text
              </label>
              <input
                type="text"
                value={content.alt || ''}
                onChange={(e) => handleContentChange('alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Image description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Caption
              </label>
              <input
                type="text"
                value={content.caption || ''}
                onChange={(e) => handleContentChange('caption', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Text that appears below the image"
              />
            </div>

            <SelectField
              name="alignment"
              label="Alignment"
              value={content.alignment || 'center'}
              onChange={(value) => handleContentChange('alignment', value)}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
            />

            <SelectField
              name="size"
              label="Size"
              value={content.size || 'medium'}
              onChange={(value) => handleContentChange('size', value)}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
                { value: 'full', label: 'Full width' },
              ]}
            />
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <SelectField
              name="videoType"
              label="Video Type"
              value={content.videoType || 'youtube'}
              onChange={(value) => handleContentChange('videoType', value)}
              options={[
                { value: 'youtube', label: 'YouTube' },
                { value: 'vimeo', label: 'Vimeo' },
                { value: 'file', label: 'Video file' },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={content.videoUrl || ''}
                onChange={(e) => handleContentChange('videoUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  content.videoType === 'youtube' 
                    ? 'https://www.youtube.com/watch?v=...'
                    : 'Video URL'
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview Image
              </label>
              <input
                type="url"
                value={content.thumbnail || ''}
                onChange={(e) => handleContentChange('thumbnail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Preview image URL"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={content.autoplay || false}
                  onChange={(e) => handleContentChange('autoplay', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Autoplay</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={content.controls !== false}
                  onChange={(e) => handleContentChange('controls', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Show controls</span>
              </label>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contact Us"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={content.email || ''}
                onChange={(e) => handleContentChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={content.phone || ''}
                onChange={(e) => handleContentChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="+52 55 1234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={content.address || ''}
                onChange={(e) => handleContentChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Full address"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showForm"
                checked={content.showForm || false}
                onChange={(e) => handleContentChange('showForm', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showForm" className="ml-2 text-sm text-gray-700">
                Show contact form
              </label>
            </div>

            {content.showForm && (
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Fields
              </label>
                <div className="space-y-2">
                  {['name', 'email', 'phone', 'message'].map((field) => (
                    <label key={field} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(content.formFields || []).includes(field)}
                        onChange={(e) => {
                          const fields = content.formFields || [];
                          if (e.target.checked) {
                            handleContentChange('formFields', [...fields, field]);
                          } else {
                            handleContentChange('formFields', fields.filter((f: string) => f !== field));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {field === 'name' ? 'Name' :
                         field === 'email' ? 'Email' :
                         field === 'phone' ? 'Phone' :
                         field === 'message' ? 'Message' : field}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'map':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitud <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                value={content.latitude || ''}
                onChange={(e) => handleContentChange('latitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="19.4326"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitud <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                value={content.longitude || ''}
                onChange={(e) => handleContentChange('longitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="-99.1332"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom Level
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={content.zoom || 15}
                onChange={(e) => handleContentChange('zoom', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marker Title
              </label>
              <input
                type="text"
                value={content.markerTitle || ''}
                onChange={(e) => handleContentChange('markerTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Title that appears on the marker"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={content.address || ''}
                onChange={(e) => handleContentChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Visible address"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showControls"
                checked={content.showControls !== false}
                onChange={(e) => handleContentChange('showControls', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showControls" className="ml-2 text-sm text-gray-700">
                Show map controls
              </label>
            </div>
          </div>
        );

      case 'custom_html':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTML Code <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content.html || ''}
                onChange={(e) => handleContentChange('html', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                rows={8}
                placeholder="<div>Your HTML code here...</div>"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom CSS
              </label>
              <textarea
                value={content.css || ''}
                onChange={(e) => handleContentChange('css', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                rows={6}
                placeholder=".my-class { color: blue; }"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                <strong>Warning:</strong> Only use HTML and CSS code from trusted sources. 
                Malicious code can compromise your site's security.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Editor not available for type: {block.type}</p>
          </div>
        );
    }
  };

  const renderSettingsEditor = () => {
    return (
      <div className="space-y-4">
        <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Top Margin
              </label>
          <SelectField
            name="marginTop"
            label="Top Margin"
            value={settings.marginTop || 'medium'}
            onChange={(value) => handleSettingsChange('marginTop', value)}
            options={[
              { value: 'none', label: 'No margin' },
              { value: 'small', label: 'Pequeño' },
              { value: 'medium', label: 'Mediano' },
              { value: 'large', label: 'Grande' },
            ]}
          />
        </div>

        <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bottom Margin
              </label>
          <SelectField
            name="marginBottom"
            label="Bottom Margin"
            value={settings.marginBottom || 'medium'}
            onChange={(value) => handleSettingsChange('marginBottom', value)}
            options={[
              { value: 'none', label: 'No margin' },
              { value: 'small', label: 'Pequeño' },
              { value: 'medium', label: 'Mediano' },
              { value: 'large', label: 'Grande' },
            ]}
          />
        </div>

        <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
          <input
            type="color"
            value={settings.backgroundColor || '#ffffff'}
            onChange={(e) => handleSettingsChange('backgroundColor', e.target.value)}
            className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="fullWidth"
            checked={settings.fullWidth || false}
            onChange={(e) => handleSettingsChange('fullWidth', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="fullWidth" className="ml-2 text-sm text-gray-700">
            Full width
          </label>
        </div>

        <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom CSS Class
              </label>
          <input
            type="text"
            value={settings.customClass || ''}
            onChange={(e) => handleSettingsChange('customClass', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="my-custom-class"
          />
        </div>
      </div>
    );
  };

  const handleMediaSelect = (files: any[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (block.type === 'image') {
        handleContentChange('imageUrl', file.url);
        if (!content.alt) {
          handleContentChange('alt', file.fileName);
        }
      } else if (block.type === 'gallery') {
        const newImages = files.map(f => ({
          url: f.url,
          alt: f.fileName,
          caption: f.description || ''
        }));
        handleContentChange('images', [...(content.images || []), ...newImages]);
      }
    }
  };

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Block: ${block.type}`}
      size="lg"
    >
      <div className="space-y-6">
        <Tabs
          items={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="min-h-[400px]">
          {activeTab === 'content' && renderContentEditor()}
          {activeTab === 'settings' && renderSettingsEditor()}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      <MediaSelector
        isOpen={showMediaSelector}
        onClose={() => setShowMediaSelector(false)}
        onSelect={handleMediaSelect}
        micrositeId={micrositeId}
        allowedTypes={block.type === 'gallery' ? ['image'] : ['image']}
        maxSelection={block.type === 'gallery' ? 10 : 1}
        title={block.type === 'gallery' ? 'Select Images' : 'Select Image'}
      />
    </Modal>
  );
};

export default ContentBlockEditor;