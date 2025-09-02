module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('content_blocks', [
    {
      page_id: 1, // Club CDMX home page
      block_type: 'hero',
      block_name: 'Main Hero Section',
      content_data: JSON.stringify({
        background_image: {
          url: '/images/club-hero-bg.jpg',
          alt: 'Canchas de pickleball profesionales'
        },
        heading: {
          text: 'El Mejor Club de Pickleball en CDMX',
          style: 'h1',
          color: '#ffffff'
        },
        subheading: {
          text: 'Únete a más de 500 jugadores activos en la comunidad de pickleball más grande de México',
          style: 'h3',
          color: '#f0f0f0'
        },
        cta_buttons: [
          {
            text: 'Reservar Cancha',
            link: '/reservations',
            style: 'primary',
            color: '#ff6b35'
          },
          {
            text: 'Tour Virtual',
            link: '/virtual-tour',
            style: 'secondary',
            color: '#ffffff'
          }
        ]
      }),
      display_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now
    },
    {
      page_id: 1, // Club CDMX home page
      block_type: 'features_grid',
      block_name: 'Facilities Showcase',
      content_data: JSON.stringify({
        section_title: 'Nuestras Instalaciones de Clase Mundial',
        grid_layout: '3-columns',
        features: [
          {
            icon: 'court-professional',
            title: '4 Canchas Profesionales',
            description: 'Superficies certificadas por la Federación Internacional de Pickleball con iluminación LED profesional',
            image: '/images/courts-aerial.jpg'
          },
          {
            icon: 'coaching-certified',
            title: 'Entrenadores Certificados',
            description: 'Staff de entrenadores con certificación nacional e internacional, incluyendo ex-campeones',
            image: '/images/coaches-team.jpg'
          },
          {
            icon: 'tournament-monthly',
            title: 'Torneos y Eventos',
            description: 'Calendario completo de torneos mensuales, clínicas y eventos especiales para todos los niveles',
            image: '/images/tournaments.jpg'
          }
        ]
      }),
      display_order: 2,
      is_active: true,
      created_at: now,
      updated_at: now
    },
    {
      page_id: 2, // Club services page
      block_type: 'pricing_table',
      block_name: 'Membership Plans',
      content_data: JSON.stringify({
        section_title: 'Planes de Membresía',
        pricing_columns: [
          {
            plan_name: 'Básico',
            price: '$800',
            period: '/mes',
            popular: false,
            features: [
              'Acceso a canchas en horarios no pico',
              '2 clases grupales incluidas',
              'Descuento 10% en torneos',
              'Acceso a app móvil'
            ],
            cta_text: 'Elegir Plan',
            cta_link: '/signup/basic'
          },
          {
            plan_name: 'Premium',
            price: '$1,200',
            period: '/mes',
            popular: true,
            features: [
              'Acceso ilimitado 24/7',
              'Clases grupales ilimitadas',
              'Descuento 20% en torneos',
              'Acceso prioritario a eventos',
              '2 invitaciones mensuales'
            ],
            cta_text: 'Más Popular',
            cta_link: '/signup/premium'
          },
          {
            plan_name: 'Elite',
            price: '$2,000',
            period: '/mes',
            popular: false,
            features: [
              'Todo lo de Premium',
              '4 clases particulares incluidas',
              'Análisis de juego personalizado',
              'Acceso a coach personal',
              'Invitaciones ilimitadas'
            ],
            cta_text: 'Elegir Elite',
            cta_link: '/signup/elite'
          }
        ]
      }),
      display_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now
    },
    {
      page_id: 3, // Coach Ana about page
      block_type: 'profile_showcase',
      block_name: 'Coach Profile',
      content_data: JSON.stringify({
        profile_image: {
          url: '/images/ana-patricia-profile.jpg',
          alt: 'Ana Patricia Ruiz Vega - Entrenadora Master'
        },
        name: 'Ana Patricia Ruiz Vega',
        title: 'Entrenadora Certificada Master',
        credentials: [
          'Certificación Master Nacional México',
          'Ranking #1 Nacional Femenino 2024',
          'Campeona Nacional 2023, 2024',
          '15+ años de experiencia competitiva'
        ],
        biography: 'Ana Patricia es la entrenadora de pickleball más reconocida de México. Con un ratio de victorias del 90.5% y más de 200 estudiantes formados, ha revolucionado la técnica del pickleball en el país.',
        achievements: [
          'MVP del Año 2024 - Federación Mexicana de Pickleball',
          'Entrenadora Oficial Equipo Nacional',
          'Creadora del Método ANA de Entrenamiento',
          'Más de 1,000 horas de entrenamiento certificadas'
        ],
        stats: {
          students_trained: 200,
          win_ratio: '90.5%',
          years_experience: 15,
          tournaments_won: 45
        }
      }),
      display_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now
    },
    {
      page_id: 4, // Coach programs page
      block_type: 'program_cards',
      block_name: 'Training Programs',
      content_data: JSON.stringify({
        section_title: 'Programas de Entrenamiento Profesional',
        programs: [
          {
            name: 'Elite Performance',
            level: 'Avanzado (4.5+)',
            duration: '3 meses',
            price: '$15,000 MXN',
            image: '/images/elite-training.jpg',
            highlights: [
              'Entrenamiento individualizado',
              'Análisis biomecánico completo',
              'Plan nutricional personalizado',
              'Preparación para torneos nacionales'
            ],
            includes: [
              '24 sesiones individuales (2/semana)',
              'Análisis de video profesional',
              'Acceso a instalaciones premium',
              'Seguimiento 24/7 vía app',
              'Material exclusivo del Método ANA'
            ],
            testimonial: {
              text: 'Gracias a Ana Patricia mejoré mi ranking de #15 a #3 nacional en solo 6 meses',
              author: 'Roberto Sánchez Torres'
            }
          },
          {
            name: 'Desarrollo Técnico',
            level: 'Intermedio (3.0-4.0)',
            duration: '2 meses',
            price: '$8,000 MXN',
            image: '/images/technical-training.jpg',
            highlights: [
              'Perfeccionamiento técnico',
              'Estrategias de juego',
              'Entrenamiento mental',
              'Preparación física específica'
            ],
            includes: [
              '16 sesiones grupales (2/semana)',
              'Ejercicios específicos por posición',
              'Manual técnico digital',
              'Evaluación mensual de progreso'
            ]
          },
          {
            name: 'Fundamentos',
            level: 'Principiante/Novato',
            duration: '1 mes',
            price: '$3,000 MXN',
            image: '/images/beginner-training.jpg',
            highlights: [
              'Introducción completa al deporte',
              'Técnicas básicas certificadas',
              'Reglas y estrategias fundamentales',
              'Preparación para juego competitivo'
            ],
            includes: [
              '8 clases grupales intensivas',
              'Equipamiento básico incluido',
              'Manual del principiante',
              'Certificado de participación'
            ]
          }
        ]
      }),
      display_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now
    },
    {
      page_id: 5, // Wilson products page
      block_type: 'product_catalog',
      block_name: 'Featured Products',
      content_data: JSON.stringify({
        section_title: 'Catálogo Wilson Pickleball México',
        featured_product: {
          name: 'Wilson Pro Staff RF97 Pickleball Edition',
          price: '$4,200 MXN',
          image: '/images/wilson-pro-staff-rf97.jpg',
          badge: 'Edición Limitada',
          description: 'La paleta oficial de Roger Federer adaptada para pickleball profesional',
          specs: {
            weight: '8.5 oz',
            grip_size: '4 1/4"',
            material: 'Fibra de carbono premium',
            technology: 'Wilson Feel Technology'
          }
        },
        product_categories: [
          {
            name: 'Paletas Profesionales',
            products: [
              {
                name: 'Wilson Energy Pro',
                price: '$2,200 MXN',
                image: '/images/energy-pro.jpg',
                rating: 4.8,
                features: ['Control superior', 'Peso balanceado', 'Grip antideslizante']
              },
              {
                name: 'Wilson Surge',
                price: '$1,800 MXN',
                image: '/images/wilson-surge.jpg',
                rating: 4.6,
                features: ['Potencia máxima', 'Diseño aerodinámico', 'Tecnología de amortiguación']
              }
            ]
          },
          {
            name: 'Accesorios',
            products: [
              {
                name: 'Pelotas Wilson Official (6 pack)',
                price: '$450 MXN',
                image: '/images/wilson-balls-6pack.jpg',
                rating: 4.9,
                features: ['Certificación oficial', '40 agujeros perfectos', 'Durabilidad profesional']
              }
            ]
          }
        ]
      }),
      display_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now
    }
  ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('content_blocks', {}, {});
  }
};