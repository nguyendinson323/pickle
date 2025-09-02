module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const maintenanceRecords = [
      {
        court_id: 1, // Court A1 at Complejo Deportivo Roma Norte
        facility_id: 1, // Complejo Deportivo Roma Norte
        maintenance_type: 'cleaning',
        priority: 'medium',
        status: 'completed',
        title: 'Limpieza profunda de superficie',
        description: 'Limpieza profunda de la superficie de juego y reemplazo de líneas desgastadas',
        scheduled_date: '2024-11-15',
        scheduled_start_time: '08:00:00',
        scheduled_end_time: '12:00:00',
        estimated_duration: 240, // minutes
        actual_start_time: new Date('2024-11-15T08:00:00'),
        actual_end_time: new Date('2024-11-15T11:30:00'),
        actual_duration: 210, // minutes
        assigned_to: JSON.stringify([
          {
            name: 'Mario Rodríguez',
            role: 'Técnico de Limpieza',
            contact: '+52 55 1234 5678'
          }
        ]),
        work_performed: JSON.stringify([
          'Limpieza superficie de juego',
          'Reemplazo líneas desgastadas',
          'Aplicación tratamiento antideslizante'
        ]),
        cost: JSON.stringify({
          labor: 150000, // $1,500.00 MXN in cents
          materials: 100000, // $1,000.00 MXN in cents
          total: 250000 // $2,500.00 MXN in cents
        }),
        quality_check: JSON.stringify({
          inspector: 'Ana García',
          passed: true,
          score: 95,
          notes: 'Trabajo excelente, superficie en perfecto estado'
        }),
        affected_bookings: JSON.stringify([]),
        safety_measures: JSON.stringify([
          'Señalización de área de trabajo',
          'Uso de equipos de protección',
          'Ventilación adecuada'
        ]),
        approvals: JSON.stringify({
          supervisor: 'Carlos Manager',
          approved_at: '2024-11-15T11:45:00',
          approved: true
        }),
        before_photos: JSON.stringify([
          '/maintenance/before/court1_20241115_1.jpg',
          '/maintenance/before/court1_20241115_2.jpg'
        ]),
        after_photos: JSON.stringify([
          '/maintenance/after/court1_20241115_1.jpg',
          '/maintenance/after/court1_20241115_2.jpg'
        ]),
        documents: JSON.stringify([
          '/maintenance/reports/court1_cleaning_20241115.pdf'
        ]),
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        court_id: 2, // Court A2 at Complejo Deportivo Roma Norte
        facility_id: 1, // Complejo Deportivo Roma Norte
        maintenance_type: 'repair',
        priority: 'high',
        status: 'completed',
        title: 'Reparación de red',
        description: 'Reemplazo de red principal y tensores laterales por desgaste',
        scheduled_date: '2024-11-20',
        scheduled_start_time: '09:00:00',
        scheduled_end_time: '11:00:00',
        estimated_duration: 120, // minutes
        actual_start_time: new Date('2024-11-20T09:00:00'),
        actual_end_time: new Date('2024-11-20T10:45:00'),
        actual_duration: 105, // minutes
        assigned_to: JSON.stringify([
          {
            name: 'José Luis Hernández',
            role: 'Técnico Especialista',
            contact: '+52 55 9876 5432'
          }
        ]),
        work_performed: JSON.stringify([
          'Reemplazo red principal',
          'Instalación tensores laterales',
          'Calibración altura red'
        ]),
        cost: JSON.stringify({
          labor: 80000, // $800.00 MXN in cents
          materials: 100000, // $1,000.00 MXN in cents
          total: 180000 // $1,800.00 MXN in cents
        }),
        quality_check: JSON.stringify({
          inspector: 'Mario Supervisor',
          passed: true,
          score: 98,
          notes: 'Red instalada perfectamente, tensión óptima'
        }),
        affected_bookings: JSON.stringify([
          { booking_id: 123, rescheduled: true, new_time: '14:00:00' }
        ]),
        safety_measures: JSON.stringify([
          'Área acordonada',
          'Herramientas especializadas',
          'Revisión final de seguridad'
        ]),
        approvals: JSON.stringify({
          supervisor: 'Mario Supervisor',
          approved_at: '2024-11-20T11:00:00',
          approved: true
        }),
        before_photos: JSON.stringify([]),
        after_photos: JSON.stringify([
          '/maintenance/after/court2_net_20241120.jpg'
        ]),
        documents: JSON.stringify([]),
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        court_id: 3, // Court B1 at Centro Deportivo Polanco Elite
        facility_id: 2, // Centro Deportivo Polanco Elite
        maintenance_type: 'repair',
        priority: 'urgent',
        status: 'scheduled',
        title: 'Reparación sistema de iluminación',
        description: 'Reparación del sistema de iluminación LED - 3 luminarias dañadas',
        scheduled_date: '2024-12-01',
        scheduled_start_time: '10:00:00',
        scheduled_end_time: '16:00:00',
        estimated_duration: 360, // minutes
        actual_start_time: null,
        actual_end_time: null,
        actual_duration: null,
        assigned_to: JSON.stringify([
          {
            name: 'Carlos Electricista Pro',
            role: 'Electricista Certificado',
            contact: '+52 55 5555 9999'
          }
        ]),
        work_performed: null,
        cost: JSON.stringify({
          labor: 200000, // $2,000.00 MXN in cents
          materials: 120000, // $1,200.00 MXN in cents
          total: 320000 // $3,200.00 MXN in cents
        }),
        quality_check: JSON.stringify({
          inspector: null,
          passed: null,
          score: null,
          notes: 'Pendiente de ejecución'
        }),
        affected_bookings: JSON.stringify([
          { booking_id: 456, cancelled: true, refund_issued: true }
        ]),
        safety_measures: JSON.stringify([
          'Corte de energía eléctrica',
          'Señalización de peligro',
          'Equipo especializado en alturas'
        ]),
        approvals: JSON.stringify({
          supervisor: 'Director Operaciones',
          approved_at: '2024-11-25T09:00:00',
          approved: true
        }),
        before_photos: JSON.stringify([]),
        after_photos: JSON.stringify([]),
        documents: JSON.stringify([
          '/maintenance/quotes/lighting_repair_quote.pdf'
        ]),
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('maintenance_records', maintenanceRecords);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('maintenance_records', {});
  }
};