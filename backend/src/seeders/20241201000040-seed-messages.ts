module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const messages = [
      // Messages in conversation 1 (player001 and coach001 match discussion)
      {
        conversation_id: 1,
        sender_id: 2, // player001
        content: 'Hola Carlos, vi que me propusiste un juego para mañana a las 6pm. Me parece perfecto!',
        message_type: 'text',
        reply_to_message_id: null,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        conversation_id: 1,
        sender_id: 5, // coach001
        content: 'Excelente! Te propongo jugar en la cancha principal. Podemos aprovechar para trabajar tu técnica de volea si quieres.',
        message_type: 'text',
        reply_to_message_id: 1,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000 + 5 * 60 * 1000),
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000)
      },
      {
        conversation_id: 1,
        sender_id: 2, // player001
        content: 'Perfecto, nos vemos mañana a las 6pm en la cancha principal',
        message_type: 'text',
        reply_to_message_id: null,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 3 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: null, // Not read yet
        created_at: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 3 * 60 * 60 * 1000)
      },

      // Messages in conversation 2 (Tournament group)
      {
        conversation_id: 2,
        sender_id: 7, // partner001 (organizer)
        content: '¡Bienvenidos al grupo del Torneo de Verano CDMX 2024! Aquí compartiremos toda la información importante del torneo.',
        message_type: 'text',
        reply_to_message_id: null,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        conversation_id: 2,
        sender_id: 2, // player001
        content: 'Gracias por crear el grupo! Muy emocionado por mi primer torneo 🏓',
        message_type: 'text',
        reply_to_message_id: 4,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000),
        created_at: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        updated_at: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000)
      },
      {
        conversation_id: 2,
        sender_id: 7, // partner001
        content: 'Recordatorio: registro mañana desde las 8:00 AM. Favor de llegar con 30 minutos de anticipación.',
        message_type: 'text',
        reply_to_message_id: null,
        attachments: JSON.stringify([{
          type: 'document',
          url: '/uploads/tournaments/tournament_schedule.pdf',
          name: 'Horario_Torneo_Verano_2024.pdf',
          size: 245760
        }]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 6 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 5 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      },

      // Messages in conversation 3 (Club members group)
      {
        conversation_id: 3,
        sender_id: 9, // club001
        content: 'Buenos días miembros! Les informo que hemos recibido nuevas pelotas Penn Championship. Ya están disponibles en recepción.',
        message_type: 'text',
        reply_to_message_id: null,
        attachments: JSON.stringify([{
          type: 'image',
          url: '/uploads/club/new_balls_photo.jpg',
          name: 'nuevas_pelotas.jpg',
          size: 156432
        }]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        conversation_id: 3,
        sender_id: 5, // coach001
        content: 'Perfecto! Las necesitaba para mi clase de mañana. ¿También llegaron las paletas que habían ordenado?',
        message_type: 'text',
        reply_to_message_id: 7,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 15 * 60 * 1000),
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
      },

      // Messages in conversation 4 (Coach-student coordination)
      {
        conversation_id: 4,
        sender_id: 4, // player003
        content: 'Hola Carlos, me gustaria programar clases contigo. Soy principiante total pero tengo muchas ganas de aprender.',
        message_type: 'text',
        reply_to_message_id: null,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        conversation_id: 4,
        sender_id: 5, // coach001
        content: 'Perfecto Roberto! Me gusta trabajar con principiantes motivados. Te propongo empezar con 3 clases para establecer los fundamentos básicos.',
        message_type: 'text',
        reply_to_message_id: 9,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        created_at: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000)
      },
      {
        conversation_id: 4,
        sender_id: 5, // coach001
        content: 'Tu progreso en el saque está siendo excelente, sigamos la próxima semana con la técnica de volea.',
        message_type: 'text',
        reply_to_message_id: null,
        attachments: JSON.stringify([{
          type: 'video',
          url: '/uploads/coaching/roberto_serve_analysis.mp4',
          name: 'analisis_saque_roberto.mp4',
          size: 5678912
        }]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },

      // Messages in conversation 6 (Admin support ticket)
      {
        conversation_id: 6,
        sender_id: 4, // player003
        content: 'Hola, tengo un problema. Cancelé mi reserva por lesión hace 3 días y aún no veo el reembolso. Tengo el certificado médico.',
        message_type: 'text',
        reply_to_message_id: null,
        attachments: JSON.stringify([{
          type: 'document',
          url: '/uploads/support/medical_certificate_roberto.pdf',
          name: 'certificado_medico.pdf',
          size: 234567
        }]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
        created_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        conversation_id: 6,
        sender_id: 1, // admin
        content: 'Hola Roberto, gracias por contactarnos. He revisado tu certificado médico y procederé con el reembolso inmediatamente. El proceso tarda 24-48 horas.',
        message_type: 'text',
        reply_to_message_id: 12,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        conversation_id: 6,
        sender_id: 1, // admin
        content: 'El reembolso ha sido procesado exitosamente. Deberías verlo en tu método de pago en las próximas horas. ¿Hay algo más en lo que pueda ayudarle?',
        message_type: 'text',
        reply_to_message_id: null,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        created_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
      },

      // Messages in conversation 8 (Weekly player group)
      {
        conversation_id: 8,
        sender_id: 3, // player002
        content: 'Hola grupo! ¿Todos listos para nuestro juego de mañana miércoles a las 6pm?',
        message_type: 'text',
        reply_to_message_id: null,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 8 * 60 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 7 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 8 * 60 * 60 * 1000)
      },
      {
        conversation_id: 8,
        sender_id: 2, // player001
        content: '¡Por supuesto! Ya tengo confirmada la cancha Norte. Nos vemos ahí.',
        message_type: 'text',
        reply_to_message_id: 15,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 7 * 60 * 60 * 1000 + 30 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 7 * 60 * 60 * 1000 + 45 * 60 * 1000),
        created_at: new Date(now.getTime() - 7 * 60 * 60 * 1000 + 30 * 60 * 1000),
        updated_at: new Date(now.getTime() - 7 * 60 * 60 * 1000 + 30 * 60 * 1000)
      },
      {
        conversation_id: 8,
        sender_id: 5, // coach001
        content: 'Confirmado! Les traeré algunas pelotas nuevas para probar.',
        message_type: 'text',
        reply_to_message_id: 15,
        attachments: JSON.stringify([]),
        is_edited: false,
        edited_at: null,
        is_deleted: false,
        deleted_at: null,
        delivered_at: new Date(now.getTime() - 6 * 60 * 60 * 1000 + 15 * 60 * 1000 + 1 * 60 * 1000),
        read_at: new Date(now.getTime() - 6 * 60 * 60 * 1000 + 30 * 60 * 1000),
        created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000 + 15 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000 + 15 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('messages', messages);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('messages', {});
  }
};