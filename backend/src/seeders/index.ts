import bcrypt from 'bcryptjs';
import sequelize from '../config/database';
import User from '../models/User';
import Player from '../models/Player';
import Coach from '../models/Coach';
import Club from '../models/Club';
import Partner from '../models/Partner';
import StateCommittee from '../models/StateCommittee';
import State from '../models/State';
import Message from '../models/Message';
import Notification from '../models/Notification';
import Court from '../models/Court';
import Reservation from '../models/Reservation';
import CourtReview from '../models/CourtReview';
import CourtSchedule from '../models/CourtSchedule';
import { seedMicrositeData } from './micrositeSeeder';

export class DatabaseSeeder {
  async run() {
    try {
      console.log('🌱 Starting database seeding...');

      // Sync database
      await sequelize.sync({ force: true });
      console.log('📊 Database synced successfully');

      // Seed states first
      const states = await this.seedStates();
      console.log(`✅ Seeded ${states.length} states`);

      // Seed users and profiles
      const users = await this.seedUsers(states);
      console.log(`✅ Seeded ${users.length} users`);

      // Seed messages
      const messages = await this.seedMessages(users);
      console.log(`✅ Seeded ${messages.length} messages`);

      // Seed notifications
      const notifications = await this.seedNotifications(users);
      console.log(`✅ Seeded ${notifications.length} notifications`);

      // Seed courts
      const courts = await this.seedCourts(states, users);
      console.log(`✅ Seeded ${courts.length} courts`);

      // Seed reservations
      const reservations = await this.seedReservations(courts, users);
      console.log(`✅ Seeded ${reservations.length} reservations`);

      // Seed court reviews
      const reviews = await this.seedCourtReviews(courts, reservations, users);
      console.log(`✅ Seeded ${reviews.length} court reviews`);

      // Seed court schedules and blocks
      const schedules = await this.seedCourtSchedules(courts);
      console.log(`✅ Seeded ${schedules.length} court schedules`);

      // Seed microsite data
      await seedMicrositeData();

      console.log('🎉 Database seeding completed successfully!');
      
      // Print test accounts
      this.printTestAccounts();

    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }

  private async seedStates() {
    const stateData = [
      { name: 'Aguascalientes', code: 'AGS' },
      { name: 'Baja California', code: 'BC' },
      { name: 'Baja California Sur', code: 'BCS' },
      { name: 'Campeche', code: 'CAM' },
      { name: 'Chiapas', code: 'CHIS' },
      { name: 'Chihuahua', code: 'CHIH' },
      { name: 'Ciudad de México', code: 'CDMX' },
      { name: 'Coahuila', code: 'COAH' },
      { name: 'Colima', code: 'COL' },
      { name: 'Durango', code: 'DGO' },
      { name: 'Guanajuato', code: 'GTO' },
      { name: 'Guerrero', code: 'GRO' },
      { name: 'Hidalgo', code: 'HGO' },
      { name: 'Jalisco', code: 'JAL' },
      { name: 'México', code: 'MEX' },
      { name: 'Michoacán', code: 'MICH' },
      { name: 'Morelos', code: 'MOR' },
      { name: 'Nayarit', code: 'NAY' },
      { name: 'Nuevo León', code: 'NL' },
      { name: 'Oaxaca', code: 'OAX' },
      { name: 'Puebla', code: 'PUE' },
      { name: 'Querétaro', code: 'QRO' },
      { name: 'Quintana Roo', code: 'QROO' },
      { name: 'San Luis Potosí', code: 'SLP' },
      { name: 'Sinaloa', code: 'SIN' },
      { name: 'Sonora', code: 'SON' },
      { name: 'Tabasco', code: 'TAB' },
      { name: 'Tamaulipas', code: 'TAMP' },
      { name: 'Tlaxcala', code: 'TLAX' },
      { name: 'Veracruz', code: 'VER' },
      { name: 'Yucatán', code: 'YUC' },
      { name: 'Zacatecas', code: 'ZAC' }
    ];

    return await State.bulkCreate(stateData);
  }

  private async seedUsers(states: any[]) {
    const hashedPassword = await bcrypt.hash('password123', 12);
    const users = [];

    // Admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@federacionpickleball.mx',
      passwordHash: hashedPassword,
      role: 'federation',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    });
    users.push(adminUser);

    // Player users
    const playerUsers = await User.bulkCreate([
      {
        username: 'jugador1',
        email: 'jugador1@example.com',
        passwordHash: hashedPassword,
        role: 'player',
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      },
      {
        username: 'jugador2',
        email: 'jugador2@example.com',
        passwordHash: hashedPassword,
        role: 'player',
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      },
      {
        username: 'jugador3',
        email: 'jugador3@example.com',
        passwordHash: hashedPassword,
        role: 'player',
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      }
    ], { returning: true });
    users.push(...playerUsers);

    // Create player profiles
    const playerProfiles = await Player.bulkCreate([
      {
        userId: playerUsers[0].id,
        fullName: 'Carlos Rodríguez García',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'M',
        stateId: states.find(s => s.name === 'Ciudad de México')?.id,
        curp: 'ROGC850315HDFDRR09',
        nrtpLevel: '3.5',
        mobilePhone: '5551234567',
        nationality: 'Mexicana',
        canBeFound: true,
        isPremium: false,
        rankingPosition: 25,
        federationIdNumber: 'FPM-2024-001'
      },
      {
        userId: playerUsers[1].id,
        fullName: 'María Elena Sánchez López',
        dateOfBirth: new Date('1990-07-22'),
        gender: 'F',
        stateId: states.find(s => s.name === 'Jalisco')?.id,
        curp: 'SALM900722MJCNPR07',
        nrtpLevel: '4.0',
        mobilePhone: '3331234567',
        nationality: 'Mexicana',
        canBeFound: true,
        isPremium: true,
        rankingPosition: 12,
        federationIdNumber: 'FPM-2024-002'
      },
      {
        userId: playerUsers[2].id,
        fullName: 'Roberto Martínez Hernández',
        dateOfBirth: new Date('1988-12-03'),
        gender: 'M',
        stateId: states.find(s => s.name === 'Nuevo León')?.id,
        curp: 'MAHR881203HPLRRT01',
        nrtpLevel: '3.0',
        mobilePhone: '8121234567',
        nationality: 'Mexicana',
        canBeFound: false,
        isPremium: false,
        rankingPosition: 45,
        federationIdNumber: 'FPM-2024-003'
      }
    ]);

    // Coach users
    const coachUsers = await User.bulkCreate([
      {
        username: 'entrenador1',
        email: 'entrenador1@example.com',
        passwordHash: hashedPassword,
        role: 'coach',
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      },
      {
        username: 'entrenador2',
        email: 'entrenador2@example.com',
        passwordHash: hashedPassword,
        role: 'coach',
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      }
    ], { returning: true });
    users.push(...coachUsers);

    // Create coach profiles
    const coachProfiles = await Coach.bulkCreate([
      {
        userId: coachUsers[0].id,
        fullName: 'Ana Patricia González Ruiz',
        dateOfBirth: new Date('1975-09-10'),
        gender: 'F',
        stateId: states.find(s => s.name === 'Ciudad de México')?.id,
        curp: 'GORA750910MDFNZN02',
        nrtpLevel: '5.0',
        mobilePhone: '5559876543',
        nationality: 'Mexicana',
        licenseType: 'Nivel 2 - Instructor Avanzado',
        rankingPosition: 3,
        federationIdNumber: 'FPM-ENT-2024-001'
      },
      {
        userId: coachUsers[1].id,
        fullName: 'José Luis Fernández Castro',
        dateOfBirth: new Date('1980-04-18'),
        gender: 'M',
        stateId: states.find(s => s.name === 'Jalisco')?.id,
        curp: 'FECJ800418HJCRSL05',
        nrtpLevel: '4.5',
        mobilePhone: '3339876543',
        nationality: 'Mexicana',
        licenseType: 'Nivel 1 - Instructor Básico',
        rankingPosition: 8,
        federationIdNumber: 'FPM-ENT-2024-002'
      }
    ]);

    // Club users
    const clubUsers = await User.bulkCreate([
      {
        username: 'club1',
        email: 'contacto@clubpickleball.mx',
        passwordHash: hashedPassword,
        role: 'club',
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      },
      {
        username: 'club2',
        email: 'info@deportesmonterrey.mx',
        passwordHash: hashedPassword,
        role: 'club',
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      }
    ], { returning: true });
    users.push(...clubUsers);

    // Create club profiles
    const clubProfiles = await Club.bulkCreate([
      {
        userId: clubUsers[0].id,
        name: 'Club Pickleball Ciudad de México',
        rfc: 'CPC240101ABC',
        managerName: 'Sandra Patricia Morales Vega',
        managerRole: 'Directora General',
        contactEmail: 'contacto@clubpickleball.mx',
        phone: '5551122334',
        stateId: states.find(s => s.name === 'Ciudad de México')?.id,
        clubType: 'Privado',
        website: 'https://www.clubpickleball.mx',
        socialMedia: {
          facebook: 'clubpickleballcdmx',
          instagram: '@clubpickleballcdmx',
          twitter: '@clubpcmx'
        },
        hasCourts: true,
        planType: 'premium'
      },
      {
        userId: clubUsers[1].id,
        name: 'Centro Deportivo Monterrey',
        rfc: 'CDM240101XYZ',
        managerName: 'Ricardo Alejandro Gutiérrez Soto',
        managerRole: 'Coordinador Deportivo',
        contactEmail: 'info@deportesmonterrey.mx',
        phone: '8112233445',
        stateId: states.find(s => s.name === 'Nuevo León')?.id,
        clubType: 'Público',
        website: 'https://www.deportesmonterrey.mx',
        socialMedia: {
          facebook: 'deportesmonterrey',
          instagram: '@deportesmty'
        },
        hasCourts: true,
        planType: 'basic'
      }
    ]);

    // Partner users
    const partnerUsers = await User.bulkCreate([
      {
        username: 'sponsor1',
        email: 'contacto@deportesmexico.mx',
        passwordHash: hashedPassword,
        role: 'partner',
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      }
    ], { returning: true });
    users.push(...partnerUsers);

    // Create partner profiles
    const partnerProfiles = await Partner.bulkCreate([
      {
        userId: partnerUsers[0].id,
        businessName: 'Deportes México S.A. de C.V.',
        rfc: 'DME240101DEF',
        contactPersonName: 'Alejandro Ramírez Mendoza',
        contactPersonTitle: 'Director de Patrocinios',
        email: 'contacto@deportesmexico.mx',
        phone: '5553344556',
        partnerType: 'Patrocinador Principal',
        website: 'https://www.deportesmexico.mx',
        socialMedia: {
          facebook: 'deportesmexico',
          instagram: '@deportesmx',
          linkedin: 'deportes-mexico-sa'
        },
        planType: 'premium'
      }
    ]);

    // State committee users
    const stateUsers = await User.bulkCreate([
      {
        username: 'comite_cdmx',
        email: 'presidente@pickleballcdmx.mx',
        passwordHash: hashedPassword,
        role: 'state',
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      }
    ], { returning: true });
    users.push(...stateUsers);

    // Create state committee profiles
    const stateProfiles = await StateCommittee.bulkCreate([
      {
        userId: stateUsers[0].id,
        name: 'Asociación de Pickleball de la Ciudad de México',
        rfc: 'APC240101GHI',
        presidentName: 'Licenciada Martha Elena Vázquez Torres',
        presidentTitle: 'Presidenta',
        institutionalEmail: 'presidente@pickleballcdmx.mx',
        phone: '5554455667',
        stateId: states.find(s => s.name === 'Ciudad de México')?.id,
        affiliateType: 'Asociación Civil',
        website: 'https://www.pickleballcdmx.mx',
        socialMedia: {
          facebook: 'pickleballcdmx',
          instagram: '@pickleballcdmx'
        }
      }
    ]);

    return users;
  }

  private async seedMessages(users: any[]) {
    const messages = [];
    
    const adminUser = users.find(u => u.role === 'federation');
    const playerUsers = users.filter(u => u.role === 'player');
    const coachUsers = users.filter(u => u.role === 'coach');
    const clubUsers = users.filter(u => u.role === 'club');

    // Admin messages to players
    const adminToPlayerMessages = await Message.bulkCreate([
      {
        senderId: adminUser.id,
        receiverId: playerUsers[0].id,
        subject: 'Bienvenido a la Federación Mexicana de Pickleball',
        content: 'Nos complace darte la bienvenida como jugador federado. Tu credencial digital ya está disponible en tu dashboard. Por favor, revisa los próximos torneos disponibles en tu área.',
        isRead: false,
        isUrgent: false,
        messageType: 'personal',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        senderId: adminUser.id,
        receiverId: playerUsers[1].id,
        subject: 'Actualización de Ranking Nacional',
        content: 'Tu posición en el ranking nacional ha sido actualizada. Ahora te encuentras en la posición #12. ¡Felicitaciones por tu excelente desempeño!',
        isRead: true,
        isUrgent: false,
        messageType: 'personal',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        senderId: adminUser.id,
        receiverId: playerUsers[2].id,
        subject: 'URGENTE: Renovación de Documentación',
        content: 'Tu documentación vence el próximo mes. Por favor, sube los documentos actualizados lo antes posible para mantener tu estatus activo.',
        isRead: false,
        isUrgent: true,
        messageType: 'system',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ]);
    messages.push(...adminToPlayerMessages);

    // Coach to admin messages
    const coachToAdminMessages = await Message.bulkCreate([
      {
        senderId: coachUsers[0].id,
        receiverId: adminUser.id,
        subject: 'Solicitud de Certificación Nivel 3',
        content: 'Buenos días. Me dirijo a ustedes para solicitar información sobre el proceso de certificación para instructor Nivel 3. Actualmente cuento con certificación Nivel 2 y 5 años de experiencia. Adjunto mi curriculum deportivo.',
        isRead: false,
        isUrgent: false,
        messageType: 'personal',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        senderId: coachUsers[1].id,
        receiverId: adminUser.id,
        subject: 'Reporte de Actividades - Enero 2024',
        content: 'Envío el reporte mensual de actividades: 45 clases impartidas, 12 nuevos estudiantes, 3 competencias organizadas. Todos los estudiantes han mostrado progreso satisfactorio.',
        isRead: true,
        isUrgent: false,
        messageType: 'personal',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      }
    ]);
    messages.push(...coachToAdminMessages);

    // Club to admin messages
    const clubToAdminMessages = await Message.bulkCreate([
      {
        senderId: clubUsers[0].id,
        receiverId: adminUser.id,
        subject: 'Solicitud de Torneo Oficial',
        content: 'Estimados colegas de la Federación. Solicitamos autorización para organizar el "Torneo Primavera Ciudad de México 2024" los días 15-17 de marzo. Contamos con 6 canchas reglamentarias y capacidad para 120 participantes.',
        isRead: false,
        isUrgent: false,
        messageType: 'personal',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      }
    ]);
    messages.push(...clubToAdminMessages);

    return messages;
  }

  private async seedNotifications(users: any[]) {
    const notifications = [];
    
    const playerUsers = users.filter(u => u.role === 'player');
    const coachUsers = users.filter(u => u.role === 'coach');
    const clubUsers = users.filter(u => u.role === 'club');

    // Player notifications
    const playerNotifications = await Notification.bulkCreate([
      {
        userId: playerUsers[0].id,
        title: 'Nuevo torneo disponible',
        message: 'Se ha publicado un nuevo torneo en tu área: "Copa Ciudad de México 2024". Regístrate antes del 15 de marzo.',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        actionUrl: '/tournaments/copa-cdmx-2024'
      },
      {
        userId: playerUsers[0].id,
        title: 'Pago procesado exitosamente',
        message: 'Tu membresía anual ha sido renovada exitosamente. Válida hasta marzo 2025.',
        type: 'success',
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        actionUrl: '/account/membership'
      },
      {
        userId: playerUsers[1].id,
        title: 'Actualización de ranking',
        message: 'Tu posición en el ranking nacional ha mejorado. Ahora estás en el puesto #12.',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        actionUrl: '/ranking'
      },
      {
        userId: playerUsers[2].id,
        title: 'Documento requerido',
        message: 'Tu credencial vence pronto. Renueva tu documentación antes del 28 de febrero.',
        type: 'warning',
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        actionUrl: '/documents/renewal'
      }
    ]);
    notifications.push(...playerNotifications);

    // Coach notifications
    const coachNotifications = await Notification.bulkCreate([
      {
        userId: coachUsers[0].id,
        title: 'Nueva oportunidad de certificación',
        message: 'Ya está abierto el proceso de certificación Nivel 3 para instructores. Fecha límite: 31 de marzo.',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        actionUrl: '/certifications/level-3'
      },
      {
        userId: coachUsers[1].id,
        title: 'Reporte mensual pendiente',
        message: 'Recuerda enviar tu reporte mensual de actividades antes del 5 de cada mes.',
        type: 'warning',
        isRead: false,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        actionUrl: '/reports/monthly'
      }
    ]);
    notifications.push(...coachNotifications);

    // Club notifications
    const clubNotifications = await Notification.bulkCreate([
      {
        userId: clubUsers[0].id,
        title: 'Solicitud de torneo en revisión',
        message: 'Tu solicitud para el "Torneo Primavera Ciudad de México 2024" está siendo revisada por el comité técnico.',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        actionUrl: '/tournaments/requests/primavera-cdmx-2024'
      },
      {
        userId: clubUsers[1].id,
        title: 'Actualización de membresía',
        message: 'Tu plan básico está próximo a vencer. Considera actualizar a plan Premium para más beneficios.',
        type: 'warning',
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        actionUrl: '/subscription/upgrade'
      }
    ]);
    notifications.push(...clubNotifications);

    return notifications;
  }

  private async seedCourts(states: any[], users: any[]) {
    const clubUsers = users.filter(u => u.role === 'club');
    const partnerUsers = users.filter(u => u.role === 'partner');

    const courtData = [
      // Club courts
      {
        name: 'Cancha Principal CDMX',
        description: 'Cancha principal del Club Pickleball Ciudad de México con superficie profesional y excelente iluminación LED.',
        surfaceType: 'concrete',
        ownerType: 'club',
        ownerId: clubUsers[0].id,
        stateId: states.find(s => s.name === 'Ciudad de México')?.id,
        address: 'Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de México, CDMX 03100',
        latitude: 19.3910,
        longitude: -99.1620,
        amenities: ['lighting', 'seating', 'parking', 'restrooms', 'water_fountain', 'equipment_rental'],
        hourlyRate: 350.00,
        peakHourRate: 450.00,
        weekendRate: 400.00,
        images: [
          'https://example.com/court1-main.jpg',
          'https://example.com/court1-night.jpg',
          'https://example.com/court1-seating.jpg'
        ],
        isActive: true,
        operatingHours: {
          0: { isOpen: true, startTime: '08:00', endTime: '20:00' }, // Sunday
          1: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Monday
          2: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Tuesday
          3: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Wednesday
          4: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Thursday
          5: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Friday
          6: { isOpen: true, startTime: '07:00', endTime: '21:00' }  // Saturday
        },
        maxAdvanceBookingDays: 30,
        minBookingDuration: 60,
        maxBookingDuration: 180,
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes. 50% de reembolso entre 2-24 horas antes.'
      },
      {
        name: 'Cancha Secundaria CDMX',
        description: 'Segunda cancha del club con las mismas especificaciones técnicas que la cancha principal.',
        surfaceType: 'asphalt',
        ownerType: 'club',
        ownerId: clubUsers[0].id,
        stateId: states.find(s => s.name === 'Ciudad de México')?.id,
        address: 'Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de México, CDMX 03100',
        latitude: 19.3912,
        longitude: -99.1618,
        amenities: ['lighting', 'seating', 'parking', 'restrooms', 'water_fountain'],
        hourlyRate: 300.00,
        peakHourRate: 400.00,
        weekendRate: 350.00,
        images: [
          'https://example.com/court2-main.jpg',
          'https://example.com/court2-overview.jpg'
        ],
        isActive: true,
        operatingHours: {
          0: { isOpen: true, startTime: '08:00', endTime: '20:00' },
          1: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          2: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          3: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          4: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          5: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          6: { isOpen: true, startTime: '07:00', endTime: '21:00' }
        },
        maxAdvanceBookingDays: 30,
        minBookingDuration: 60,
        maxBookingDuration: 180,
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes. 50% de reembolso entre 2-24 horas antes.'
      },
      {
        name: 'Cancha Norte Monterrey',
        description: 'Cancha al aire libre con vista panorámica de la Sierra Madre Oriental.',
        surfaceType: 'concrete',
        ownerType: 'club',
        ownerId: clubUsers[1].id,
        stateId: states.find(s => s.name === 'Nuevo León')?.id,
        address: 'Av. Constitución 456, Col. Centro, Monterrey, NL 64000',
        latitude: 25.6866,
        longitude: -100.3161,
        amenities: ['lighting', 'seating', 'parking', 'restrooms', 'cafeteria'],
        hourlyRate: 280.00,
        peakHourRate: 380.00,
        weekendRate: 320.00,
        images: [
          'https://example.com/court3-main.jpg',
          'https://example.com/court3-view.jpg'
        ],
        isActive: true,
        operatingHours: {
          0: { isOpen: true, startTime: '07:00', endTime: '19:00' },
          1: { isOpen: true, startTime: '06:00', endTime: '21:00' },
          2: { isOpen: true, startTime: '06:00', endTime: '21:00' },
          3: { isOpen: true, startTime: '06:00', endTime: '21:00' },
          4: { isOpen: true, startTime: '06:00', endTime: '21:00' },
          5: { isOpen: true, startTime: '06:00', endTime: '21:00' },
          6: { isOpen: true, startTime: '07:00', endTime: '20:00' }
        },
        maxAdvanceBookingDays: 21,
        minBookingDuration: 60,
        maxBookingDuration: 120,
        cancellationPolicy: 'Cancelación gratuita hasta 12 horas antes.'
      },
      {
        name: 'Cancha Sur Monterrey',
        description: 'Segunda cancha del Centro Deportivo Monterrey con superficie de primera calidad.',
        surfaceType: 'composite',
        ownerType: 'club',
        ownerId: clubUsers[1].id,
        stateId: states.find(s => s.name === 'Nuevo León')?.id,
        address: 'Av. Constitución 456, Col. Centro, Monterrey, NL 64000',
        latitude: 25.6864,
        longitude: -100.3163,
        amenities: ['lighting', 'seating', 'parking', 'restrooms'],
        hourlyRate: 260.00,
        peakHourRate: 360.00,
        weekendRate: 300.00,
        images: [
          'https://example.com/court4-main.jpg'
        ],
        isActive: true,
        operatingHours: {
          0: { isOpen: true, startTime: '07:00', endTime: '19:00' },
          1: { isOpen: true, startTime: '06:00', endTime: '21:00' },
          2: { isOpen: true, startTime: '06:00', endTime: '21:00' },
          3: { isOpen: true, startTime: '06:00', endTime: '21:00' },
          4: { isOpen: true, startTime: '06:00', endTime: '21:00' },
          5: { isOpen: true, startTime: '06:00', endTime: '21:00' },
          6: { isOpen: true, startTime: '07:00', endTime: '20:00' }
        },
        maxAdvanceBookingDays: 21,
        minBookingDuration: 60,
        maxBookingDuration: 120,
        cancellationPolicy: 'Cancelación gratuita hasta 12 horas antes.'
      },
      // Partner courts
      {
        name: 'Cancha Premium Deportes México',
        description: 'Cancha de exhibición con las más altas especificaciones técnicas, ideal para torneos profesionales.',
        surfaceType: 'acrylic',
        ownerType: 'partner',
        ownerId: partnerUsers[0].id,
        stateId: states.find(s => s.name === 'Ciudad de México')?.id,
        address: 'Polanco Business Center, Av. Presidente Masaryk 111, Polanco, CDMX 11560',
        latitude: 19.4326,
        longitude: -99.1949,
        amenities: ['professional_lighting', 'vip_seating', 'valet_parking', 'premium_restrooms', 'pro_shop', 'equipment_rental', 'cafeteria'],
        hourlyRate: 500.00,
        peakHourRate: 650.00,
        weekendRate: 580.00,
        images: [
          'https://example.com/court5-premium.jpg',
          'https://example.com/court5-night.jpg',
          'https://example.com/court5-seating.jpg',
          'https://example.com/court5-facilities.jpg'
        ],
        isActive: true,
        operatingHours: {
          0: { isOpen: true, startTime: '08:00', endTime: '22:00' },
          1: { isOpen: true, startTime: '06:00', endTime: '23:00' },
          2: { isOpen: true, startTime: '06:00', endTime: '23:00' },
          3: { isOpen: true, startTime: '06:00', endTime: '23:00' },
          4: { isOpen: true, startTime: '06:00', endTime: '23:00' },
          5: { isOpen: true, startTime: '06:00', endTime: '23:00' },
          6: { isOpen: true, startTime: '07:00', endTime: '22:00' }
        },
        maxAdvanceBookingDays: 60,
        minBookingDuration: 90,
        maxBookingDuration: 240,
        cancellationPolicy: 'Cancelación gratuita hasta 48 horas antes. 25% de reembolso entre 24-48 horas antes.'
      },
      {
        name: 'Cancha Entrenamiento Deportes México',
        description: 'Cancha dedicada a entrenamientos y clínicas con entrenadores certificados.',
        surfaceType: 'concrete',
        ownerType: 'partner',
        ownerId: partnerUsers[0].id,
        stateId: states.find(s => s.name === 'Ciudad de México')?.id,
        address: 'Polanco Business Center, Av. Presidente Masaryk 111, Polanco, CDMX 11560',
        latitude: 19.4328,
        longitude: -99.1947,
        amenities: ['lighting', 'seating', 'parking', 'restrooms', 'equipment_rental', 'coaching_area'],
        hourlyRate: 400.00,
        peakHourRate: 520.00,
        weekendRate: 460.00,
        images: [
          'https://example.com/court6-training.jpg',
          'https://example.com/court6-coaching.jpg'
        ],
        isActive: true,
        operatingHours: {
          0: { isOpen: true, startTime: '08:00', endTime: '20:00' },
          1: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          2: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          3: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          4: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          5: { isOpen: true, startTime: '06:00', endTime: '22:00' },
          6: { isOpen: true, startTime: '07:00', endTime: '21:00' }
        },
        maxAdvanceBookingDays: 45,
        minBookingDuration: 60,
        maxBookingDuration: 180,
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes. 50% de reembolso entre 2-24 horas antes.'
      }
    ];

    return await Court.bulkCreate(courtData);
  }

  private async seedReservations(courts: any[], users: any[]) {
    const playerUsers = users.filter(u => u.role === 'player');
    const reservations = [];

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const reservationData = [
      // Future reservations
      {
        courtId: courts[0].id,
        userId: playerUsers[0].id,
        reservationDate: formatDate(tomorrow),
        startTime: '18:00',
        endTime: '19:30',
        duration: 90,
        baseRate: 350.00,
        peakRateMultiplier: 1.29,
        weekendRateMultiplier: 1,
        subtotal: 451.50,
        taxAmount: 72.24,
        totalAmount: 523.74,
        status: 'confirmed',
        notes: 'Juego con amigos del trabajo'
      },
      {
        courtId: courts[1].id,
        userId: playerUsers[1].id,
        reservationDate: formatDate(dayAfterTomorrow),
        startTime: '08:00',
        endTime: '09:00',
        duration: 60,
        baseRate: 300.00,
        peakRateMultiplier: 1.33,
        weekendRateMultiplier: 1,
        subtotal: 399.00,
        taxAmount: 63.84,
        totalAmount: 462.84,
        status: 'pending',
        notes: 'Entrenamiento matutino'
      },
      {
        courtId: courts[4].id, // Premium court
        userId: playerUsers[2].id,
        reservationDate: formatDate(dayAfterTomorrow),
        startTime: '19:00',
        endTime: '21:00',
        duration: 120,
        baseRate: 500.00,
        peakRateMultiplier: 1.30,
        weekendRateMultiplier: 1,
        subtotal: 1300.00,
        taxAmount: 208.00,
        totalAmount: 1508.00,
        status: 'confirmed',
        notes: 'Torneo de práctica'
      },
      // Past completed reservations
      {
        courtId: courts[0].id,
        userId: playerUsers[0].id,
        reservationDate: formatDate(yesterday),
        startTime: '16:00',
        endTime: '17:30',
        duration: 90,
        baseRate: 350.00,
        peakRateMultiplier: 1,
        weekendRateMultiplier: 1,
        subtotal: 525.00,
        taxAmount: 84.00,
        totalAmount: 609.00,
        status: 'completed',
        checkedInAt: new Date(yesterday.getTime() + 16 * 60 * 60 * 1000), // 4 PM yesterday
        checkedOutAt: new Date(yesterday.getTime() + 17.5 * 60 * 60 * 1000), // 5:30 PM yesterday
        notes: 'Excelente sesión de entrenamiento'
      },
      {
        courtId: courts[2].id,
        userId: playerUsers[1].id,
        reservationDate: formatDate(lastWeek),
        startTime: '10:00',
        endTime: '12:00',
        duration: 120,
        baseRate: 280.00,
        peakRateMultiplier: 1,
        weekendRateMultiplier: 1.14,
        subtotal: 638.40,
        taxAmount: 102.14,
        totalAmount: 740.54,
        status: 'completed',
        checkedInAt: new Date(lastWeek.getTime() + 10 * 60 * 60 * 1000),
        checkedOutAt: new Date(lastWeek.getTime() + 12 * 60 * 60 * 1000),
        notes: 'Partido de dobles muy competitivo'
      },
      {
        courtId: courts[3].id,
        userId: playerUsers[2].id,
        reservationDate: formatDate(lastWeek),
        startTime: '14:00',
        endTime: '15:00',
        duration: 60,
        baseRate: 260.00,
        peakRateMultiplier: 1,
        weekendRateMultiplier: 1.15,
        subtotal: 299.00,
        taxAmount: 47.84,
        totalAmount: 346.84,
        status: 'completed',
        checkedInAt: new Date(lastWeek.getTime() + 14 * 60 * 60 * 1000),
        checkedOutAt: new Date(lastWeek.getTime() + 15 * 60 * 60 * 1000),
        notes: 'Práctica individual'
      }
    ];

    return await Reservation.bulkCreate(reservationData);
  }

  private async seedCourtReviews(courts: any[], reservations: any[], users: any[]) {
    const playerUsers = users.filter(u => u.role === 'player');
    const completedReservations = reservations.filter(r => r.status === 'completed');

    const reviewData = [
      {
        userId: playerUsers[0].id,
        courtId: courts[0].id,
        reservationId: completedReservations[0].id,
        overallRating: 5,
        lightingRating: 5,
        surfaceRating: 4,
        facilitiesRating: 5,
        accessibilityRating: 4,
        comment: 'Excelente cancha! La iluminación LED es perfecta para juegos nocturnos y el personal es muy amable. Definitivamente regresaré.',
        wouldRecommend: true,
        isVerified: true
      },
      {
        userId: playerUsers[1].id,
        courtId: courts[2].id,
        reservationId: completedReservations[1].id,
        overallRating: 4,
        lightingRating: 4,
        surfaceRating: 5,
        facilitiesRating: 4,
        accessibilityRating: 5,
        comment: 'Muy buena cancha con excelente superficie. La vista es hermosa y las instalaciones están bien mantenidas. El único detalle es que la iluminación podría mejorar un poco.',
        wouldRecommend: true,
        isVerified: true
      },
      {
        userId: playerUsers[2].id,
        courtId: courts[3].id,
        reservationId: completedReservations[2].id,
        overallRating: 3,
        lightingRating: 3,
        surfaceRating: 4,
        facilitiesRating: 3,
        accessibilityRating: 4,
        comment: 'Cancha decente para el precio. La superficie está en buen estado pero las instalaciones podrían estar mejor mantenidas. Es funcional pero no excepcional.',
        wouldRecommend: false,
        isVerified: true
      },
      // Additional reviews for better data diversity
      {
        userId: playerUsers[0].id,
        courtId: courts[4].id, // Premium court
        reservationId: null, // Not linked to specific reservation
        overallRating: 5,
        lightingRating: 5,
        surfaceRating: 5,
        facilitiesRating: 5,
        accessibilityRating: 5,
        comment: '¡Simplemente espectacular! Esta cancha premium realmente vale la pena. Las instalaciones son de primera clase y la experiencia es inigualable.',
        wouldRecommend: true,
        isVerified: false // Not from a completed reservation
      },
      {
        userId: playerUsers[1].id,
        courtId: courts[1].id,
        reservationId: null,
        overallRating: 4,
        lightingRating: 4,
        surfaceRating: 3,
        facilitiesRating: 4,
        accessibilityRating: 4,
        comment: 'Buena cancha secundaria, aunque la superficie de asfalto no es mi favorita. Pero el precio es justo y está bien ubicada.',
        wouldRecommend: true,
        isVerified: false
      }
    ];

    return await CourtReview.bulkCreate(reviewData);
  }

  private async seedCourtSchedules(courts: any[]) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const scheduleData = [
      // Maintenance block
      {
        courtId: courts[1].id,
        date: formatDate(tomorrow),
        startTime: '12:00',
        endTime: '14:00',
        isBlocked: true,
        blockType: 'maintenance',
        blockReason: 'Mantenimiento de superficie y redes',
        notes: 'Cambio de redes y reparación menor de superficie'
      },
      // Private event block
      {
        courtId: courts[4].id, // Premium court
        date: formatDate(nextWeek),
        startTime: '09:00',
        endTime: '17:00',
        isBlocked: true,
        blockType: 'private_event',
        blockReason: 'Torneo corporativo privado',
        notes: 'Evento empresarial - Torneo Anual Deportes México'
      },
      // Weather block
      {
        courtId: courts[2].id,
        date: formatDate(tomorrow),
        startTime: '06:00',
        endTime: '10:00',
        isBlocked: true,
        blockType: 'weather',
        blockReason: 'Cancha húmeda por lluvia matutina',
        notes: 'Suspendido por condiciones meteorológicas'
      },
      // Special rate period
      {
        courtId: courts[0].id,
        date: formatDate(nextWeek),
        startTime: '14:00',
        endTime: '16:00',
        isBlocked: false,
        specialRate: 280.00,
        notes: 'Precio especial para promoción de horas valle'
      }
    ];

    return await CourtSchedule.bulkCreate(scheduleData);
  }

  private printTestAccounts() {
    console.log('\n🔐 Test Accounts Created:');
    console.log('========================================');
    console.log('Admin: admin@federacionpickleball.mx / password123');
    console.log('Player 1: jugador1@example.com / password123');
    console.log('Player 2: jugador2@example.com / password123');
    console.log('Player 3: jugador3@example.com / password123');
    console.log('Coach 1: entrenador1@example.com / password123');
    console.log('Coach 2: entrenador2@example.com / password123');
    console.log('Club 1: contacto@clubpickleball.mx / password123');
    console.log('Club 2: info@deportesmonterrey.mx / password123');
    console.log('Partner: contacto@deportesmexico.mx / password123');
    console.log('State Committee: presidente@pickleballcdmx.mx / password123');
    console.log('========================================');
    console.log('\n🏟️ Courts Created:');
    console.log('========================================');
    console.log('- 6 courts across different owners and states');
    console.log('- Multiple surface types and amenities');
    console.log('- Varied pricing and operating hours');
    console.log('- Sample reservations and reviews');
    console.log('- Court schedules with blocks and special rates');
    console.log('========================================\n');
  }
}

// Export seeder instance
export default new DatabaseSeeder();