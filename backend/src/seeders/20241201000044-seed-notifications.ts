module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const notifications = [
      // Tournament registration confirmations
      {
        user_id: 3, // player001
        type: 'tournament',
        category: 'success',
        title: 'Registro confirmado en torneo',
        message: 'Tu registro en el "Torneo de Verano Ciudad de México 2024" ha sido confirmado exitosamente.',
        action_text: 'Ver detalles',
        action_url: '/tournaments/1',
        related_entity_type: 'tournament',
        related_entity_id: 1,
        metadata: JSON.stringify({
          tournament_id: 1,
          tournament_name: 'Torneo de Verano Ciudad de México 2024',
          category: 'intermediate',
          start_date: '2024-12-17',
          venue: 'Complejo Deportivo Roma Norte'
        }),
        is_read: true,
        read_at: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000),
        channels: JSON.stringify({
          inApp: true,
          email: true,
          sms: false,
          push: true
        }),
        delivery_status: JSON.stringify({
          inApp: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
          },
          email: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
          },
          sms: { delivered: false },
          push: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
          }
        }),
        scheduled_for: null,
        is_scheduled: false,
        expires_at: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: 5, // coach001
        type: 'tournament',
        category: 'success',
        title: 'Registro confirmado - Campeonato Estatal',
        message: 'Tu registro en el "Campeonato Estatal CDMX 2024" ha sido confirmado. Recibirás más información próximamente.',
        action_text: 'Ver campeonato',
        action_url: '/tournaments/2',
        related_entity_type: 'tournament',
        related_entity_id: 2,
        metadata: JSON.stringify({
          tournament_id: 2,
          tournament_name: 'Campeonato Estatal CDMX 2024',
          category: 'advanced',
          start_date: '2025-03-02',
          venue: 'Centro Deportivo Polanco Elite',
          requires_medical_certificate: true
        }),
        is_read: false,
        read_at: null,
        channels: JSON.stringify({
          inApp: true,
          email: true,
          sms: true,
          push: true
        }),
        delivery_status: JSON.stringify({
          inApp: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)
          },
          email: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)
          },
          sms: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)
          },
          push: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)
          }
        }),
        scheduled_for: null,
        is_scheduled: false,
        expires_at: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)
      },
      // Payment notifications
      {
        user_id: 4, // player002
        type: 'payment',
        category: 'success',
        title: 'Pago procesado exitosamente',
        message: 'Hemos recibido tu pago de $499.00 MXN por tu suscripción mensual Plan Pro.',
        action_text: 'Ver factura',
        action_url: '/payments/2/receipt',
        related_entity_type: 'payment',
        related_entity_id: 2,
        metadata: JSON.stringify({
          payment_id: 2,
          amount: 49900,
          currency: 'MXN',
          description: 'Suscripción mensual - Plan Pro',
          next_billing_date: '2024-12-02'
        }),
        is_read: true,
        read_at: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
        channels: JSON.stringify({
          inApp: true,
          email: true,
          sms: false,
          push: false
        }),
        delivery_status: JSON.stringify({
          inApp: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
          },
          email: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
          },
          sms: { delivered: false },
          push: { delivered: false }
        }),
        scheduled_for: null,
        is_scheduled: false,
        expires_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: 4, // player002
        type: 'payment',
        category: 'error',
        title: 'Problema con tu pago',
        message: 'No pudimos procesar tu pago para la suscripción mensual. Por favor actualiza tu método de pago.',
        action_text: 'Actualizar pago',
        action_url: '/payment-methods',
        related_entity_type: 'payment',
        related_entity_id: 9,
        metadata: JSON.stringify({
          payment_id: 9,
          amount: 19900,
          currency: 'MXN',
          failure_reason: 'card_declined',
          retry_date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
        }),
        is_read: false,
        read_at: null,
        channels: JSON.stringify({
          inApp: true,
          email: true,
          sms: true,
          push: true
        }),
        delivery_status: JSON.stringify({
          inApp: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
          },
          email: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
          },
          sms: { 
            delivered: false,
            error: 'Invalid phone number format'
          },
          push: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
          }
        }),
        scheduled_for: null,
        is_scheduled: false,
        expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
      },
      // Court booking confirmations
      {
        user_id: 4, // player002
        type: 'booking',
        category: 'success',
        title: 'Reserva de cancha confirmada',
        message: 'Tu reserva en Cancha Norte para el 15 de noviembre de 14:00 a 16:00 ha sido confirmada.',
        action_text: 'Ver reserva',
        action_url: '/bookings/1',
        related_entity_type: 'court_booking',
        related_entity_id: 1,
        metadata: JSON.stringify({
          court_id: 2,
          court_name: 'Cancha Norte',
          facility: 'Complejo Deportivo Roma Norte',
          booking_date: '2024-11-15',
          start_time: '14:00',
          end_time: '16:00',
          total_cost: 12000
        }),
        is_read: true,
        read_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        channels: JSON.stringify({
          inApp: true,
          email: true,
          sms: false,
          push: true
        }),
        delivery_status: JSON.stringify({
          inApp: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000)
          },
          email: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000)
          },
          sms: { delivered: false },
          push: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000)
          }
        }),
        scheduled_for: null,
        is_scheduled: false,
        expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      // System notifications
      {
        user_id: 3, // player001
        type: 'system',
        category: 'warning',
        title: 'Tu suscripción vence pronto',
        message: 'Tu suscripción Plan Básico vence el 17 de noviembre. Renuévala para continuar disfrutando todos los beneficios.',
        action_text: 'Renovar ahora',
        action_url: '/subscriptions/renew',
        metadata: JSON.stringify({
          subscription_id: 1,
          plan_name: 'Básico',
          expiry_date: '2024-11-17',
          upgrade_options: ['Pro', 'Club']
        }),
        is_read: false,
        read_at: null,
        channels: JSON.stringify({
          inApp: true,
          email: true,
          sms: false,
          push: true
        }),
        delivery_status: JSON.stringify({
          inApp: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
          },
          email: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
          },
          sms: { delivered: false },
          push: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
          }
        }),
        scheduled_for: null,
        is_scheduled: false,
        expires_at: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      // Tournament reminders (scheduled notification)
      {
        user_id: 3, // player001
        type: 'tournament',
        category: 'info',
        title: 'Recordatorio: Torneo mañana',
        message: 'No olvides que el "Torneo de Verano Ciudad de México 2024" comienza mañana a las 9:00 AM.',
        action_text: 'Ver preparativos',
        action_url: '/tournaments/1/checklist',
        related_entity_type: 'tournament',
        related_entity_id: 1,
        metadata: JSON.stringify({
          tournament_id: 1,
          tournament_name: 'Torneo de Verano Ciudad de México 2024',
          start_date: '2024-12-17',
          start_time: '09:00',
          venue: 'Complejo Deportivo Roma Norte',
          checkin_time: '08:30',
          what_to_bring: ['Identificación oficial', 'Paletas', 'Ropa deportiva', 'Toalla']
        }),
        is_read: false,
        read_at: null,
        channels: JSON.stringify({
          inApp: true,
          email: true,
          sms: true,
          push: true
        }),
        delivery_status: JSON.stringify({
          inApp: { delivered: false },
          email: { delivered: false },
          sms: { delivered: false },
          push: { delivered: false }
        }),
        scheduled_for: new Date(now.getTime() + 44 * 24 * 60 * 60 * 1000),
        is_scheduled: true,
        expires_at: new Date(now.getTime() + 47 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
      },
      // Match found notification
      {
        user_id: 4, // player002
        type: 'match',
        category: 'info',
        title: '¡Oponente encontrado!',
        message: 'Hemos encontrado un oponente para ti: Juan García (Nivel: Intermedio). ¿Estás disponible el sábado?',
        action_text: 'Aceptar partida',
        action_url: '/matches/accept/123',
        metadata: JSON.stringify({
          opponent_id: 3,
          opponent_name: 'Juan Pérez',
          opponent_level: 'intermediate',
          suggested_date: '2024-11-16',
          suggested_time: '10:00',
          suggested_court: 'Cancha Norte',
          match_duration: 90
        }),
        is_read: false,
        read_at: null,
        channels: JSON.stringify({
          inApp: true,
          email: false,
          sms: false,
          push: true
        }),
        delivery_status: JSON.stringify({
          inApp: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 6 * 60 * 60 * 1000)
          },
          email: { delivered: false },
          sms: { delivered: false },
          push: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 6 * 60 * 60 * 1000)
          }
        }),
        scheduled_for: null,
        is_scheduled: false,
        expires_at: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      },
      // Maintenance notification
      {
        user_id: 9, // club001
        type: 'maintenance',
        category: 'warning',
        title: 'Mantenimiento programado del sistema',
        message: 'El sistema estará en mantenimiento el domingo 17 de noviembre de 2:00 AM a 6:00 AM. Disculpe las molestias.',
        metadata: JSON.stringify({
          maintenance_start: '2024-11-17 02:00:00',
          maintenance_end: '2024-11-17 06:00:00',
          affected_services: ['Court bookings', 'Payment processing', 'Mobile app sync'],
          alternative_contact: '+52 55 1234-5678'
        }),
        is_read: false,
        read_at: null,
        channels: JSON.stringify({
          inApp: true,
          email: true,
          sms: false,
          push: false
        }),
        delivery_status: JSON.stringify({
          inApp: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
          },
          email: { 
            delivered: true, 
            deliveredAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
          },
          sms: { delivered: false },
          push: { delivered: false }
        }),
        scheduled_for: null,
        is_scheduled: false,
        expires_at: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('notifications', notifications);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', {});
  }
};
