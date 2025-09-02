module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('maintenance_records', [
      {
        court_id: 1, // Court A1 at Complejo Deportivo Roma Norte
        maintenance_type: 'surface_cleaning',
        description: 'Limpieza profunda de la superficie de juego y reemplazo de líneas desgastadas',
        scheduled_date: new Date('2024-11-15'),
        completed_date: new Date('2024-11-15'),
        technician_name: 'Mario Rodríguez Técnico',
        cost: 250000, // $2,500.00 MXN in cents
        status: 'completed',
        next_maintenance_due: new Date('2025-02-15'),
        maintenance_notes: JSON.stringify({
          materials_used: ['Pintura acrílica blanca', 'Sellador de superficie'],
          time_hours: 4,
          quality_rating: 'excellent'
        }),
        created_at: new Date('2024-11-15'),
        updated_at: new Date('2024-11-15')
      },
      {
        court_id: 2, // Court A2 at Complejo Deportivo Roma Norte
        maintenance_type: 'net_replacement',
        description: 'Reemplazo de red principal y tensores laterales por desgaste',
        scheduled_date: new Date('2024-11-20'),
        completed_date: new Date('2024-11-20'),
        technician_name: 'José Luis Hernández',
        cost: 180000, // $1,800.00 MXN in cents
        status: 'completed',
        next_maintenance_due: new Date('2025-05-20'),
        maintenance_notes: JSON.stringify({
          materials_used: ['Red profesional', 'Tensores de acero', 'Postes ajustables'],
          time_hours: 2,
          quality_rating: 'good'
        }),
        created_at: new Date('2024-11-20'),
        updated_at: new Date('2024-11-20')
      },
      {
        court_id: 3, // Court B1 at Club Pickleball Polanco
        maintenance_type: 'lighting_repair',
        description: 'Reparación del sistema de iluminación LED - 3 luminarias dañadas',
        scheduled_date: new Date('2024-12-01'),
        completed_date: null,
        technician_name: 'Carlos Electricista Pro',
        cost: 320000, // $3,200.00 MXN in cents
        status: 'scheduled',
        next_maintenance_due: new Date('2025-06-01'),
        maintenance_notes: JSON.stringify({
          materials_needed: ['3 Luminarias LED 150W', 'Cables de conexión'],
          estimated_time_hours: 3,
          priority: 'high'
        }),
        created_at: new Date('2024-11-25'),
        updated_at: new Date('2024-11-25')
      },
      {
        court_id: 4, // Court C1 at Centro Deportivo Guadalajara
        maintenance_type: 'general_inspection',
        description: 'Inspección trimestral de seguridad y condiciones generales',
        scheduled_date: new Date('2024-12-10'),
        completed_date: null,
        technician_name: 'Ana María Supervisora',
        cost: 80000, // $800.00 MXN in cents
        status: 'pending',
        next_maintenance_due: new Date('2025-03-10'),
        maintenance_notes: JSON.stringify({
          inspection_checklist: [
            'Estado de la superficie',
            'Condición de redes',
            'Iluminación',
            'Seguridad perimetral'
          ],
          estimated_time_hours: 1.5,
          priority: 'routine'
        }),
        created_at: new Date('2024-11-30'),
        updated_at: new Date('2024-11-30')
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('maintenance_records', null, {});
  }
};