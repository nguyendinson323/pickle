module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('invoices', [
      {
        invoice_number: 'INV-2024-001',
        user_id: 4, // Roberto Sánchez Torres (player003)
        payment_id: 1,
        membership_plan_id: 2,
        status: 'paid',
        subtotal: 1199.00,
        tax_amount: 191.84,
        total_amount: 1390.84,
        currency: 'mxn',
        description: 'Suscripción Club - Plan Mensual',
        issue_date: new Date('2024-11-01'),
        due_date: new Date('2024-11-15'),
        paid_date: new Date('2024-11-02'),
        pdf_url: null,
        emailed_at: new Date('2024-11-01'),
        metadata: JSON.stringify({
          billing_address: {
            name: 'Roberto Sánchez Torres',
            street: 'Av. Constitución 1234, Col. Centro',
            city: 'Monterrey',
            state: 'Nuevo León',
            postal_code: '64000',
            country: 'México',
            rfc: 'SATR880310H97'
          },
          line_items: [
            {
              description: 'Suscripción Club - Plan Mensual',
              quantity: 1,
              unit_price: 1199.00,
              total: 1199.00,
              service_period: '2024-11-01 to 2024-11-30'
            }
          ],
          payment_method: 'credit_card',
          payment_terms: '15 days',
          notes: 'Suscripción premium para acceso completo a la plataforma'
        }),
        created_at: now,
        updated_at: now
      },
      {
        invoice_number: 'INV-2024-002',
        user_id: 3, // María González López (player002)
        payment_id: 2,
        membership_plan_id: null,
        status: 'paid',
        subtotal: 750.00,
        tax_amount: 120.00,
        total_amount: 870.00,
        currency: 'mxn',
        description: 'Inscripción Torneo Nacional Primavera - Categoría Intermedio',
        issue_date: new Date('2024-03-12'),
        due_date: new Date('2024-03-19'),
        paid_date: new Date('2024-03-14'),
        pdf_url: null,
        emailed_at: new Date('2024-03-12'),
        metadata: JSON.stringify({
          billing_address: {
            name: 'María González López',
            street: 'Calle Juárez 567, Col. Americana',
            city: 'Guadalajara',
            state: 'Jalisco',
            postal_code: '44160',
            country: 'México',
            rfc: 'GOLM950822M33'
          },
          line_items: [
            {
              description: 'Inscripción Torneo Nacional Primavera - Categoría Intermedio',
              quantity: 1,
              unit_price: 750.00,
              total: 750.00,
              event_date: '2024-03-20'
            }
          ],
          payment_method: 'bank_transfer',
          payment_terms: '7 days',
          notes: 'Inscripción para torneo clasificatorio nacional'
        }),
        created_at: now,
        updated_at: now
      },
      {
        invoice_number: 'INV-2024-003',
        user_id: 2, // Carlos Méndez Rivera (player001)
        payment_id: 3,
        membership_plan_id: null,
        status: 'paid',
        subtotal: 600.00,
        tax_amount: 96.00,
        total_amount: 696.00,
        currency: 'mxn',
        description: 'Reserva Cancha A1 - Complejo Roma Norte',
        issue_date: new Date('2024-12-08'),
        due_date: new Date('2024-12-10'),
        paid_date: new Date('2024-12-08'),
        pdf_url: null,
        emailed_at: new Date('2024-12-08'),
        metadata: JSON.stringify({
          billing_address: {
            name: 'Carlos Méndez Rivera',
            street: 'Insurgentes Sur 2020, Col. Roma Norte',
            city: 'Ciudad de México',
            state: 'Ciudad de México',
            postal_code: '06700',
            country: 'México',
            rfc: 'MERC900515H88'
          },
          line_items: [
            {
              description: 'Reserva Cancha A1 - Complejo Roma Norte',
              quantity: 1.5,
              unit_price: 400.00,
              total: 600.00,
              service_date: '2024-12-10',
              time_slot: '08:00-09:30'
            }
          ],
          payment_method: 'credit_card',
          payment_terms: '2 days',
          notes: 'Reserva para entrenamiento matutino'
        }),
        created_at: now,
        updated_at: now
      },
      {
        invoice_number: 'INV-2024-004',
        user_id: 9, // club001
        payment_id: null,
        membership_plan_id: null,
        status: 'sent',
        subtotal: 3000.00,
        tax_amount: 480.00,
        total_amount: 3480.00,
        currency: 'mxn',
        description: 'Reserva Masiva Cancha C1 - Torneo Interno Club',
        issue_date: new Date('2024-12-01'),
        due_date: new Date('2024-12-31'),
        paid_date: null,
        pdf_url: null,
        emailed_at: new Date('2024-12-01'),
        metadata: JSON.stringify({
          billing_address: {
            name: 'Club Pickleball CDMX',
            contact: 'Roberto García Vega',
            street: 'Polanco 456, Col. Polanco',
            city: 'Ciudad de México',
            state: 'Ciudad de México',
            postal_code: '11550',
            country: 'México',
            rfc: 'CPC240101XYZ'
          },
          line_items: [
            {
              description: 'Reserva Masiva Cancha C1 - Torneo Interno Club',
              quantity: 6,
              unit_price: 500.00,
              total: 3000.00,
              service_date: '2024-12-20',
              time_slot: '06:00-12:00'
            }
          ],
          payment_method: null,
          payment_terms: '30 days',
          notes: 'Factura corporativa para evento anual del club'
        }),
        created_at: now,
        updated_at: now
      },
      {
        invoice_number: 'INV-2024-005',
        user_id: 2, // Carlos Méndez Rivera (player001)
        payment_id: 4,
        membership_plan_id: null,
        status: 'paid',
        subtotal: 600.00,
        tax_amount: 96.00,
        total_amount: 696.00,
        currency: 'mxn',
        description: 'Sesión de Entrenamiento Personal - Coach Luis Hernández',
        issue_date: new Date('2024-12-01'),
        due_date: new Date('2024-12-03'),
        paid_date: new Date('2024-12-02'),
        pdf_url: null,
        emailed_at: new Date('2024-12-01'),
        metadata: JSON.stringify({
          billing_address: {
            name: 'Carlos Méndez Rivera',
            street: 'Insurgentes Sur 2020, Col. Roma Norte',
            city: 'Ciudad de México',
            state: 'Ciudad de México',
            postal_code: '06700',
            country: 'México',
            rfc: 'MERC900515H88'
          },
          line_items: [
            {
              description: 'Sesión de Entrenamiento Personal - Coach Luis Hernández',
              quantity: 2,
              unit_price: 300.00,
              total: 600.00,
              service_date: '2024-12-05',
              coach: 'Luis Hernández Morales'
            }
          ],
          payment_method: 'debit_card',
          payment_terms: '2 days',
          notes: 'Entrenamiento personalizado técnica de saque'
        }),
        created_at: now,
        updated_at: now
      },
      {
        invoice_number: 'INV-2024-006',
        user_id: 3, // María González López (player002)
        payment_id: null,
        membership_plan_id: 2,
        status: 'overdue',
        subtotal: 599.00,
        tax_amount: 95.84,
        total_amount: 694.84,
        currency: 'mxn',
        description: 'Suscripción Pro - Plan Mensual',
        issue_date: new Date('2024-11-15'),
        due_date: new Date('2024-11-30'),
        paid_date: null,
        pdf_url: null,
        emailed_at: new Date('2024-11-15'),
        metadata: JSON.stringify({
          billing_address: {
            name: 'María González López',
            street: 'Calle Juárez 567, Col. Americana',
            city: 'Guadalajara',
            state: 'Jalisco',
            postal_code: '44160',
            country: 'México',
            rfc: 'GOLM950822M33'
          },
          line_items: [
            {
              description: 'Suscripción Pro - Plan Mensual',
              quantity: 1,
              unit_price: 599.00,
              total: 599.00,
              service_period: '2024-11-15 to 2024-12-15'
            }
          ],
          payment_method: null,
          payment_terms: '15 days',
          notes: 'Factura vencida - aplicar recargos por mora según términos'
        }),
        created_at: now,
        updated_at: now
      }
    ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('invoices', {}, {});
  }
};