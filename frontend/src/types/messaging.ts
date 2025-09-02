// Message types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system' | 'location' | 'match_invite';
  
  // File attachments
  attachments?: {
    type: 'image' | 'file';
    url: string;
    filename: string;
    size: number;
  }[];
  
  // Location sharing
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  // Match invitation
  matchInvite?: {
    courtId: string;
    facilityId: string;
    proposedTime: Date;
    duration: number;
  };
  
  // Message status
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  
  // Read receipts
  readBy: {
    userId: string;
    readAt: Date;
  }[];
  
  // Reactions
  reactions: {
    userId: string;
    emoji: string;
    createdAt: Date;
  }[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Associated data
  sender?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
}

// Conversation types
export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'tournament' | 'court_booking';
  name?: string;
  description?: string;
  
  // Participants
  participants: {
    userId: string;
    role: 'admin' | 'member';
    joinedAt: Date;
    leftAt?: Date;
    isActive: boolean;
  }[];
  
  // Group settings
  isGroup: boolean;
  groupIcon?: string;
  
  // Related entities
  relatedEntityType?: 'tournament' | 'court_booking' | 'player_match';
  relatedEntityId?: string;
  
  // Last message info
  lastMessageId?: string;
  lastMessageAt?: Date;
  lastMessagePreview?: string;
  
  // Conversation settings
  settings: {
    allowFileSharing: boolean;
    allowLocationSharing: boolean;
    muteNotifications: boolean;
    archiveAfterDays?: number;
  };
  
  // Status
  isActive: boolean;
  isArchived: boolean;
  archivedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Computed properties
  unreadCount?: number;
  lastActivity?: Date;
}

// Create conversation data
export interface CreateConversationData {
  type: 'direct' | 'group' | 'tournament' | 'court_booking';
  name?: string;
  description?: string;
  participants: {
    userId: string;
    role: 'admin' | 'member';
  }[];
  relatedEntityType?: 'tournament' | 'court_booking' | 'player_match';
  relatedEntityId?: string;
  settings?: {
    allowFileSharing?: boolean;
    allowLocationSharing?: boolean;
    muteNotifications?: boolean;
    archiveAfterDays?: number;
  };
}

// Send message data
export interface SendMessageData {
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'system' | 'location' | 'match_invite';
  attachments?: {
    type: 'image' | 'file';
    url: string;
    filename: string;
    size: number;
  }[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  matchInvite?: {
    courtId: string;
    facilityId: string;
    proposedTime: Date;
    duration: number;
  };
}

// Message filters
export interface MessageFilters {
  conversationId?: string;
  senderId?: string;
  messageType?: string;
  fromDate?: Date;
  toDate?: Date;
  includeDeleted?: boolean;
}

// Conversation filters
export interface ConversationFilters {
  type?: string;
  isActive?: boolean;
  isArchived?: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

// Pagination options
export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

// Typing indicator
export interface TypingUser {
  userId: string;
  username: string;
  timestamp: Date;
}

// Socket events
export interface SocketEvents {
  // Message events
  'message:send': SendMessageData & { conversationId: string };
  'message:edit': { messageId: string; content: string };
  'message:delete': { messageId: string };
  'message:read': { messageId: string };
  'message:react': { messageId: string; emoji: string };
  'message:unreact': { messageId: string };
  
  // Conversation events
  'conversation:join': { conversationId: string };
  'conversation:leave': { conversationId: string };
  'conversation:get_participants': { conversationId: string };
  
  // Typing events
  'typing:start': { conversationId: string };
  'typing:stop': { conversationId: string };
  
  // Presence events
  'presence:update': { status: 'online' | 'away' | 'busy' | 'offline' };
  'presence:get_online_users': void;
}

// Socket event responses
export interface SocketEventResponses {
  // Message events
  'message:new': { message: Message; timestamp: Date };
  'message:edited': { messageId: string; content: string; editedAt: Date; timestamp: Date };
  'message:deleted': { messageId: string; timestamp: Date };
  'message:read_by': { messageId: string; userId: string; readAt: Date };
  'message:reaction_added': { messageId: string; userId: string; emoji: string; timestamp: Date };
  'message:reaction_removed': { messageId: string; userId: string; timestamp: Date };
  
  // Conversation events
  'conversation:updated': { conversationId: string; lastMessageAt: Date; lastMessagePreview: string };
  'conversation:user_joined': { userId: string; timestamp: Date };
  'conversation:user_left': { userId: string; timestamp: Date };
  
  // Typing events
  'typing:user_started': { userId: string; conversationId: string; timestamp: Date };
  'typing:user_stopped': { userId: string; conversationId: string; timestamp: Date };
  
  // Presence events
  'presence:user_status_changed': { userId: string; isOnline: boolean; timestamp: Date };
  'presence:status_sync': { isOnline: boolean; timestamp: Date };
  
  // System events
  'system:message': { message: string; data?: any; timestamp: Date };
  'system:shutdown': { message: string; timestamp: Date };
  'connected': { userId: string; timestamp: Date };
}

// API response types
export interface MessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  totalPages: number;
}

export interface MessageSearchResponse {
  messages: Message[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ConversationSearchResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UnreadCountResponse {
  count: number;
}

// Error types
export interface MessageError {
  message: string;
  code?: string;
  details?: any;
}

// Chat window state
export interface ChatWindowState {
  conversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  typingUsers: TypingUser[];
  isTyping: boolean;
  hasMoreMessages: boolean;
  page: number;
}

// Message context menu
export interface MessageContextMenu {
  messageId: string;
  x: number;
  y: number;
  canEdit: boolean;
  canDelete: boolean;
}

// File upload progress
export interface FileUploadProgress {
  file: File;
  progress: number;
  error?: string;
}

// Match invitation status
export type MatchInviteStatus = 'pending' | 'accepted' | 'declined' | 'expired';

// Message delivery status
export type MessageDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';