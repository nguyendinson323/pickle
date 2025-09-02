module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('invoices', [
    {
      payment_id: 1, // Subscription payment from Roberto
      invoice_number: 'INV-2024-001',
      user_id: 4, // Roberto Sánchez Torres
      invoice_date: new Date('2024-11-01'),
      due_date: new Date('2024-11-15'),
      subtotal: 119900, // $1,199.00 MXN (before tax)
      tax_amount: 19184, // 16% IVA Mexican tax
      total_amount: 139084, // $1,390.84 MXN total
      currency: 'MXN',
      invoice_status: 'paid',
      payment_terms: '15 days',
      payment_method: 'credit_card',
      billing_address: JSON.stringify({
        name: 'Roberto Sánchez Torres',
        street: 'Av. Constitución 1234, Col. Centro',
        city: 'Monterrey',
        state: 'Nuevo León',
        postal_code: '64000',
        country: 'México',
        rfc: 'SATR880310H97'
      }),
      line_items: JSON.stringify([
        {
          description: 'Suscripción Club - Plan Mensual',
          quantity: 1,
          unit_price: 119900,
          total: 119900,
          service_period: '2024-11-01 to 2024-11-30'
        }
      ]),
      notes: 'Suscripción premium para acceso completo a la plataforma',
      paid_at: new Date('2024-11-02'),
      created_at: now,
      updated_at: now
    },
    {
      payment_id: 2, // Tournament entry fee from María
      invoice_number: 'INV-2024-002',
      user_id: 3, // María González López
      invoice_date: new Date('2024-03-12'),
      due_date: new Date('2024-03-19'),
      subtotal: 75000, // $750.00 MXN
      tax_amount: 12000, // 16% IVA
      total_amount: 87000, // $870.00 MXN total
      currency: 'MXN',
      invoice_status: 'paid',
      payment_terms: '7 days',
      payment_method: 'bank_transfer',
      billing_address: JSON.stringify({
        name: 'María González López',
        street: 'Calle Juárez 567, Col. Americana',
        city: 'Guadalajara',
        state: 'Jalisco',
        postal_code: '44160',
        country: 'México',
        rfc: 'GOLM950822M33'
      }),
      line_items: JSON.stringify([
        {
          description: 'Inscripción Torneo Nacional Primavera - Categoría Intermedio Masculino',
          quantity: 1,
          unit_price: 75000,
          total: 75000,
          event_date: '2024-03-20'
        }
      ]),
      notes: 'Inscripción para torneo clasificatorio nacional',
      paid_at: new Date('2024-03-14'),
      created_at: now,
      updated_at: now
    },
    {
      payment_id: 3, // Court booking payment from Carlos
      invoice_number: 'INV-2024-003',
      user_id: 2, // Carlos Méndez Rivera
      invoice_date: new Date('2024-12-08'),
      due_date: new Date('2024-12-10'),
      subtotal: 60000, // $600.00 MXN
      tax_amount: 9600, // 16% IVA
      total_amount: 69600, // $696.00 MXN total
      currency: 'MXN',
      invoice_status: 'paid',
      payment_terms: '2 days',
      payment_method: 'credit_card',
      billing_address: JSON.stringify({
        name: 'Carlos Méndez Rivera',
        street: 'Insurgentes Sur 2020, Col. Roma Norte',
        city: 'Ciudad de México',
        state: 'Ciudad de México',
        postal_code: '06700',
        country: 'México',
        rfc: 'MERC900515H88'
      }),
      line_items: JSON.stringify([
        {
          description: 'Reserva Cancha A1 - Complejo Roma Norte',
          quantity: 1.5,
          unit_price: 40000,
          total: 60000,
          service_date: '2024-12-10',
          time_slot: '08:00-09:30'
        }
      ]),
      notes: 'Reserva para entrenamiento matutino',
      paid_at: new Date('2024-12-08'),
      created_at: now,
      updated_at: now
    },
    {
      payment_id: null, // Direct invoice (not tied to specific payment yet)
      invoice_number: 'INV-2024-004',
      user_id: 9, // club001
      invoice_date: new Date('2024-12-01'),
      due_date: new Date('2024-12-31'),
      subtotal: 300000, // $3,000.00 MXN
      tax_amount: 48000, // 16% IVA
      total_amount: 348000, // $3,480.00 MXN total
      currency: 'MXN',
      invoice_status: 'pending',
      payment_terms: '30 days',
      payment_method: null,
      billing_address: JSON.stringify({
        name: 'Club Pickleball CDMX',
        contact: 'Roberto García Vega',
        street: 'Polanco 456, Col. Polanco',
        city: 'Ciudad de México',
        state: 'Ciudad de México',
        postal_code: '11550',
        country: 'México',
        rfc: 'CPC240101XYZ'
      }),
      line_items: JSON.stringify([
        {
          description: 'Reserva Masiva Cancha C1 - Torneo Interno Club',
          quantity: 6,
          unit_price: 50000,
          total: 300000,
          service_date: '2024-12-20',
          time_slot: '06:00-12:00'
        }
      ]),
      notes: 'Factura corporativa para evento anual del club',
      paid_at: null,
      created_at: now,
      updated_at: now
    },
    {
      payment_id: 4, // Coaching session payment
      invoice_number: 'INV-2024-005',
      user_id: 2, // Carlos Méndez Rivera
      invoice_date: new Date('2024-12-01'),
      due_date: new Date('2024-12-03'),
      subtotal: 60000, // $600.00 MXN
      tax_amount: 9600, // 16% IVA
      total_amount: 69600, // $696.00 MXN total
      currency: 'MXN',
      invoice_status: 'paid',
      payment_terms: '2 days',
      payment_method: 'debit_card',
      billing_address: JSON.stringify({
        name: 'Carlos Méndez Rivera',
        street: 'Insurgentes Sur 2020, Col. Roma Norte',
        city: 'Ciudad de México',
        state: 'Ciudad de México',
        postal_code: '06700',
        country: 'México',
        rfc: 'MERC900515H88'
      }),
      line_items: JSON.stringify([
        {
          description: 'Sesión de Entrenamiento Personal - Coach Luis Hernández',
          quantity: 2,
          unit_price: 30000,
          total: 60000,
          service_date: '2024-12-05',
          coach: 'Luis Hernández Morales'
        }
      ]),
      notes: 'Entrenamiento personalizado técnica de saque',
      paid_at: new Date('2024-12-02'),
      created_at: now,
      updated_at: now
    },
    {
      payment_id: null, // Overdue invoice
      invoice_number: 'INV-2024-006',
      user_id: 3, // María González López
      invoice_date: new Date('2024-11-15'),
      due_date: new Date('2024-11-30'),
      subtotal: 59900, // $599.00 MXN
      tax_amount: 9584, // 16% IVA
      total_amount: 69484, // $694.84 MXN total
      currency: 'MXN',
      invoice_status: 'overdue',
      payment_terms: '15 days',
      payment_method: null,
      billing_address: JSON.stringify({
        name: 'María González López',
        street: 'Calle Juárez 567, Col. Americana',
        city: 'Guadalajara',
        state: 'Jalisco',
        postal_code: '44160',
        country: 'México',
        rfc: 'GOLM950822M33'
      }),
      line_items: JSON.stringify([
        {
          description: 'Suscripción Pro - Plan Mensual',
          quantity: 1,
          unit_price: 59900,
          total: 59900,
          service_period: '2024-11-15 to 2024-12-15'
        }
      ]),
      notes: 'Factura vencida - aplicar recargos por mora según términos',
      paid_at: null,
      created_at: now,
      updated_at: now
    }
  ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('invoices', {}, {});
  }
};