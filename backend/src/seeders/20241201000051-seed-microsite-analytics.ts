module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('microsite_analytics', [
    {
      microsite_id: 1, // Club Pickleball CDMX
      date: now,
      page_views: 1250,
      unique_visitors: 892,
      bounce_rate: 32.5,
      avg_session_duration: 245, // seconds
      traffic_sources: JSON.stringify({
        direct: 45,
        google: 35,
        social_media: 15,
        referrals: 5
      }),
      top_pages: JSON.stringify([
        { page: 'inicio', views: 456, percentage: 36.5 },
        { page: 'servicios', views: 324, percentage: 25.9 },
        { page: 'contacto', views: 278, percentage: 22.2 },
        { page: 'reservas', views: 192, percentage: 15.4 }
      ]),
      device_breakdown: JSON.stringify({
        mobile: 58,
        desktop: 35,
        tablet: 7
      }),
      conversion_rate: 12.8,
      conversions: 114,
      revenue_generated: 4560000, // $45,600.00 MXN in cents
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX - Previous day
      date: now,
      page_views: 1180,
      unique_visitors: 834,
      bounce_rate: 34.2,
      avg_session_duration: 238,
      traffic_sources: JSON.stringify({
        direct: 42,
        google: 38,
        social_media: 14,
        referrals: 6
      }),
      top_pages: JSON.stringify([
        { page: 'inicio', views: 425, percentage: 36.0 },
        { page: 'servicios', views: 307, percentage: 26.0 },
        { page: 'contacto', views: 259, percentage: 22.0 },
        { page: 'reservas', views: 189, percentage: 16.0 }
      ]),
      device_breakdown: JSON.stringify({
        mobile: 60,
        desktop: 33,
        tablet: 7
      }),
      conversion_rate: 11.5,
      conversions: 96,
      revenue_generated: 3840000, // $38,400.00 MXN
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia
      date: now,
      page_views: 478,
      unique_visitors: 356,
      bounce_rate: 28.7,
      avg_session_duration: 195,
      traffic_sources: JSON.stringify({
        google: 52,
        direct: 25,
        social_media: 18,
        referrals: 5
      }),
      top_pages: JSON.stringify([
        { page: 'sobre-mi', views: 189, percentage: 39.5 },
        { page: 'programas', views: 156, percentage: 32.6 },
        { page: 'contacto', views: 92, percentage: 19.2 },
        { page: 'testimonios', views: 41, percentage: 8.6 }
      ]),
      device_breakdown: JSON.stringify({
        mobile: 64,
        desktop: 29,
        tablet: 7
      }),
      conversion_rate: 18.5,
      conversions: 66,
      revenue_generated: 1980000, // $19,800.00 MXN from coaching bookings
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia - Previous day
      date: now,
      page_views: 423,
      unique_visitors: 318,
      bounce_rate: 31.4,
      avg_session_duration: 187,
      traffic_sources: JSON.stringify({
        google: 48,
        direct: 28,
        social_media: 20,
        referrals: 4
      }),
      top_pages: JSON.stringify([
        { page: 'sobre-mi', views: 172, percentage: 40.7 },
        { page: 'programas', views: 135, percentage: 31.9 },
        { page: 'contacto', views: 78, percentage: 18.4 },
        { page: 'testimonios', views: 38, percentage: 9.0 }
      ]),
      device_breakdown: JSON.stringify({
        mobile: 62,
        desktop: 31,
        tablet: 7
      }),
      conversion_rate: 16.8,
      conversions: 53,
      revenue_generated: 1590000, // $15,900.00 MXN
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 3, // Wilson México Partner
      date: now,
      page_views: 2340,
      unique_visitors: 1678,
      bounce_rate: 45.3,
      avg_session_duration: 156,
      traffic_sources: JSON.stringify({
        google: 62,
        direct: 18,
        social_media: 12,
        referrals: 8
      }),
      top_pages: JSON.stringify([
        { page: 'productos', views: 984, percentage: 42.1 },
        { page: 'inicio', views: 562, percentage: 24.0 },
        { page: 'ofertas', views: 468, percentage: 20.0 },
        { page: 'contacto', views: 326, percentage: 13.9 }
      ]),
      device_breakdown: JSON.stringify({
        mobile: 71,
        desktop: 24,
        tablet: 5
      }),
      conversion_rate: 8.7,
      conversions: 146,
      revenue_generated: 5256000, // $52,560.00 MXN from product sales
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 3, // Wilson México Partner - Previous day
      date: now,
      page_views: 2156,
      unique_visitors: 1542,
      bounce_rate: 47.8,
      avg_session_duration: 148,
      traffic_sources: JSON.stringify({
        google: 58,
        direct: 20,
        social_media: 14,
        referrals: 8
      }),
      top_pages: JSON.stringify([
        { page: 'productos', views: 895, percentage: 41.5 },
        { page: 'inicio', views: 538, percentage: 24.9 },
        { page: 'ofertas', views: 432, percentage: 20.0 },
        { page: 'contacto', views: 291, percentage: 13.5 }
      ]),
      device_breakdown: JSON.stringify({
        mobile: 69,
        desktop: 26,
        tablet: 5
      }),
      conversion_rate: 7.9,
      conversions: 122,
      revenue_generated: 4392000, // $43,920.00 MXN
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX - Weekly summary
      date: now,
      page_views: 7820,
      unique_visitors: 5234,
      bounce_rate: 35.8,
      avg_session_duration: 258,
      traffic_sources: JSON.stringify({
        direct: 43,
        google: 36,
        social_media: 16,
        referrals: 5
      }),
      top_pages: JSON.stringify([
        { page: 'inicio', views: 2834, percentage: 36.2 },
        { page: 'servicios', views: 2032, percentage: 26.0 },
        { page: 'contacto', views: 1723, percentage: 22.0 },
        { page: 'reservas', views: 1231, percentage: 15.7 }
      ]),
      device_breakdown: JSON.stringify({
        mobile: 59,
        desktop: 34,
        tablet: 7
      }),
      conversion_rate: 13.2,
      conversions: 690,
      revenue_generated: 27600000, // $276,000.00 MXN weekly
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia - Weekly summary
      date: now,
      page_views: 2890,
      unique_visitors: 2156,
      bounce_rate: 29.5,
      avg_session_duration: 198,
      traffic_sources: JSON.stringify({
        google: 51,
        direct: 26,
        social_media: 19,
        referrals: 4
      }),
      top_pages: JSON.stringify([
        { page: 'sobre-mi', views: 1145, percentage: 39.6 },
        { page: 'programas', views: 936, percentage: 32.4 },
        { page: 'contacto', views: 549, percentage: 19.0 },
        { page: 'testimonios', views: 260, percentage: 9.0 }
      ]),
      device_breakdown: JSON.stringify({
        mobile: 63,
        desktop: 30,
        tablet: 7
      }),
      conversion_rate: 17.8,
      conversions: 384,
      revenue_generated: 11520000, // $115,200.00 MXN weekly from coaching
      created_at: now,
      updated_at: now
    }
  ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('microsite_analytics', {}, {});
  }
};