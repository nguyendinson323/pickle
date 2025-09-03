module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    await queryInterface.bulkInsert('microsite_analytics', [
    {
      microsite_id: 1, // Club Pickleball CDMX
      date: now,
      page_views: 1250,
      unique_visitors: 892,
      sessions: 1050,
      bounce_rate: 32.5,
      avg_session_duration: 245, // seconds
      page_metrics: [
        { page: 'inicio', views: 456, percentage: 36.5 },
        { page: 'servicios', views: 324, percentage: 25.9 },
        { page: 'contacto', views: 278, percentage: 22.2 },
        { page: 'reservas', views: 192, percentage: 15.4 }
      ],
      traffic_sources: [
        { source: 'direct', percentage: 45 },
        { source: 'google', percentage: 35 },
        { source: 'social_media', percentage: 15 },
        { source: 'referrals', percentage: 5 }
      ],
      device_stats: {
        mobile: 58,
        desktop: 35,
        tablet: 7
      },
      browser_stats: [
        { browser: 'Chrome', percentage: 65 },
        { browser: 'Safari', percentage: 20 },
        { browser: 'Firefox', percentage: 10 },
        { browser: 'Edge', percentage: 5 }
      ],
      country_stats: [
        { country: 'Mexico', percentage: 85 },
        { country: 'USA', percentage: 10 },
        { country: 'Canada', percentage: 3 },
        { country: 'Other', percentage: 2 }
      ],
      form_submissions: 45,
      download_clicks: 23,
      social_clicks: 67,
      external_link_clicks: 12,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX - Previous day
      date: yesterday,
      page_views: 1180,
      unique_visitors: 834,
      sessions: 980,
      bounce_rate: 34.2,
      avg_session_duration: 238,
      page_metrics: [
        { page: 'inicio', views: 425, percentage: 36.0 },
        { page: 'servicios', views: 307, percentage: 26.0 },
        { page: 'contacto', views: 259, percentage: 22.0 },
        { page: 'reservas', views: 189, percentage: 16.0 }
      ],
      traffic_sources: [
        { source: 'direct', percentage: 42 },
        { source: 'google', percentage: 38 },
        { source: 'social_media', percentage: 14 },
        { source: 'referrals', percentage: 6 }
      ],
      device_stats: {
        mobile: 60,
        desktop: 33,
        tablet: 7
      },
      browser_stats: [
        { browser: 'Chrome', percentage: 62 },
        { browser: 'Safari', percentage: 22 },
        { browser: 'Firefox', percentage: 11 },
        { browser: 'Edge', percentage: 5 }
      ],
      country_stats: [
        { country: 'Mexico', percentage: 83 },
        { country: 'USA', percentage: 12 },
        { country: 'Canada', percentage: 3 },
        { country: 'Other', percentage: 2 }
      ],
      form_submissions: 38,
      download_clicks: 19,
      social_clicks: 58,
      external_link_clicks: 9,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia
      date: now,
      page_views: 478,
      unique_visitors: 356,
      sessions: 420,
      bounce_rate: 28.7,
      avg_session_duration: 195,
      page_metrics: [
        { page: 'sobre-mi', views: 189, percentage: 39.5 },
        { page: 'programas', views: 156, percentage: 32.6 },
        { page: 'contacto', views: 92, percentage: 19.2 },
        { page: 'testimonios', views: 41, percentage: 8.6 }
      ],
      traffic_sources: [
        { source: 'google', percentage: 52 },
        { source: 'direct', percentage: 25 },
        { source: 'social_media', percentage: 18 },
        { source: 'referrals', percentage: 5 }
      ],
      device_stats: {
        mobile: 64,
        desktop: 29,
        tablet: 7
      },
      browser_stats: [
        { browser: 'Chrome', percentage: 70 },
        { browser: 'Safari', percentage: 18 },
        { browser: 'Firefox', percentage: 8 },
        { browser: 'Edge', percentage: 4 }
      ],
      country_stats: [
        { country: 'Mexico', percentage: 88 },
        { country: 'USA', percentage: 8 },
        { country: 'Spain', percentage: 2 },
        { country: 'Other', percentage: 2 }
      ],
      form_submissions: 22,
      download_clicks: 15,
      social_clicks: 34,
      external_link_clicks: 6,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia - Previous day
      date: yesterday,
      page_views: 423,
      unique_visitors: 318,
      sessions: 374,
      bounce_rate: 31.4,
      avg_session_duration: 187,
      page_metrics: [
        { page: 'sobre-mi', views: 172, percentage: 40.7 },
        { page: 'programas', views: 135, percentage: 31.9 },
        { page: 'contacto', views: 78, percentage: 18.4 },
        { page: 'testimonios', views: 38, percentage: 9.0 }
      ],
      traffic_sources: [
        { source: 'google', percentage: 48 },
        { source: 'direct', percentage: 28 },
        { source: 'social_media', percentage: 20 },
        { source: 'referrals', percentage: 4 }
      ],
      device_stats: {
        mobile: 62,
        desktop: 31,
        tablet: 7
      },
      browser_stats: [
        { browser: 'Chrome', percentage: 68 },
        { browser: 'Safari', percentage: 19 },
        { browser: 'Firefox', percentage: 9 },
        { browser: 'Edge', percentage: 4 }
      ],
      country_stats: [
        { country: 'Mexico', percentage: 86 },
        { country: 'USA', percentage: 9 },
        { country: 'Spain', percentage: 3 },
        { country: 'Other', percentage: 2 }
      ],
      form_submissions: 18,
      download_clicks: 12,
      social_clicks: 29,
      external_link_clicks: 4,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 3, // Wilson México Partner
      date: now,
      page_views: 2340,
      unique_visitors: 1678,
      sessions: 1890,
      bounce_rate: 45.3,
      avg_session_duration: 156,
      page_metrics: [
        { page: 'productos', views: 984, percentage: 42.1 },
        { page: 'inicio', views: 562, percentage: 24.0 },
        { page: 'ofertas', views: 468, percentage: 20.0 },
        { page: 'contacto', views: 326, percentage: 13.9 }
      ],
      traffic_sources: [
        { source: 'google', percentage: 62 },
        { source: 'direct', percentage: 18 },
        { source: 'social_media', percentage: 12 },
        { source: 'referrals', percentage: 8 }
      ],
      device_stats: {
        mobile: 71,
        desktop: 24,
        tablet: 5
      },
      browser_stats: [
        { browser: 'Chrome', percentage: 58 },
        { browser: 'Safari', percentage: 25 },
        { browser: 'Firefox', percentage: 12 },
        { browser: 'Edge', percentage: 5 }
      ],
      country_stats: [
        { country: 'Mexico', percentage: 92 },
        { country: 'USA', percentage: 5 },
        { country: 'Colombia', percentage: 2 },
        { country: 'Other', percentage: 1 }
      ],
      form_submissions: 67,
      download_clicks: 89,
      social_clicks: 156,
      external_link_clicks: 23,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 3, // Wilson México Partner - Previous day
      date: yesterday,
      page_views: 2156,
      unique_visitors: 1542,
      sessions: 1734,
      bounce_rate: 47.8,
      avg_session_duration: 148,
      page_metrics: [
        { page: 'productos', views: 895, percentage: 41.5 },
        { page: 'inicio', views: 538, percentage: 24.9 },
        { page: 'ofertas', views: 432, percentage: 20.0 },
        { page: 'contacto', views: 291, percentage: 13.5 }
      ],
      traffic_sources: [
        { source: 'google', percentage: 58 },
        { source: 'direct', percentage: 20 },
        { source: 'social_media', percentage: 14 },
        { source: 'referrals', percentage: 8 }
      ],
      device_stats: {
        mobile: 69,
        desktop: 26,
        tablet: 5
      },
      browser_stats: [
        { browser: 'Chrome', percentage: 56 },
        { browser: 'Safari', percentage: 27 },
        { browser: 'Firefox', percentage: 12 },
        { browser: 'Edge', percentage: 5 }
      ],
      country_stats: [
        { country: 'Mexico', percentage: 90 },
        { country: 'USA', percentage: 6 },
        { country: 'Colombia', percentage: 2 },
        { country: 'Other', percentage: 2 }
      ],
      form_submissions: 58,
      download_clicks: 76,
      social_clicks: 134,
      external_link_clicks: 19,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX - Weekly summary
      date: weekAgo,
      page_views: 7820,
      unique_visitors: 5234,
      sessions: 6890,
      bounce_rate: 35.8,
      avg_session_duration: 258,
      page_metrics: [
        { page: 'inicio', views: 2834, percentage: 36.2 },
        { page: 'servicios', views: 2032, percentage: 26.0 },
        { page: 'contacto', views: 1723, percentage: 22.0 },
        { page: 'reservas', views: 1231, percentage: 15.7 }
      ],
      traffic_sources: [
        { source: 'direct', percentage: 43 },
        { source: 'google', percentage: 36 },
        { source: 'social_media', percentage: 16 },
        { source: 'referrals', percentage: 5 }
      ],
      device_stats: {
        mobile: 59,
        desktop: 34,
        tablet: 7
      },
      browser_stats: [
        { browser: 'Chrome', percentage: 64 },
        { browser: 'Safari', percentage: 21 },
        { browser: 'Firefox', percentage: 10 },
        { browser: 'Edge', percentage: 5 }
      ],
      country_stats: [
        { country: 'Mexico', percentage: 84 },
        { country: 'USA', percentage: 11 },
        { country: 'Canada', percentage: 3 },
        { country: 'Other', percentage: 2 }
      ],
      form_submissions: 298,
      download_clicks: 156,
      social_clicks: 445,
      external_link_clicks: 78,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia - Weekly summary
      date: weekAgo,
      page_views: 2890,
      unique_visitors: 2156,
      sessions: 2564,
      bounce_rate: 29.5,
      avg_session_duration: 198,
      page_metrics: [
        { page: 'sobre-mi', views: 1145, percentage: 39.6 },
        { page: 'programas', views: 936, percentage: 32.4 },
        { page: 'contacto', views: 549, percentage: 19.0 },
        { page: 'testimonios', views: 260, percentage: 9.0 }
      ],
      traffic_sources: [
        { source: 'google', percentage: 51 },
        { source: 'direct', percentage: 26 },
        { source: 'social_media', percentage: 19 },
        { source: 'referrals', percentage: 4 }
      ],
      device_stats: {
        mobile: 63,
        desktop: 30,
        tablet: 7
      },
      browser_stats: [
        { browser: 'Chrome', percentage: 69 },
        { browser: 'Safari', percentage: 19 },
        { browser: 'Firefox', percentage: 8 },
        { browser: 'Edge', percentage: 4 }
      ],
      country_stats: [
        { country: 'Mexico', percentage: 87 },
        { country: 'USA', percentage: 8 },
        { country: 'Spain', percentage: 3 },
        { country: 'Other', percentage: 2 }
      ],
      form_submissions: 134,
      download_clicks: 89,
      social_clicks: 223,
      external_link_clicks: 34,
      created_at: now,
      updated_at: now
    }
  ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('microsite_analytics', {}, {});
  }
};