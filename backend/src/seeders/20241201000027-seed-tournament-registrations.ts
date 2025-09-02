module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('tournament_registrations', [
    {
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      category_id: 1, // Principiantes Mixto
      player_id: 2, // Carlos Méndez Rivera (player001)
      partner_id: 3, // María González López (player002)
      registration_date: new Date('2024-03-10'),
      payment_status: 'paid',
      payment_amount: 50000, // $500.00 MXN in cents
      registration_status: 'confirmed',
      emergency_contact: JSON.stringify({
        name: 'Elena Méndez',
        relationship: 'Esposa',
        phone: '+52 55 9876 5432'
      }),
      dietary_restrictions: null,
      special_requirements: null,
      waiver_signed: true,
      waiver_signed_date: new Date('2024-03-10'),
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      category_id: 2, // Intermedio Masculino
      player_id: 4, // Roberto Sánchez Torres (player003)
      partner_id: null, // Singles category
      registration_date: new Date('2024-03-12'),
      payment_status: 'paid',
      payment_amount: 75000, // $750.00 MXN in cents
      registration_status: 'confirmed',
      emergency_contact: JSON.stringify({
        name: 'Laura Sánchez',
        relationship: 'Hermana',
        phone: '+52 81 2222 3333'
      }),
      dietary_restrictions: 'Sin gluten',
      special_requirements: null,
      waiver_signed: true,
      waiver_signed_date: new Date('2024-03-12'),
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 2, // Copa Regional Jalisco 2024
      category_id: 4, // Senior 50+ Mixto
      player_id: 5, // Luis Hernández Morales (coach001 as player)
      partner_id: 6, // Ana Patricia Ruiz Vega (coach002 as player)
      registration_date: new Date('2024-04-05'),
      payment_status: 'pending',
      payment_amount: 60000, // $600.00 MXN in cents
      registration_status: 'provisional',
      emergency_contact: JSON.stringify({
        name: 'Miguel Hernández',
        relationship: 'Hermano',
        phone: '+52 81 5555 6666'
      }),
      dietary_restrictions: null,
      special_requirements: 'Silla de ruedas para espectadores',
      waiver_signed: true,
      waiver_signed_date: new Date('2024-04-05'),
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 3, // Campeonato Nuevo León Open 2024
      category_id: 5, // Profesional Open
      player_id: 4, // Roberto Sánchez Torres (player003)
      partner_id: 2, // Carlos Méndez Rivera (player001)
      registration_date: new Date('2024-05-18'),
      payment_status: 'paid',
      payment_amount: 150000, // $1,500.00 MXN in cents
      registration_status: 'confirmed',
      emergency_contact: JSON.stringify({
        name: 'Dr. Fernando Torres',
        relationship: 'Padre',
        phone: '+52 81 7777 8888'
      }),
      dietary_restrictions: null,
      special_requirements: 'Fisioterapeuta en sitio',
      waiver_signed: true,
      waiver_signed_date: new Date('2024-05-18'),
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      category_id: 1, // Principiantes Mixto
      player_id: 3, // María González López (player002)
      partner_id: 4, // Roberto Sánchez Torres (player003)
      registration_date: new Date('2024-03-14'),
      payment_status: 'refunded',
      payment_amount: 50000, // $500.00 MXN in cents
      registration_status: 'cancelled',
      emergency_contact: JSON.stringify({
        name: 'José González',
        relationship: 'Padre',
        phone: '+52 33 4444 5555'
      }),
      dietary_restrictions: 'Vegetariana',
      special_requirements: null,
      waiver_signed: true,
      waiver_signed_date: new Date('2024-03-14'),
      created_at: now,
      updated_at: now
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tournament_registrations', {}, {});
  }
};