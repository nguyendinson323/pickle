import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth';
import messageService from '../services/messageService';
import { asyncHandler } from '../middleware/errorHandler';


const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { receiverId, subject, content, isUrgent, attachments } = req.body;
  const senderId = req.user.userId.toString();

  const message = await messageService.sendMessage(
    senderId,
    receiverId,
    subject,
    content,
    { isUrgent, attachments: attachments || [] }
  );

  res.status(201).json({
    success: true,
    data: {
      id: message.id,
      conversationId: message.conversationId || '',
      senderId: message.senderId,
      content: message.content,
      messageType: 'text',
      attachments: message.attachments || [],
      isEdited: false,
      isDeleted: false,
      readBy: [],
      reactions: [],
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    },
    message: 'Message sent successfully'
  });
});

const getInbox = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId.toString();
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const inboxData = await messageService.getInbox(userId, page, limit);
  
  // Format conversations to match frontend expectations
  const formattedConversations = inboxData.conversations?.map((conv: any) => ({
    id: conv.id,
    type: conv.type || 'direct',
    name: conv.name,
    description: conv.description,
    participants: conv.participants || [],
    lastMessageId: conv.lastMessageId,
    lastMessageAt: conv.lastMessageAt,
    lastMessagePreview: conv.lastMessagePreview,
    settings: conv.settings || {
      allowFileSharing: true,
      allowLocationSharing: true,
      muteNotifications: false
    },
    isActive: conv.isActive !== false,
    isArchived: conv.isArchived || false,
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
    unreadCount: conv.unreadCount || 0
  })) || [];
  
  res.json({ 
    success: true, 
    data: {
      conversations: formattedConversations,
      total: inboxData.total,
      page: inboxData.page,
      totalPages: inboxData.totalPages
    }
  });
});

const markMessageAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const messageId = req.params.id;
  const userId = req.user.userId.toString();

  const updated = await messageService.markAsRead(messageId, userId);
  if (!updated) return res.status(404).json({ success: false, error: 'Message not found or access denied' });

  res.json({ success: true, message: 'Message marked as read' });
});

const deleteMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const messageId = req.params.id;
  const userId = req.user.userId.toString();

  try {
    await messageService.deleteMessage(messageId, userId);
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error: any) {
    res.status(404).json({ success: false, error: 'Message not found or access denied' });
  }
});

const getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId.toString();
  const unreadCount = await messageService.getUnreadCount(userId);
  res.json({ success: true, data: { unreadCount } });
});

const sendAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Access denied - Federation admin required' });

  const { subject, content, targetRoles } = req.body;
  const senderId = req.user.userId.toString();

  const sentCount = await messageService.sendAnnouncementToAll(senderId, subject, content, targetRoles);
  res.json({ success: true, data: { sentCount }, message: `Announcement sent to ${sentCount} users` });
});

const getConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId.toString();
  const otherUserId = req.params.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await messageService.getConversation(userId, otherUserId, page, limit);
  
  // Format messages to match frontend Message interface
  const formattedMessages = result.messages?.map((msg: any) => ({
    id: msg.id,
    conversationId: msg.conversationId || '',
    senderId: msg.senderId,
    content: msg.content,
    messageType: msg.messageType || 'text',
    attachments: msg.attachments || [],
    location: msg.location,
    matchInvite: msg.matchInvite,
    isEdited: msg.isEdited || false,
    editedAt: msg.editedAt,
    isDeleted: msg.isDeleted || false,
    deletedAt: msg.deletedAt,
    readBy: msg.readBy || [],
    reactions: msg.reactions || [],
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
    sender: msg.sender
  })) || [];
  
  res.json({ 
    success: true, 
    data: {
      messages: formattedMessages,
      total: result.total || formattedMessages.length,
      page,
      totalPages: Math.ceil((result.total || formattedMessages.length) / limit)
    }
  });
});

export {
  sendMessage,
  getInbox,
  markMessageAsRead,
  deleteMessage,
  getUnreadCount,
  sendAnnouncement,
  getConversation
};
