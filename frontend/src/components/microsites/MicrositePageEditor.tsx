import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchPageBlocks,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
  reorderContentBlocks,
  setDraggedBlock,
  updatePage
} from '../../store/micrositeSlice';
import { Microsite, MicrositePage, ContentBlock } from '../../store/micrositeSlice';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import ContentBlockEditor from './ContentBlockEditor';
import ContentBlockPreview from './ContentBlockPreview';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentDuplicateIcon,
  Bars3Icon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface MicrositePageEditorProps {
  microsite: Microsite;
  page: MicrositePage | null;
}

const CONTENT_BLOCK_TYPES = [
  { type: 'text', label: 'Text', icon: '📝', description: 'Rich text with formatting' },
  { type: 'image', label: 'Image', icon: '🖼️', description: 'Image with alternative text' },
  { type: 'gallery', label: 'Gallery', icon: '🖼️', description: 'Collection of images' },
  { type: 'video', label: 'Video', icon: '🎥', description: 'YouTube video or file' },
  { type: 'contact', label: 'Contact', icon: '📞', description: 'Contact information and form' },
  { type: 'map', label: 'Map', icon: '🗺️', description: 'Interactive location map' },
  { type: 'court_list', label: 'Court List', icon: '🏟️', description: 'List of available courts' },
  { type: 'tournament_list', label: 'Tournaments', icon: '🏆', description: 'Tournament list' },
  { type: 'calendar', label: 'Calendar', icon: '📅', description: 'Event calendar' },
  { type: 'custom_html', label: 'Custom HTML', icon: '💻', description: 'Custom HTML code' },
];

const MicrositePageEditor: React.FC<MicrositePageEditorProps> = ({ microsite, page }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { draggedBlock } = useSelector((state: RootState) => state.microsites);

  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [pageSettings, setPageSettings] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    isPublished: false,
  });

  useEffect(() => {
    if (page) {
      dispatch(fetchPageBlocks(page.id));
      setPageSettings({
        title: page.title,
        slug: page.slug,
        metaTitle: page.metaTitle || '',
        metaDescription: page.metaDescription || '',
        isPublished: page.isPublished,
      });
    }
  }, [page, dispatch]);

  const handleAddBlock = async (blockType: string) => {
    if (!page) return;

    const defaultContent = getDefaultBlockContent(blockType);
    const blockData = {
      type: blockType,
      content: defaultContent,
      sortOrder: (page.contentBlocks?.length || 0) + 1,
      isVisible: true,
      settings: {},
    };

    await dispatch(createContentBlock({ pageId: page.id, blockData }));
    setShowBlockSelector(false);
  };

  const handleEditBlock = (block: ContentBlock) => {
    setEditingBlock(block);
  };

  const handleUpdateBlock = async (blockId: number, data: Partial<ContentBlock>) => {
    await dispatch(updateContentBlock({ id: blockId, data }));
    setEditingBlock(null);
  };

  const handleDeleteBlock = async (blockId: number) => {
    if (confirm('Are you sure you want to delete this block?')) {
      await dispatch(deleteContentBlock(blockId));
    }
  };

  const handleToggleBlockVisibility = async (block: ContentBlock) => {
    await dispatch(updateContentBlock({ 
      id: block.id, 
      data: { isVisible: !block.isVisible } 
    }));
  };

  const handleDragStart = (e: React.DragEvent, block: ContentBlock) => {
    dispatch(setDraggedBlock(block));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedBlock || !page?.contentBlocks) return;

    const blocks = [...page.contentBlocks];
    const draggedIndex = blocks.findIndex(b => b.id === draggedBlock.id);
    
    if (draggedIndex === -1 || draggedIndex === targetIndex) return;

    // Remove dragged block and insert at target position
    blocks.splice(draggedIndex, 1);
    blocks.splice(targetIndex, 0, draggedBlock);

    // Update sort orders
    const blockOrders = blocks.map((block, index) => ({
      id: block.id,
      sortOrder: index + 1,
    }));

    await dispatch(reorderContentBlocks({ pageId: page.id, blockOrders }));
    dispatch(setDraggedBlock(null));
  };

  const handleSavePageSettings = async () => {
    if (!page) return;

    await dispatch(updatePage({ 
      id: page.id, 
      data: pageSettings 
    }));
    setShowPageSettings(false);
  };

  const getDefaultBlockContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: '<p>Write your content here...</p>', textAlign: 'left' };
      case 'image':
        return { imageUrl: '', alt: '', caption: '', alignment: 'center' };
      case 'gallery':
        return { images: [], layout: 'grid', columns: 3 };
      case 'video':
        return { videoUrl: '', videoType: 'youtube', autoplay: false };
      case 'contact':
        return { 
          title: 'Contact Us', 
          email: microsite.contactEmail, 
          phone: microsite.contactPhone,
          showForm: true 
        };
      case 'map':
        return { latitude: 19.4326, longitude: -99.1332, zoom: 15 };
      default:
        return {};
    }
  };

  if (!page) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <DocumentDuplicateIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Select a page</h3>
          <p>Choose a page from the left panel to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">
                {page.title}
              </h2>
              {page.isHomePage && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  Home page
                </span>
              )}
              {!page.isPublished && (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                  Draft
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              /{page.slug || ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPageSettings(true)}
              className="flex items-center gap-2"
            >
              <Cog6ToothIcon className="w-4 h-4" />
              Settings
            </Button>
            
            <Button
              size="sm"
              onClick={() => setShowBlockSelector(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Block
            </Button>
          </div>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="flex-1 overflow-y-auto p-6">
        {page.contentBlocks && page.contentBlocks.length > 0 ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {page.contentBlocks
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((block, index) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`group relative ${
                    block.isVisible ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  {/* Block Controls */}
                  <div className="absolute -left-12 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-1">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 cursor-move"
                        title="Drag to reorder"
                      >
                        <Bars3Icon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <Card className="relative hover:shadow-md transition-shadow">
                    {/* Block Header */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleBlockVisibility(block)}
                          className={`p-1 rounded ${
                            block.isVisible 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={block.isVisible ? 'Hide block' : 'Show block'}
                        >
                          {block.isVisible ? (
                            <EyeIcon className="w-4 h-4" />
                          ) : (
                            <EyeSlashIcon className="w-4 h-4" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleEditBlock(block)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit block"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete block"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Block Content */}
                    <div className="p-6">
                      <ContentBlockPreview block={block} />
                    </div>

                    {/* Block Type Label */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        {CONTENT_BLOCK_TYPES.find(t => t.type === block.type)?.label || block.type}
                      </span>
                    </div>
                  </Card>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <PlusIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                This page is empty
              </h3>
              <p className="text-gray-600 mb-4">
                Start by adding content blocks to create your page.
              </p>
              <Button
                onClick={() => setShowBlockSelector(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <PlusIcon className="w-4 h-4" />
                Add First Block
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Block Type Selector Modal */}
      <Modal
        isOpen={showBlockSelector}
        onClose={() => setShowBlockSelector(false)}
        title="Add Content Block"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONTENT_BLOCK_TYPES.map((blockType) => (
            <button
              key={blockType.type}
              onClick={() => handleAddBlock(blockType.type)}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{blockType.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {blockType.label}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {blockType.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Block Editor Modal */}
      {editingBlock && (
        <ContentBlockEditor
          block={editingBlock}
          isOpen={!!editingBlock}
          onClose={() => setEditingBlock(null)}
          onSave={handleUpdateBlock}
          micrositeId={microsite.id}
        />
      )}

      {/* Page Settings Modal */}
      <Modal
        isOpen={showPageSettings}
        onClose={() => setShowPageSettings(false)}
        title="Page Settings"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Title
            </label>
            <input
              type="text"
              value={pageSettings.title}
              onChange={(e) => setPageSettings(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL (Slug)
            </label>
            <input
              type="text"
              value={pageSettings.slug}
              onChange={(e) => setPageSettings(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="my-page"
            />
            <p className="text-xs text-gray-500 mt-1">
              {microsite.subdomain}.pickleballfed.mx/{pageSettings.slug}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Title
            </label>
            <input
              type="text"
              value={pageSettings.metaTitle}
              onChange={(e) => setPageSettings(prev => ({ ...prev, metaTitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {pageSettings.metaTitle.length}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Description
            </label>
            <textarea
              value={pageSettings.metaDescription}
              onChange={(e) => setPageSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {pageSettings.metaDescription.length}/160 characters
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={pageSettings.isPublished}
              onChange={(e) => setPageSettings(prev => ({ ...prev, isPublished: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
              Published page
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowPageSettings(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePageSettings}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MicrositePageEditor;