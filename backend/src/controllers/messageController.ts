import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../types/auth';
import messageService from '../services/messageService';
import { asyncHandler } from '../middleware/errorHandler';

const sendMessageValidators = [
  body('receiverId').isInt({ min: 1 }).withMessage('Valid receiver ID is required'),
  body('subject').trim().isLength({ min: 1, max: 255 }).withMessage('Subject must be between 1 and 255 characters'),
  body('content').trim().isLength({ min: 1, max: 10000 }).withMessage('Content must be between 1 and 10000 characters'),
  body('isUrgent').optional().isBoolean().withMessage('isUrgent must be a boolean'),
];

const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });

  const { receiverId, subject, content, isUrgent, attachments } = req.body;
  const senderId = req.user.userId;

  const message = await messageService.sendMessage(senderId, receiverId, subject, content, { isUrgent, attachments: attachments || [] });

  res.status(201).json({
    success: true,
    data: { id: message.id, subject: message.subject, sentAt: message.createdAt },
    message: 'Message sent successfully'
  });
});

const getInbox = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const inboxData = await messageService.getInbox(userId, page, limit);
  res.json({ success: true, data: inboxData });
});

const markMessageAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const messageId = parseInt(req.params.id);
  const userId = req.user.userId;

  const updated = await messageService.markAsRead(messageId, userId);
  if (!updated) return res.status(404).json({ success: false, error: 'Message not found or access denied' });

  res.json({ success: true, message: 'Message marked as read' });
});

const deleteMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const messageId = parseInt(req.params.id);
  const userId = req.user.userId;

  const deleted = await messageService.deleteMessage(messageId, userId);
  if (!deleted) return res.status(404).json({ success: false, error: 'Message not found or access denied' });

  res.json({ success: true, message: 'Message deleted successfully' });
});

const getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const unreadCount = await messageService.getUnreadCount(userId);
  res.json({ success: true, data: { unreadCount } });
});

const sendAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'federation') return res.status(403).json({ success: false, error: 'Access denied - Federation admin required' });

  const { subject, content, targetRoles } = req.body;
  const senderId = req.user.userId;

  const sentCount = await messageService.sendAnnouncementToAll(senderId, subject, content, targetRoles);
  res.json({ success: true, data: { sentCount }, message: `Announcement sent to ${sentCount} users` });
});

const getConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const otherUserId = parseInt(req.params.userId);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const messages = await messageService.getConversation(userId, otherUserId, page, limit);
  res.json({ success: true, data: messages });
});

export {
  sendMessageValidators,
  sendMessage,
  getInbox,
  markMessageAsRead,
  deleteMessage,
  getUnreadCount,
  sendAnnouncement,
  getConversation
};
