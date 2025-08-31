import React, { useState } from 'react';
import { useAppDispatch } from '@/store';
import { deleteMessage } from '@/store/messageSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import {
  UserIcon,
  CalendarIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
  PrinterIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

interface MessageViewerProps {
  message?: {
    id: string;
    subject: string;
    content: string;
    sender: {
      id: string;
      username: string;
      email?: string;
    };
    recipient: {
      id: string;
      username: string;
    };
    type: 'message' | 'notification' | 'system';
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  onReply?: (messageId: string) => void;
  onClose?: () => void;
}

const MessageViewer: React.FC<MessageViewerProps> = ({ message, onReply, onClose }) => {
  const dispatch = useAppDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!message) {
    return (
      <Card className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Select a message
        </h3>
        <p className="text-gray-500">
          Select a message from the list to view it here.
        </p>
      </Card>
    );
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteMessage(parseInt(message.id))).unwrap();
      setShowDeleteModal(false);
      onClose?.();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case 'system': return 'System';
      case 'notification': return 'Notification';
      default: return 'Message';
    }
  };

  const getMessageTypeVariant = (type: string) => {
    switch (type) {
      case 'system': return 'info' as const;
      case 'notification': return 'warning' as const;
      default: return 'primary' as const;
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {message.subject}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>
                    From: <span className="font-medium">{message.sender.username}</span>
                    {message.sender.email && (
                      <span className="text-gray-400 ml-1">({message.sender.email})</span>
                    )}
                  </span>
                  <span className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {formatFullDate(message.createdAt)}
                  </span>
                </div>
                <div className="mt-2">
                  <Badge variant={getMessageTypeVariant(message.type)}>
                    {getMessageTypeLabel(message.type)}
                  </Badge>
                  {!message.isRead && (
                    <Badge variant="success" className="ml-2">
                      New
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.print()}
                title="Print"
              >
                <PrinterIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.share?.({
                    title: message.subject,
                    text: message.content,
                    url: window.location.href
                  });
                }}
                title="Share"
              >
                <ShareIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:text-red-700"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="prose max-w-none">
            <div 
              className="text-gray-900 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ 
                __html: message.content.replace(/\n/g, '<br>') 
              }}
            />
          </div>

          {/* Attachments Section (if any) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Attachments
            </h4>
            <p className="text-sm text-gray-500">
              No attachments in this message.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {message.type !== 'system' && (
                <>You can reply to this message using the reply button.</>
              )}
            </div>
            <div className="flex space-x-3">
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              )}
              {message.type !== 'system' && onReply && (
                <Button
                  variant="primary"
                  onClick={() => onReply(message.id)}
                  leftIcon={<ArrowUturnLeftIcon className="w-4 h-4" />}
                >
                  Reply
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Message"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this message? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={handleDelete}
              leftIcon={<TrashIcon className="w-4 h-4" />}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MessageViewer;