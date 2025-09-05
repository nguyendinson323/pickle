import React, { useState, useRef, useCallback } from 'react';

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

interface MessageInputProps {
  onSendMessage: (
    content: string, 
    messageType?: string, 
    attachments?: any[], 
    location?: any, 
    matchInvite?: any
  ) => Promise<void>;
  onStartTyping: () => void;
  onStopTyping: () => void;
  disabled?: boolean;
  sending?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onStartTyping,
  onStopTyping,
  disabled = false,
  sending = false,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounced typing handlers
  const debouncedStartTyping = useCallback(
    debounce(() => {
      onStartTyping();
    }, 300),
    [onStartTyping]
  );

  const debouncedStopTyping = useCallback(
    debounce(() => {
      onStopTyping();
    }, 1000),
    [onStopTyping]
  );

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max 120px height
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    adjustTextareaHeight();

    // Handle typing indicators
    if (value.trim()) {
      debouncedStartTyping();
      debouncedStopTyping();
    } else {
      onStopTyping();
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled || sending) return;

    try {
      onStopTyping();
      await onSendMessage(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    const fileArray = Array.from(files);
    setUploadingFiles(fileArray);

    try {
      // TODO: Implement file upload to storage service
      const attachments = fileArray.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file), // Temporary URL for preview
        filename: file.name,
        size: file.size
      }));

      await onSendMessage(
        message.trim() || `Shared ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}`,
        'file',
        attachments
      );

      setMessage('');
      setUploadingFiles([]);
      setShowAttachMenu(false);
    } catch (error) {
      console.error('Failed to upload files:', error);
      setUploadingFiles([]);
    }
  };

  const handleLocationShare = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setShowAttachMenu(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `${position.coords.latitude}, ${position.coords.longitude}` // TODO: Reverse geocode
          };

          await onSendMessage(
            '📍 Location shared',
            'location',
            undefined,
            location
          );
        } catch (error) {
          console.error('Failed to share location:', error);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please check your browser settings.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleMatchInvite = async () => {
    // TODO: Implement match invitation modal
    setShowAttachMenu(false);
    
    // For now, just send a placeholder match invite
    const matchInvite = {
      courtId: 'court-1',
      facilityId: 'facility-1',
      proposedTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 60 // 1 hour
    };

    await onSendMessage(
      '🎾 Match invitation sent',
      'match_invite',
      undefined,
      undefined,
      matchInvite
    );
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {uploadingFiles.length > 0 && (
        <div className="mb-2 p-2 bg-gray-50 rounded">
          {uploadingFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{file.name}</span>
              <div className="text-blue-500">Uploading...</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end space-x-2">
        <div className="relative">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            disabled={disabled}
            title="Attach files"
          >
            📎
          </button>

          {showAttachMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-40">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <span>📄</span>
                <span>File</span>
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                onClick={() => {
                  fileInputRef.current?.click();
                  fileInputRef.current?.setAttribute('accept', 'image/*');
                }}
              >
                <span>🖼️</span>
                <span>Image</span>
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                onClick={handleLocationShare}
              >
                <span>📍</span>
                <span>Location</span>
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                onClick={handleMatchInvite}
              >
                <span>🎾</span>
                <span>Match Invite</span>
              </button>
            </div>
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Connecting..." : placeholder}
          disabled={disabled}
          className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
          rows={1}
        />

        <button
          type="button"
          className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
            message.trim() && !disabled && !sending
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400'
          }`}
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled || sending}
          title="Send message"
        >
          {sending ? (
            <div className="animate-spin">⏳</div>
          ) : (
            '➤'
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        accept="*/*"
      />
    </div>
  );
};

export default MessageInput;