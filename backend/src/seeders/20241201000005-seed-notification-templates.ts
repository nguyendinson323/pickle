module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const templates = [
      {
        name: 'tournament_registration_confirmation',
        type: 'tournament_registration_confirmation',
        category: 'tournament',
        templates: JSON.stringify({
          inApp: {
            title: 'Registro Confirmado',
            message: 'Tu registro en el torneo "{{tournament_name}}" ha sido confirmado exitosamente.',
            actionText: 'Ver Torneo'
          },
          email: {
            subject: 'Registro confirmado - {{tournament_name}}',
            htmlContent: '<h2>¡Registro Confirmado!</h2><p>Hola <strong>{{player_name}}</strong>,</p><p>Tu registro en el torneo "<strong>{{tournament_name}}</strong>" ha sido confirmado exitosamente.</p><p><strong>Fecha:</strong> {{tournament_date}}</p><p><strong>Ubicación:</strong> {{tournament_location}}</p>',
            textContent: 'Hola {{player_name}}, tu registro en el torneo "{{tournament_name}}" ha sido confirmado exitosamente. Fecha: {{tournament_date}}. Ubicación: {{tournament_location}}'
          },
          sms: {
            message: 'Registro confirmado en torneo {{tournament_name}} el {{tournament_date}}. ¡Nos vemos ahí!'
          },
          push: {
            title: 'Registro Confirmado',
            body: 'Tu registro en {{tournament_name}} ha sido confirmado',
            icon: 'tournament'
          }
        }),
        variables: JSON.stringify([
          {
            name: 'player_name',
            description: 'Nombre del jugador',
            type: 'string',
            required: true
          },
          {
            name: 'tournament_name',
            description: 'Nombre del torneo',
            type: 'string',
            required: true
          },
          {
            name: 'tournament_date',
            description: 'Fecha del torneo',
            type: 'date',
            required: true
          },
          {
            name: 'tournament_location',
            description: 'Ubicación del torneo',
            type: 'string',
            required: true
          }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: 'court_reservation_confirmed',
        type: 'court_reservation_confirmed',
        category: 'booking',
        templates: JSON.stringify({
          inApp: {
            title: 'Reserva Confirmada',
            message: 'Tu reserva en {{court_name}} para el {{booking_date}} ha sido confirmada.',
            actionText: 'Ver Reserva'
          },
          email: {
            subject: 'Reserva confirmada - {{court_name}}',
            htmlContent: '<h2>Reserva Confirmada</h2><p>Tu reserva en <strong>{{court_name}}</strong> para el <strong>{{booking_date}}</strong> de <strong>{{start_time}}</strong> a <strong>{{end_time}}</strong> ha sido confirmada.</p><p><strong>Costo total:</strong> ${{total_cost}}</p>',
            textContent: 'Tu reserva en {{court_name}} para el {{booking_date}} de {{start_time}} a {{end_time}} ha sido confirmada. Costo total: ${{total_cost}}'
          },
          sms: {
            message: 'Reserva confirmada en {{court_name}} el {{booking_date}} de {{start_time}} a {{end_time}}'
          },
          push: {
            title: 'Reserva Confirmada',
            body: 'Tu reserva en {{court_name}} ha sido confirmada',
            icon: 'court'
          }
        }),
        variables: JSON.stringify([
          {
            name: 'court_name',
            description: 'Nombre de la cancha',
            type: 'string',
            required: true
          },
          {
            name: 'booking_date',
            description: 'Fecha de la reserva',
            type: 'date',
            required: true
          },
          {
            name: 'start_time',
            description: 'Hora de inicio',
            type: 'string',
            required: true
          },
          {
            name: 'end_time',
            description: 'Hora de finalización',
            type: 'string',
            required: true
          },
          {
            name: 'total_cost',
            description: 'Costo total',
            type: 'number',
            required: true
          }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: 'payment_received_confirmation',
        type: 'payment_received_confirmation', 
        category: 'payment',
        templates: JSON.stringify({
          inApp: {
            title: 'Pago Recibido',
            message: 'Tu pago de ${{amount}} ha sido procesado exitosamente.',
            actionText: 'Ver Recibo'
          },
          email: {
            subject: 'Confirmación de pago - ${{amount}}',
            htmlContent: '<h2>Pago Procesado</h2><p>Hemos recibido tu pago de <strong>${{amount}} {{currency}}</strong>.</p><p><strong>Método:</strong> {{payment_method}}</p><p><strong>Fecha:</strong> {{payment_date}}</p>',
            textContent: 'Hemos recibido tu pago de ${{amount}} {{currency}}. Método: {{payment_method}}. Fecha: {{payment_date}}'
          },
          sms: {
            message: 'Pago de ${{amount}} procesado exitosamente. Referencia: {{payment_id}}'
          },
          push: {
            title: 'Pago Confirmado',
            body: 'Tu pago de ${{amount}} ha sido procesado',
            icon: 'payment'
          }
        }),
        variables: JSON.stringify([
          {
            name: 'amount',
            description: 'Monto del pago',
            type: 'number',
            required: true
          },
          {
            name: 'currency',
            description: 'Moneda',
            type: 'string',
            required: true
          },
          {
            name: 'payment_method',
            description: 'Método de pago',
            type: 'string',
            required: true
          },
          {
            name: 'payment_date',
            description: 'Fecha del pago',
            type: 'date',
            required: true
          },
          {
            name: 'payment_id',
            description: 'ID del pago',
            type: 'string',
            required: true
          }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: 'new_message_notification',
        type: 'new_message_notification',
        category: 'message',
        templates: JSON.stringify({
          inApp: {
            title: 'Nuevo Mensaje',
            message: 'Tienes un nuevo mensaje de {{sender_name}}',
            actionText: 'Ver Mensaje'
          },
          email: {
            subject: 'Nuevo mensaje de {{sender_name}}',
            htmlContent: '<h2>Nuevo Mensaje</h2><p>Has recibido un nuevo mensaje de <strong>{{sender_name}}</strong>:</p><blockquote>{{message_preview}}</blockquote>',
            textContent: 'Has recibido un nuevo mensaje de {{sender_name}}: {{message_preview}}'
          },
          sms: {
            message: 'Nuevo mensaje de {{sender_name}} en la plataforma'
          },
          push: {
            title: 'Nuevo Mensaje',
            body: '{{sender_name}}: {{message_preview}}',
            icon: 'message'
          }
        }),
        variables: JSON.stringify([
          {
            name: 'sender_name',
            description: 'Nombre del remitente',
            type: 'string',
            required: true
          },
          {
            name: 'message_preview',
            description: 'Vista previa del mensaje',
            type: 'string',
            required: true
          }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: 'system_maintenance_notification',
        type: 'system_maintenance_notification',
        category: 'system',
        templates: JSON.stringify({
          inApp: {
            title: 'Mantenimiento del Sistema',
            message: 'El sistema estará en mantenimiento el {{maintenance_date}} de {{start_time}} a {{end_time}}',
            actionText: 'Más Info'
          },
          email: {
            subject: 'Mantenimiento programado - {{maintenance_date}}',
            htmlContent: '<h2>Mantenimiento Programado</h2><p>El sistema estará en mantenimiento el <strong>{{maintenance_date}}</strong> de <strong>{{start_time}}</strong> a <strong>{{end_time}}</strong>.</p><p>{{description}}</p>',
            textContent: 'El sistema estará en mantenimiento el {{maintenance_date}} de {{start_time}} a {{end_time}}. {{description}}'
          },
          sms: {
            message: 'Mantenimiento del sistema programado para {{maintenance_date}} de {{start_time}} a {{end_time}}'
          },
          push: {
            title: 'Mantenimiento Programado',
            body: 'Sistema en mantenimiento el {{maintenance_date}}',
            icon: 'system'
          }
        }),
        variables: JSON.stringify([
          {
            name: 'maintenance_date',
            description: 'Fecha de mantenimiento',
            type: 'date',
            required: true
          },
          {
            name: 'start_time',
            description: 'Hora de inicio',
            type: 'string',
            required: true
          },
          {
            name: 'end_time',
            description: 'Hora de finalización',
            type: 'string',
            required: true
          },
          {
            name: 'description',
            description: 'Descripción del mantenimiento',
            type: 'string',
            required: false
          }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('notification_templates', templates);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notification_templates', {});
  }
};