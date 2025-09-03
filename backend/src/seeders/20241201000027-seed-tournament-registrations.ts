module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('tournament_registrations', [
      // Tournament 1 - Category 1 (Principiantes Mixto Dobles)
      {
        tournament_id: 1,
        category_id: 1, // Principiantes Mixto Dobles
        player_id: 2, // player001
        partner_id: 3, // player002 
        status: 'paid',
        registration_date: new Date('2024-11-10'),
        payment_id: null,
        amount_paid: 300.00, // Entry fee for this category
        seed_number: 1,
        notes: 'Primera vez en torneo oficial',
        emergency_contact: JSON.stringify({
          name: 'Juan Pérez Méndez',
          relationship: 'Padre',
          phone: '+52 55 9876 5432',
          email: 'juan.perez@email.com'
        }),
        medical_information: 'Sin alergias conocidas',
        tshirt_size: 'M',
        dietary_restrictions: null,
        transportation_needs: null,
        accommodation_needs: null,
        waiver_signed: true,
        waiver_signed_date: new Date('2024-11-10'),
        check_in_time: null,
        is_checked_in: false,
        withdrawal_reason: null,
        withdrawal_date: null,
        refund_amount: null,
        refund_processed_date: null,
        created_at: new Date('2024-11-10'),
        updated_at: new Date('2024-11-10')
      },
      
      // Tournament 1 - Category 2 (Intermedio Masculino Dobles) 
      {
        tournament_id: 1,
        category_id: 2, // Intermedio Masculino Dobles
        player_id: 4, // player003 (Roberto)
        partner_id: 5, // coach001 (Luis playing as player)
        status: 'confirmed',
        registration_date: new Date('2024-11-12'),
        payment_id: null,
        amount_paid: 500.00, // Entry fee for this category
        seed_number: 3,
        notes: 'Experiencia en torneos regionales',
        emergency_contact: JSON.stringify({
          name: 'Patricia Sánchez',
          relationship: 'Esposa',
          phone: '+52 55 1111 2222',
          email: 'patricia.s@email.com'
        }),
        medical_information: 'Lesión previa en rodilla izquierda - rehabilitada',
        tshirt_size: 'L',
        dietary_restrictions: 'Vegetariano',
        transportation_needs: null,
        accommodation_needs: null,
        waiver_signed: true,
        waiver_signed_date: new Date('2024-11-12'),
        check_in_time: null,
        is_checked_in: false,
        withdrawal_reason: null,
        withdrawal_date: null,
        refund_amount: null,
        refund_processed_date: null,
        created_at: new Date('2024-11-12'),
        updated_at: new Date('2024-11-12')
      },
      
      // Tournament 1 - Category 3 (Avanzado Femenil Singles)
      {
        tournament_id: 1,
        category_id: 3, // Avanzado Femenil Singles
        player_id: 3, // player002 (María)
        partner_id: null, // Singles category
        status: 'paid',
        registration_date: new Date('2024-11-08'),
        payment_id: null,
        amount_paid: 600.00, // Entry fee for singles category
        seed_number: 2,
        notes: 'Campeona regional 2023',
        emergency_contact: JSON.stringify({
          name: 'Carmen López',
          relationship: 'Madre',
          phone: '+52 55 3333 4444',
          email: 'carmen.lopez@email.com'
        }),
        medical_information: null,
        tshirt_size: 'S',
        dietary_restrictions: 'Sin gluten',
        transportation_needs: null,
        accommodation_needs: 'Hotel recomendado cerca del venue',
        waiver_signed: true,
        waiver_signed_date: new Date('2024-11-08'),
        check_in_time: null,
        is_checked_in: false,
        withdrawal_reason: null,
        withdrawal_date: null,
        refund_amount: null,
        refund_processed_date: null,
        created_at: new Date('2024-11-08'),
        updated_at: new Date('2024-11-08')
      },
      
      // Tournament 2 - Category 4 (Senior 50+ Mixto Dobles) - Pending payment
      {
        tournament_id: 2,
        category_id: 4, // Senior 50+ Mixto Dobles
        player_id: 6, // coach002 (Ana playing as player)
        partner_id: 5, // coach001 (Luis as partner)
        status: 'pending',
        registration_date: new Date('2024-11-15'),
        payment_id: null,
        amount_paid: 0.00, // Not yet paid
        seed_number: null,
        notes: 'Esperando confirmación de pago',
        emergency_contact: JSON.stringify({
          name: 'Fernando Ruiz',
          relationship: 'Esposo',
          phone: '+52 55 5555 6666',
          email: 'fernando.ruiz@email.com'
        }),
        medical_information: 'Presión arterial controlada con medicamento',
        tshirt_size: 'M',
        dietary_restrictions: 'Diabética - dieta baja en azúcar',
        transportation_needs: 'Requiere transporte desde aeropuerto',
        accommodation_needs: 'Habitación accesible planta baja',
        waiver_signed: true,
        waiver_signed_date: new Date('2024-11-15'),
        check_in_time: null,
        is_checked_in: false,
        withdrawal_reason: null,
        withdrawal_date: null,
        refund_amount: null,
        refund_processed_date: null,
        created_at: new Date('2024-11-15'),
        updated_at: new Date('2024-11-15')
      },
      
      // Tournament 3 - Category 5 (Open Profesional Singles) - Cancelled registration
      {
        tournament_id: 3,
        category_id: 5, // Open Profesional Singles
        player_id: 2, // player001
        partner_id: null, // Singles
        status: 'cancelled',
        registration_date: new Date('2024-10-20'),
        payment_id: null,
        amount_paid: 1000.00, // Had paid but got refund
        seed_number: null,
        notes: 'Cancelación por lesión',
        emergency_contact: JSON.stringify({
          name: 'Juan Pérez Méndez',
          relationship: 'Padre',
          phone: '+52 55 9876 5432',
          email: 'juan.perez@email.com'
        }),
        medical_information: 'Lesión en tobillo - requiere rehabilitación',
        tshirt_size: 'M',
        dietary_restrictions: null,
        transportation_needs: null,
        accommodation_needs: null,
        waiver_signed: true,
        waiver_signed_date: new Date('2024-10-20'),
        check_in_time: null,
        is_checked_in: false,
        withdrawal_reason: 'Lesión deportiva en tobillo derecho',
        withdrawal_date: new Date('2024-11-01'),
        refund_amount: 800.00, // 80% refund policy
        refund_processed_date: new Date('2024-11-05'),
        created_at: new Date('2024-10-20'),
        updated_at: new Date('2024-11-05')
      },
      
      // Tournament 3 - Category 6 (Open Profesional Dobles Mixtos) - Waitlisted
      {
        tournament_id: 3,
        category_id: 6, // Open Profesional Dobles Mixtos
        player_id: 4, // player003
        partner_id: 3, // player002
        status: 'waitlisted',
        registration_date: new Date('2024-11-20'),
        payment_id: null,
        amount_paid: 0.00, // Payment on hold until confirmed
        seed_number: null,
        notes: 'En lista de espera - categoría llena',
        emergency_contact: JSON.stringify({
          name: 'Patricia Sánchez',
          relationship: 'Esposa',
          phone: '+52 55 1111 2222',
          email: 'patricia.s@email.com'
        }),
        medical_information: null,
        tshirt_size: 'L',
        dietary_restrictions: null,
        transportation_needs: null,
        accommodation_needs: null,
        waiver_signed: false, // Will sign when confirmed
        waiver_signed_date: null,
        check_in_time: null,
        is_checked_in: false,
        withdrawal_reason: null,
        withdrawal_date: null,
        refund_amount: null,
        refund_processed_date: null,
        created_at: new Date('2024-11-20'),
        updated_at: new Date('2024-11-20')
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tournament_registrations', {});
  }
};