import Conversation from '../models/Conversation';
import ConversationMessage from '../models/ConversationMessage';
import MessageReadStatus from '../models/MessageReadStatus';
import MessageReaction from '../models/MessageReaction';
import NotificationQueue from '../models/NotificationQueue';

export const seedConversations = async (users: any[]): Promise<any> => {
  console.log('💬 Seeding conversations and messages...');
  
  const playerUsers = users.filter(u => u.role === 'player');
  const coachUsers = users.filter(u => u.role === 'coach');
  const clubUsers = users.filter(u => u.role === 'club');
  
  if (playerUsers.length < 2) {
    console.log('⚠️ Not enough users for conversations');
    return {};
  }

  // Create conversations with proper data types
  const conversations = await Conversation.bulkCreate([
    {
      creatorId: playerUsers[0].id,
      type: 'direct',
      title: null,
      participants: [playerUsers[0].id, playerUsers[1].id],
      lastMessageAt: new Date(),
      lastMessagePreview: '¿A qué hora nos vemos mañana?',
      unreadCount: {
        [playerUsers[0].id]: 0,
        [playerUsers[1].id]: 1
      },
      metadata: {
        createdFor: 'match_coordination'
      },
      isActive: true,
      isPinned: false,
      mutedBy: []
    },
    {
      creatorId: clubUsers[0]?.id || playerUsers[0].id,
      type: 'group',
      title: 'Torneo Primavera 2024 - Coordinación',
      participants: [
        clubUsers[0]?.id || playerUsers[0].id,
        playerUsers[0].id,
        playerUsers[1].id,
        playerUsers[2]?.id || playerUsers[0].id,
        coachUsers[0]?.id || playerUsers[1].id
      ],
      lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastMessagePreview: 'Recordatorio: El torneo inicia a las 9:00 AM',
      unreadCount: {
        [playerUsers[0].id]: 3,
        [playerUsers[1].id]: 3,
        [playerUsers[2]?.id || playerUsers[0].id]: 5
      },
      metadata: {
        tournamentId: 1,
        createdFor: 'tournament_coordination'
      },
      isActive: true,
      isPinned: true,
      mutedBy: []
    },
    {
      creatorId: coachUsers[0]?.id || playerUsers[0].id,
      type: 'broadcast',
      title: 'Anuncios del Entrenador',
      participants: [
        coachUsers[0]?.id || playerUsers[0].id,
        playerUsers[0].id,
        playerUsers[1].id,
        playerUsers[2]?.id || playerUsers[0].id,
        playerUsers[3]?.id || playerUsers[1].id
      ],
      lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastMessagePreview: 'Clases canceladas mañana por mantenimiento de canchas',
      unreadCount: {},
      metadata: {
        broadcastType: 'coach_announcements',
        allowReplies: false
      },
      isActive: true,
      isPinned: false,
      mutedBy: [playerUsers[2]?.id || playerUsers[0].id]
    },
    {
      creatorId: playerUsers[1].id,
      type: 'direct',
      title: null,
      participants: [playerUsers[1].id, coachUsers[0]?.id || playerUsers[2]?.id || playerUsers[0].id],
      lastMessageAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
      lastMessagePreview: 'Gracias por la clase de hoy',
      unreadCount: {},
      metadata: {
        createdFor: 'coaching_feedback'
      },
      isActive: true,
      isPinned: false,
      mutedBy: [],
      archivedBy: [playerUsers[1].id],
      archivedAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
    }
  ], { returning: true });

  // Create conversation messages
  const messages = await ConversationMessage.bulkCreate([
    // Direct conversation messages
    {
      conversationId: conversations[0].id,
      senderId: playerUsers[0].id,
      messageType: 'text',
      content: 'Hola! ¿Confirmado para mañana?',
      metadata: {},
      isEdited: false,
      isPinned: false,
      isDeleted: false,
      readBy: [playerUsers[0].id],
      deliveredTo: [playerUsers[0].id, playerUsers[1].id],
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
    },
    {
      conversationId: conversations[0].id,
      senderId: playerUsers[1].id,
      messageType: 'text',
      content: 'Sí! Nos vemos a las 6 PM en la cancha principal',
      metadata: {},
      isEdited: false,
      isPinned: false,
      isDeleted: false,
      readBy: [playerUsers[0].id, playerUsers[1].id],
      deliveredTo: [playerUsers[0].id, playerUsers[1].id],
      createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
    },
    {
      conversationId: conversations[0].id,
      senderId: playerUsers[0].id,
      messageType: 'text',
      content: 'Perfecto! Llevo las pelotas',
      metadata: {},
      isEdited: false,
      isPinned: false,
      isDeleted: false,
      readBy: [playerUsers[0].id, playerUsers[1].id],
      deliveredTo: [playerUsers[0].id, playerUsers[1].id],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      conversationId: conversations[0].id,
      senderId: playerUsers[1].id,
      messageType: 'text',
      content: '¿A qué hora nos vemos mañana?',
      metadata: {},
      isEdited: false,
      isPinned: false,
      isDeleted: false,
      readBy: [playerUsers[1].id],
      deliveredTo: [playerUsers[0].id, playerUsers[1].id],
      createdAt: new Date()
    },

    // Group conversation messages
    {
      conversationId: conversations[1].id,
      senderId: clubUsers[0]?.id || playerUsers[0].id,
      messageType: 'text',
      content: 'Buenos días a todos! Les recordamos que el torneo inicia este sábado.',
      metadata: {},
      isEdited: false,
      isPinned: true,
      isDeleted: false,
      readBy: [clubUsers[0]?.id || playerUsers[0].id],
      deliveredTo: conversations[1].participants,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
    },
    {
      conversationId: conversations[1].id,
      senderId: playerUsers[0].id,
      messageType: 'text',
      content: '¿Cuál es el formato del torneo?',
      metadata: {},
      isEdited: false,
      isPinned: false,
      isDeleted: false,
      replyToId: null,
      readBy: [playerUsers[0].id, clubUsers[0]?.id || playerUsers[0].id],
      deliveredTo: conversations[1].participants,
      createdAt: new Date(Date.now() - 47 * 60 * 60 * 1000)
    },
    {
      conversationId: conversations[1].id,
      senderId: clubUsers[0]?.id || playerUsers[0].id,
      messageType: 'text',
      content: 'Será eliminación directa, mejor de 3 sets',
      metadata: {},
      isEdited: false,
      isPinned: false,
      isDeleted: false,
      replyToId: 6,
      readBy: [clubUsers[0]?.id || playerUsers[0].id],
      deliveredTo: conversations[1].participants,
      createdAt: new Date(Date.now() - 46 * 60 * 60 * 1000)
    },
    {
      conversationId: conversations[1].id,
      senderId: clubUsers[0]?.id || playerUsers[0].id,
      messageType: 'image',
      content: 'https://example.com/tournament-bracket.jpg',
      metadata: {
        fileName: 'tournament-bracket.jpg',
        fileSize: 245780,
        mimeType: 'image/jpeg',
        dimensions: { width: 1920, height: 1080 }
      },
      isEdited: false,
      isPinned: false,
      isDeleted: false,
      readBy: [clubUsers[0]?.id || playerUsers[0].id],
      deliveredTo: conversations[1].participants,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      conversationId: conversations[1].id,
      senderId: playerUsers[1].id,
      messageType: 'text',
      content: '¡Gracias por la información! 👍',
      metadata: {},
      isEdited: false,
      isPinned: false,
      isDeleted: false,
      readBy: [playerUsers[1].id],
      deliveredTo: conversations[1].participants,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      conversationId: conversations[1].id,
      senderId: clubUsers[0]?.id || playerUsers[0].id,
      messageType: 'text',
      content: 'Recordatorio: El torneo inicia a las 9:00 AM',
      metadata: {},
      isEdited: false,
      isPinned: true,
      isDeleted: false,
      readBy: [clubUsers[0]?.id || playerUsers[0].id],
      deliveredTo: conversations[1].participants,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },

    // Broadcast messages
    {
      conversationId: conversations[2].id,
      senderId: coachUsers[0]?.id || playerUsers[0].id,
      messageType: 'text',
      content: 'Atención estudiantes: Las clases de mañana están canceladas debido al mantenimiento programado de las canchas. Reanudaremos el miércoles.',
      metadata: {
        broadcastId: 'broadcast_001'
      },
      isEdited: false,
      isPinned: false,
      isDeleted: false,
      readBy: [coachUsers[0]?.id || playerUsers[0].id, playerUsers[0].id],
      deliveredTo: conversations[2].participants,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },

    // Deleted message example
    {
      conversationId: conversations[0].id,
      senderId: playerUsers[0].id,
      messageType: 'text',
      content: 'Este mensaje fue eliminado',
      metadata: {},
      isEdited: false,
      isPinned: false,
      isDeleted: true,
      deletedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      deletedBy: playerUsers[0].id,
      readBy: [playerUsers[0].id],
      deliveredTo: [playerUsers[0].id, playerUsers[1].id],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },

    // Edited message example
    {
      conversationId: conversations[0].id,
      senderId: playerUsers[1].id,
      messageType: 'text',
      content: 'Mejor a las 6:30 PM',
      originalContent: 'Mejor a las 7 PM',
      metadata: {},
      isEdited: true,
      editedAt: new Date(Date.now() - 30 * 60 * 1000),
      isPinned: false,
      isDeleted: false,
      readBy: [playerUsers[1].id],
      deliveredTo: [playerUsers[0].id, playerUsers[1].id],
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  ], { returning: true });

  // Create message read status
  const readStatuses = await MessageReadStatus.bulkCreate([
    {
      messageId: messages[0].id,
      userId: playerUsers[0].id,
      readAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
    },
    {
      messageId: messages[1].id,
      userId: playerUsers[0].id,
      readAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
    },
    {
      messageId: messages[1].id,
      userId: playerUsers[1].id,
      readAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
    },
    {
      messageId: messages[2].id,
      userId: playerUsers[0].id,
      readAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      messageId: messages[2].id,
      userId: playerUsers[1].id,
      readAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
    }
  ], { ignoreDuplicates: true });

  // Create message reactions
  const reactions = await MessageReaction.bulkCreate([
    {
      messageId: messages[1].id,
      userId: playerUsers[0].id,
      reaction: '👍',
      createdAt: new Date(Date.now() - 2.4 * 60 * 60 * 1000)
    },
    {
      messageId: messages[8].id,
      userId: playerUsers[0].id,
      reaction: '👍',
      createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000)
    },
    {
      messageId: messages[8].id,
      userId: playerUsers[2]?.id || playerUsers[1].id,
      reaction: '✅',
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000)
    },
    {
      messageId: messages[9].id,
      userId: playerUsers[1].id,
      reaction: '⏰',
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
    }
  ], { ignoreDuplicates: true });

  // Create notification queue entries
  const notificationQueue = await NotificationQueue.bulkCreate([
    {
      userId: playerUsers[1].id,
      type: 'new_message',
      priority: 'high',
      channel: 'push',
      status: 'pending',
      data: {
        conversationId: conversations[0].id,
        messageId: messages[3].id,
        senderName: 'Carlos Rodríguez',
        messagePreview: '¿A qué hora nos vemos mañana?'
      },
      scheduledFor: new Date(),
      metadata: {
        conversationType: 'direct'
      }
    },
    {
      userId: playerUsers[0].id,
      type: 'tournament_reminder',
      priority: 'medium',
      channel: 'email',
      status: 'pending',
      data: {
        tournamentId: 1,
        tournamentName: 'Torneo Primavera 2024',
        startTime: '09:00',
        venue: 'Club Principal'
      },
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      metadata: {
        templateId: 'tournament_reminder_24h'
      }
    },
    {
      userId: playerUsers[2]?.id || playerUsers[0].id,
      type: 'match_request',
      priority: 'medium',
      channel: 'sms',
      status: 'sent',
      data: {
        requesterId: playerUsers[0].id,
        requesterName: 'Carlos Rodríguez',
        playType: 'singles',
        proposedTime: '18:00-20:00'
      },
      scheduledFor: new Date(Date.now() - 6 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      metadata: {
        smsProvider: 'twilio',
        messageId: 'SM123456789'
      }
    },
    {
      userId: playerUsers[1].id,
      type: 'membership_expiry',
      priority: 'high',
      channel: 'email',
      status: 'failed',
      data: {
        membershipType: 'premium',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        renewalLink: 'https://federacionpickleball.mx/renovar'
      },
      scheduledFor: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      failedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      error: 'Invalid email address',
      retryCount: 3,
      metadata: {
        templateId: 'membership_expiry_30d',
        lastRetryAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    },
    {
      userId: playerUsers[0].id,
      type: 'court_reservation_confirmed',
      priority: 'low',
      channel: 'in_app',
      status: 'delivered',
      data: {
        reservationId: 1,
        courtName: 'Cancha Principal CDMX',
        date: '2024-03-15',
        time: '18:00-19:30'
      },
      scheduledFor: new Date(Date.now() - 48 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 47.5 * 60 * 60 * 1000),
      metadata: {
        notificationId: 'notif_12345'
      }
    }
  ], { returning: true });

  console.log(`✅ Seeded ${conversations.length} conversations, ${messages.length} messages, ${readStatuses.length} read statuses, ${reactions.length} reactions, and ${notificationQueue.length} notification queue entries`);
  return { conversations, messages, readStatuses, reactions, notificationQueue };
};

export default seedConversations;