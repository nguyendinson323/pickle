import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../store';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PaperClipIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface ComposeMessageProps {
  recipientId?: string;
  replyToId?: string;
  onSent?: () => void;
  onCancel?: () => void;
}

const ComposeMessage: React.FC<ComposeMessageProps> = ({
  recipientId,
  replyToId,
  onSent,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    recipientId: recipientId || '',
    subject: replyToId ? 'Re: ' : '',
    content: '',
    type: 'message' as const
  });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (recipientId) {
      setFormData(prev => ({ ...prev, recipientId }));
    }
  }, [recipientId]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.recipientId) {
      newErrors.recipientId = 'You must select a recipient';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Message cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSending(true);
    try {
      const messageData = {
        recipientId: formData.recipientId,
        subject: formData.subject,
        content: formData.content,
        isUrgent: false
      };
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Reset form
      setFormData({
        recipientId: recipientId || '',
        subject: replyToId ? 'Re: ' : '',
        content: '',
        type: 'message'
      });
      
      onSent?.();
    } catch (error) {
      console.error('Error sending message:', error);
      setErrors({ submit: 'Error sending message. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      recipientId: recipientId || '',
      subject: replyToId ? 'Re: ' : '',
      content: '',
      type: 'message'
    });
    setErrors({});
    onCancel?.();
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {replyToId ? 'Reply Message' : 'New Message'}
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancel}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Recipient Field */}
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              id="recipient"
              value={formData.recipientId}
              onChange={(e) => handleChange('recipientId', e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 ${
                errors.recipientId
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="Search user by name or email..."
              disabled={!!recipientId}
            />
          </div>
          {errors.recipientId && (
            <p className="mt-1 text-sm text-red-600">{errors.recipientId}</p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 ${
              errors.subject
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }`}
            placeholder="Enter message subject"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>

        {/* Message Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="content"
            rows={8}
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 resize-vertical ${
              errors.content
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }`}
            placeholder="Write your message here..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.content.length}/1000 characters
          </p>
        </div>

        {/* Attachments Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <PaperClipIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Drag files here or{' '}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                select files
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Maximum 10MB per file. Formats: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Tip: Use Ctrl+Enter to send quickly
          </div>
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={sending}
              leftIcon={<PaperAirplaneIcon className="w-4 h-4" />}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ComposeMessage;