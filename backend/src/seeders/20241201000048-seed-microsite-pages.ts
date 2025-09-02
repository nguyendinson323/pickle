module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('microsite_pages', [
    {
      microsite_id: 1, // Club Pickleball CDMX microsite
      page_name: 'inicio',
      page_title: 'Bienvenidos al Club Pickleball CDMX',
      page_slug: 'home',
      content: JSON.stringify({
        hero_section: {
          title: 'El Mejor Club de Pickleball en Ciudad de México',
          subtitle: 'Únete a la comunidad de pickleball más activa de CDMX',
          background_image: '/images/club-hero.jpg',
          cta_button: {
            text: 'Únete Hoy',
            link: '/contact'
          }
        },
        features_section: {
          title: 'Nuestras Instalaciones',
          features: [
            {
              icon: 'court',
              title: '4 Canchas Profesionales',
              description: 'Canchas certificadas con superficie de última generación'
            },
            {
              icon: 'coach',
              title: 'Entrenadores Certificados',
              description: 'Staff profesional con certificación nacional'
            },
            {
              icon: 'tournament',
              title: 'Torneos Mensuales',
              description: 'Competencias regulares para todos los niveles'
            }
          ]
        },
        testimonials: [
          {
            name: 'Carlos Méndez',
            rating: 5,
            text: 'Excelentes instalaciones y gran ambiente'
          }
        ]
      }),
      meta_description: 'Club Pickleball CDMX - Las mejores instalaciones de pickleball en Ciudad de México',
      meta_keywords: 'pickleball, club, CDMX, deporte, canchas',
      page_status: 'published',
      display_order: 1,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX microsite
      page_name: 'servicios',
      page_title: 'Nuestros Servicios',
      page_slug: 'services',
      content: JSON.stringify({
        services_grid: {
          title: 'Todo lo que Necesitas para Jugar',
          services: [
            {
              name: 'Membresías Mensuales',
              price: '$1,200 MXN/mes',
              description: 'Acceso ilimitado a todas las canchas',
              features: ['Acceso 24/7', 'Descuentos en torneos', 'Clases grupales incluidas']
            },
            {
              name: 'Clases Particulares',
              price: '$600 MXN/hora',
              description: 'Entrenamiento personalizado con coach certificado',
              features: ['Análisis técnico', 'Plan personalizado', 'Seguimiento de progreso']
            },
            {
              name: 'Alquiler por Horas',
              price: '$400 MXN/hora',
              description: 'Renta cancha por horas para juego libre',
              features: ['Reserva online', 'Equipamiento incluido', 'Horarios flexibles']
            }
          ]
        }
      }),
      meta_description: 'Servicios del Club Pickleball CDMX - Membresías, clases y alquiler de canchas',
      meta_keywords: 'servicios pickleball, membresías, clases, alquiler canchas',
      page_status: 'published',
      display_order: 2,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia microsite
      page_name: 'sobre-mi',
      page_title: 'Sobre Ana Patricia Ruiz',
      page_slug: 'about',
      content: JSON.stringify({
        profile_section: {
          name: 'Ana Patricia Ruiz Vega',
          title: 'Entrenadora Certificada Master',
          image: '/images/coach-ana.jpg',
          credentials: [
            'Certificación Master Nacional',
            'Ranking #1 Nacional Femenino',
            '15+ años de experiencia',
            'Especialista en técnica avanzada'
          ],
          bio: 'Con más de 15 años de experiencia en pickleball, Ana Patricia es la entrenadora #1 de México. Ha formado a más de 200 jugadores profesionales.'
        },
        achievements: {
          title: 'Logros Destacados',
          items: [
            'Campeona Nacional 2023, 2024',
            'MVP del Año 2024',
            'Entrenadora del Equipo Nacional',
            '90.5% ratio de victorias'
          ]
        },
        coaching_philosophy: {
          title: 'Mi Filosofía de Entrenamiento',
          text: 'Creo en el desarrollo integral del jugador, combinando técnica perfecta, estrategia inteligente y fortaleza mental.'
        }
      }),
      meta_description: 'Ana Patricia Ruiz - Entrenadora Master de Pickleball, #1 Nacional',
      meta_keywords: 'Ana Patricia Ruiz, entrenadora pickleball, coach master, campeona nacional',
      page_status: 'published',
      display_order: 1,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia microsite
      page_name: 'programas',
      page_title: 'Programas de Entrenamiento',
      page_slug: 'programs',
      content: JSON.stringify({
        programs: [
          {
            name: 'Programa Elite',
            duration: '3 meses',
            price: '$15,000 MXN',
            description: 'Programa intensivo para jugadores avanzados',
            includes: [
              '24 sesiones individuales',
              'Análisis de video',
              'Plan nutricional',
              'Seguimiento 24/7'
            ],
            target_level: '4.5+'
          },
          {
            name: 'Programa Intermedio',
            duration: '2 meses',
            price: '$8,000 MXN',
            description: 'Desarrollo técnico para jugadores intermedios',
            includes: [
              '16 sesiones grupales',
              'Ejercicios específicos',
              'Material didáctico'
            ],
            target_level: '3.0-4.0'
          },
          {
            name: 'Programa Principiantes',
            duration: '1 mes',
            price: '$3,000 MXN',
            description: 'Introducción completa al pickleball',
            includes: [
              '8 clases grupales',
              'Equipamiento incluido',
              'Manual básico'
            ],
            target_level: 'Principiante'
          }
        ]
      }),
      meta_description: 'Programas de entrenamiento con Ana Patricia Ruiz - Elite, Intermedio, Principiantes',
      meta_keywords: 'programas entrenamiento pickleball, clases ana patricia, cursos pickleball',
      page_status: 'published',
      display_order: 2,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 3, // Wilson México partner microsite
      page_name: 'productos',
      page_title: 'Productos Wilson Pickleball',
      page_slug: 'products',
      content: JSON.stringify({
        product_categories: [
          {
            name: 'Paletas',
            products: [
              {
                name: 'Wilson Pro Staff Pickleball Paddle',
                price: '$3,500 MXN',
                image: '/images/paddle-pro-staff.jpg',
                features: ['Fibra de carbono', 'Peso 8.2 oz', 'Grip 4 1/4"']
              },
              {
                name: 'Wilson Energy Pro',
                price: '$2,200 MXN',
                image: '/images/paddle-energy.jpg',
                features: ['Composite', 'Peso 7.8 oz', 'Control superior']
              }
            ]
          },
          {
            name: 'Pelotas',
            products: [
              {
                name: 'Wilson Pickleballs Official',
                price: '$450 MXN (pack 6)',
                image: '/images/balls-official.jpg',
                features: ['Certificación oficial', '40 agujeros', 'Durabilidad +']
              }
            ]
          }
        ],
        promotions: {
          title: 'Promociones Especiales',
          items: [
            {
              title: '20% de descuento en primera compra',
              code: 'WILSON20',
              valid_until: '2024-12-31'
            }
          ]
        }
      }),
      meta_description: 'Productos Wilson Pickleball México - Paletas, pelotas y accesorios oficiales',
      meta_keywords: 'wilson pickleball, paletas wilson, pelotas pickleball, equipamiento',
      page_status: 'published',
      display_order: 1,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX microsite
      page_name: 'contacto',
      page_title: 'Contáctanos',
      page_slug: 'contact',
      content: JSON.stringify({
        contact_info: {
          address: 'Polanco 456, Col. Polanco, CDMX 11550',
          phone: '+52 55 1234 5678',
          email: 'info@pickleballcdmx.mx',
          hours: {
            monday_friday: '06:00 - 22:00',
            saturday: '07:00 - 20:00',
            sunday: '08:00 - 18:00'
          }
        },
        contact_form: {
          fields: ['name', 'email', 'phone', 'message'],
          submit_endpoint: '/api/contact-form'
        },
        map: {
          coordinates: {
            lat: 19.4326,
            lng: -99.1332
          },
          zoom: 15
        }
      }),
      meta_description: 'Contacta al Club Pickleball CDMX - Ubicación, horarios y información',
      meta_keywords: 'contacto club pickleball, ubicación cdmx, horarios',
      page_status: 'published',
      display_order: 3,
      created_at: now,
      updated_at: now
    }
  ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('microsite_pages', {}, {});
  }
};