module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('court_schedules', [
      {
        court_id: 1, // Court A1 at Complejo Deportivo Roma Norte
        day_of_week: 'Monday',
        start_time: '06:00:00',
        end_time: '22:00:00',
        is_available: true,
        special_pricing: JSON.stringify({
          morning_rate: 30000, // $300.00 MXN in cents
          afternoon_rate: 40000, // $400.00 MXN
          evening_rate: 50000 // $500.00 MXN
        }),
        created_at: now,
        updated_at: now
      },
      {
        court_id: 1, // Court A1 at Complejo Deportivo Roma Norte
        day_of_week: 'Tuesday',
        start_time: '06:00:00',
        end_time: '22:00:00',
        is_available: true,
        special_pricing: JSON.stringify({
          morning_rate: 30000,
          afternoon_rate: 40000,
          evening_rate: 50000
        }),
        created_at: now,
        updated_at: now
      },
      {
        court_id: 2, // Court A2 at Complejo Deportivo Roma Norte
        day_of_week: 'Wednesday',
        start_time: '07:00:00',
        end_time: '21:00:00',
        is_available: true,
        special_pricing: JSON.stringify({
          morning_rate: 35000, // $350.00 MXN
          afternoon_rate: 45000, // $450.00 MXN
          evening_rate: 55000 // $550.00 MXN
        }),
        created_at: now,
        updated_at: now
      },
      {
        court_id: 3, // Court B1 at Club Pickleball Polanco
        day_of_week: 'Saturday',
        start_time: '08:00:00',
        end_time: '20:00:00',
        is_available: true,
        special_pricing: JSON.stringify({
          weekend_rate: 60000 // $600.00 MXN premium weekend rate
        }),
        created_at: now,
        updated_at: now
      },
      {
        court_id: 4, // Court C1 at Centro Deportivo Guadalajara
        day_of_week: 'Sunday',
        start_time: '09:00:00',
        end_time: '19:00:00',
        is_available: true,
        special_pricing: JSON.stringify({
          weekend_rate: 55000 // $550.00 MXN weekend rate
        }),
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('court_schedules', null, {});
  }
};