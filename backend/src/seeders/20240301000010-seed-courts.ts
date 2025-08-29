import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('courts', [
    {
      name: 'Cancha Central CDMX',
      description: 'Cancha principal del Club Pickleball CDMX con superficie profesional',
      surface_type: 'concrete',
      owner_type: 'club',
      owner_id: 1, // Club Pickleball CDMX
      state_id: 7, // Ciudad de México
      address: 'Av. Reforma 123, Roma Norte, Ciudad de México, CDMX',
      latitude: 19.432608,
      longitude: -99.133209,
      amenities: JSON.stringify(['Estacionamiento', 'Vestidores', 'Bebederos', 'Wi-Fi']),
      hourly_rate: 300.00,
      peak_hour_rate: 450.00,
      weekend_rate: 390.00,
      images: JSON.stringify(['/images/courts/cancha-central-1.jpg']),
      is_active: true,
      operating_hours: JSON.stringify({
        "0": {"isOpen": true, "startTime": "06:00", "endTime": "22:00"},
        "1": {"isOpen": true, "startTime": "06:00", "endTime": "22:00"},
        "2": {"isOpen": true, "startTime": "06:00", "endTime": "22:00"},
        "3": {"isOpen": true, "startTime": "06:00", "endTime": "22:00"},
        "4": {"isOpen": true, "startTime": "06:00", "endTime": "22:00"},
        "5": {"isOpen": true, "startTime": "06:00", "endTime": "22:00"},
        "6": {"isOpen": true, "startTime": "06:00", "endTime": "22:00"}
      }),
      max_advance_booking_days: 30,
      min_booking_duration: 60,
      max_booking_duration: 240,
      cancellation_policy: 'Cancelaciones deben realizarse con al menos 24 horas de anticipación para reembolso completo.',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('courts', {}, {});
}