import React from 'react';

interface ConversationHeaderProps {
  conversationId?: string;
  title?: string;
  participants?: Array<{ id: string; name: string; avatar?: string }>;
  isOnline?: boolean;
  lastSeen?: Date;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversationId,
  title = 'Conversation',
  participants = [],
  isOnline = false,
  lastSeen
}) => {
  const getParticipantsText = () => {
    if (participants.length === 0) return 'No participants';
    if (participants.length === 1) return participants[0].name;
    if (participants.length === 2) return participants.map(p => p.name).join(' and ');
    return `${participants[0].name} and ${participants.length - 1} others`;
  };

  const getStatusText = () => {
    if (isOnline) return 'Online';
    if (lastSeen) {
      const now = new Date();
      const diffMs = now.getTime() - lastSeen.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return `${Math.floor(diffMins / 1440)}d ago`;
    }
    return 'Offline';
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">
                {participants.length > 0 ? participants[0].name.charAt(0).toUpperCase() : 'C'}
              </span>
            </div>
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            )}
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {title}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {getParticipantsText()}
          </p>
          <p className="text-xs text-gray-400">
            {getStatusText()}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          title="Call"
        >
          📞
        </button>
        <button
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          title="Video call"
        >
          📹
        </button>
        <button
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          title="More options"
        >
          ⋯
        </button>
      </div>
    </div>
  );
};

export default ConversationHeader;