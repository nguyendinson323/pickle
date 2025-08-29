import { Message, User, Notification } from '../models';
import { MessageData } from '../types/dashboard';
import { Op } from 'sequelize';

export class MessageService {
  
  async sendMessage(senderId: number, receiverId: number, subject: string, content: string, options?: {
    isUrgent?: boolean;
    messageType?: 'personal' | 'announcement' | 'system';
    attachments?: string[];
  }): Promise<Message> {
    const message = await Message.create({
      senderId,
      receiverId,
      subject,
      content,
      isUrgent: options?.isUrgent || false,
      messageType: options?.messageType || 'personal',
      attachments: options?.attachments || []
    });

    // Create notification for receiver
    await Notification.create({
      userId: receiverId,
      title: `New message: ${subject}`,
      message: `You have received a new message from ${await this.getSenderName(senderId)}`,
      type: options?.isUrgent ? 'warning' : 'info',
      actionUrl: '/inbox'
    });

    return message;
  }

  async getInbox(userId: number, page: number = 1, limit: number = 20): Promise<{
    messages: MessageData[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  }> {
    const offset = (page - 1) * limit;

    const { rows: messages, count: totalCount } = await Message.findAndCountAll({
      where: {
        receiverId: userId
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'role']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;

    const formattedMessages: MessageData[] = messages.map(message => ({
      id: message.id,
      subject: message.subject,
      content: message.content,
      senderName: (message as any).sender?.username || 'Unknown',
      senderRole: (message as any).sender?.role || 'unknown',
      isRead: message.isRead,
      isUrgent: message.isUrgent,
      sentAt: message.createdAt.toISOString(),
      attachments: message.attachments ? message.attachments.map((att: any) => ({
        id: att.id,
        filename: att.filename,
        fileSize: att.fileSize,
        fileType: att.fileType,
        downloadUrl: att.downloadUrl
      })) : []
    }));

    return {
      messages: formattedMessages,
      totalCount,
      currentPage: page,
      totalPages,
      hasNextPage
    };
  }

  async markAsRead(messageId: number, userId: number): Promise<boolean> {
    const [affectedCount] = await Message.update(
      { isRead: true },
      {
        where: {
          id: messageId,
          receiverId: userId
        }
      }
    );

    return affectedCount > 0;
  }

  async deleteMessage(messageId: number, userId: number): Promise<boolean> {
    const deletedCount = await Message.destroy({
      where: {
        id: messageId,
        receiverId: userId
      }
    });

    return deletedCount > 0;
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await Message.count({
      where: {
        receiverId: userId,
        isRead: false
      }
    });
  }

  async sendAnnouncementToAll(senderId: number, subject: string, content: string, userRoles?: string[]): Promise<number> {
    let userFilter: any = {};
    
    if (userRoles && userRoles.length > 0) {
      userFilter.role = {
        [Op.in]: userRoles
      };
    }

    const users = await User.findAll({
      where: userFilter,
      attributes: ['id']
    });

    const messagePromises = users.map(user => 
      this.sendMessage(senderId, user.id, subject, content, {
        messageType: 'announcement',
        isUrgent: true
      })
    );

    await Promise.all(messagePromises);
    return users.length;
  }

  async getConversation(userId: number, otherUserId: number, page: number = 1, limit: number = 20): Promise<MessageData[]> {
    const offset = (page - 1) * limit;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'role']
        }
      ],
      order: [['createdAt', 'ASC']],
      limit,
      offset
    });

    return messages.map(message => ({
      id: message.id,
      subject: message.subject,
      content: message.content,
      senderName: (message as any).sender?.username || 'Unknown',
      senderRole: (message as any).sender?.role || 'unknown',
      isRead: message.isRead,
      isUrgent: message.isUrgent,
      sentAt: message.createdAt.toISOString(),
      attachments: message.attachments ? message.attachments.map((att: any) => ({
        id: att.id,
        filename: att.filename,
        fileSize: att.fileSize,
        fileType: att.fileType,
        downloadUrl: att.downloadUrl
      })) : []
    }));
  }

  private async getSenderName(senderId: number): Promise<string> {
    const user = await User.findByPk(senderId, {
      attributes: ['username']
    });
    
    return user?.username || 'Unknown';
  }
}

export default new MessageService();