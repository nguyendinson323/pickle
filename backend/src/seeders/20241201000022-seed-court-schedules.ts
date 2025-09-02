module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Create schedules for the next 7 days
    const today = new Date();
    const schedules = [];
    
    for (let i = 0; i < 7; i++) {
      const scheduleDate = new Date(today);
      scheduleDate.setDate(today.getDate() + i);
      const dateString = scheduleDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Court 1 - Full day availability
      schedules.push({
        court_id: 1,
        date: dateString,
        start_time: '06:00:00',
        end_time: '22:00:00',
        is_blocked: false,
        block_type: null,
        block_reason: null,
        special_rate: null,
        notes: 'Regular availability',
        created_at: now,
        updated_at: now
      });
      
      // Court 2 - Morning blocked for maintenance
      if (i === 1) { // Tomorrow
        schedules.push({
          court_id: 2,
          date: dateString,
          start_time: '06:00:00',
          end_time: '10:00:00',
          is_blocked: true,
          block_type: 'maintenance',
          block_reason: 'Routine court maintenance and cleaning',
          special_rate: null,
          notes: 'Court maintenance scheduled',
          created_at: now,
          updated_at: now
        });
        
        schedules.push({
          court_id: 2,
          date: dateString,
          start_time: '10:00:00',
          end_time: '21:00:00',
          is_blocked: false,
          block_type: null,
          block_reason: null,
          special_rate: 45.00, // Special rate
          notes: 'Available after maintenance',
          created_at: now,
          updated_at: now
        });
      } else {
        schedules.push({
          court_id: 2,
          date: dateString,
          start_time: '07:00:00',
          end_time: '21:00:00',
          is_blocked: false,
          block_type: null,
          block_reason: null,
          special_rate: null,
          notes: 'Regular availability',
          created_at: now,
          updated_at: now
        });
      }
      
      // Court 3 - Weekend has special rates
      if (i === 5 || i === 6) { // Weekend
        schedules.push({
          court_id: 3,
          date: dateString,
          start_time: '08:00:00',
          end_time: '20:00:00',
          is_blocked: false,
          block_type: null,
          block_reason: null,
          special_rate: 60.00, // Weekend premium rate
          notes: 'Weekend premium pricing',
          created_at: now,
          updated_at: now
        });
      } else {
        schedules.push({
          court_id: 3,
          date: dateString,
          start_time: '08:00:00',
          end_time: '20:00:00',
          is_blocked: false,
          block_type: null,
          block_reason: null,
          special_rate: null,
          notes: 'Regular availability',
          created_at: now,
          updated_at: now
        });
      }
    }
    
    await queryInterface.bulkInsert('court_schedules', schedules);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('court_schedules', {});
  }
};