import sequelize from '../config/database';
import { seedStates } from './stateSeeder';
import { seedMembershipPlans } from './membershipPlanSeeder';
import { seedUsers } from './userSeeder';
import { seedCourts } from './courtSeeder';
import { seedMicrositeData } from './micrositeSeeder';
import { seedTournaments } from './tournamentSeeder';
import { seedMembershipsAndPayments } from './membershipPaymentSeeder';
import { seedRankingsAndCredentials } from './rankingCredentialSeeder';
import { seedPlayerFinder } from './playerFinderSeeder';
import { seedConversations } from './conversationSeeder';
import { seedTournamentMatches } from './tournamentMatchSeeder';
import { seedMediaAndModeration } from './mediaFileSeeder';

export class DatabaseSeeder {
  async run() {
    try {
      console.log('🌱 Starting database seeding...');
      console.log('📊 Syncing database...');

      // Sync database - be careful with force: true in production
      await sequelize.sync({ force: true });
      console.log('✅ Database synced successfully');

      // Seed states first (required for users)
      const states = await seedStates();

      // Seed membership plans
      const plans = await seedMembershipPlans();

      // Seed users and their profiles
      const users = await seedUsers(states);

      // Seed courts
      const courts = await seedCourts(states, users);

      // Seed tournaments and related data
      const { tournaments, categories } = await seedTournaments(states, users);

      // Seed memberships and payments  
      const { memberships, payments, invoices } = await seedMembershipsAndPayments(users, plans);

      // Seed rankings and credentials
      const { rankings, credentials } = await seedRankingsAndCredentials(users, states);

      // Seed player finder system
      const { playerLocations, finderRequests, finderMatches } = await seedPlayerFinder(users, states);

      // Seed conversations and messaging
      const { conversations, messages } = await seedConversations(users);

      // Seed basic messages and notifications (legacy)
      await this.seedMessages(users);
      await this.seedNotifications(users);

      // Seed basic reservations and reviews
      await this.seedReservations(courts, users);
      await this.seedCourtSchedules(courts);

      // Seed microsite data
      await seedMicrositeData();

      // Seed tournament matches and brackets
      const { brackets, matches } = await seedTournamentMatches(tournaments, categories, users, courts);

      // Seed media files and moderation logs
      const { mediaFiles, moderationLogs } = await seedMediaAndModeration(users);

      console.log('🎉 Database seeding completed successfully!');
      
      // Print test accounts
      this.printTestAccounts();

    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }

  private async seedMessages(users: any[]) {
    const Message = (await import('../models/Message')).default;
    
    console.log('💬 Seeding messages...');
    
    const adminUser = users.find(u => u.role === 'federation');
    const playerUsers = users.filter(u => u.role === 'player');
    const coachUsers = users.filter(u => u.role === 'coach');
    const clubUsers = users.filter(u => u.role === 'club');

    if (!adminUser || playerUsers.length === 0) {
      console.log('⚠️ Skipping messages - no admin or player users found');
      return [];
    }

    const messages = await Message.bulkCreate([
      {
        senderId: adminUser.id,
        receiverId: playerUsers[0].id,
        subject: 'Bienvenido a la Federación Mexicana de Pickleball',
        content: 'Nos complace darte la bienvenida como jugador federado. Tu credencial digital ya está disponible en tu dashboard. Por favor, revisa los próximos torneos disponibles en tu área.',
        isRead: false,
        isUrgent: false,
        messageType: 'personal',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        senderId: adminUser.id,
        receiverId: playerUsers[1]?.id || playerUsers[0].id,
        subject: 'Actualización de Ranking Nacional',
        content: 'Tu posición en el ranking nacional ha sido actualizada. Ahora te encuentras en una mejor posición. ¡Felicitaciones por tu excelente desempeño!',
        isRead: true,
        isUrgent: false,
        messageType: 'personal',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ], { ignoreDuplicates: true, returning: true });

    console.log(`✅ Seeded ${messages.length} messages`);
    return messages;
  }

  private async seedNotifications(users: any[]) {
    const Notification = (await import('../models/Notification')).default;
    
    console.log('🔔 Seeding notifications...');
    
    const playerUsers = users.filter(u => u.role === 'player');
    const coachUsers = users.filter(u => u.role === 'coach');

    if (playerUsers.length === 0) {
      console.log('⚠️ Skipping notifications - no player users found');
      return [];
    }

    const notifications = await Notification.bulkCreate([
      {
        userId: playerUsers[0].id,
        title: 'Nuevo torneo disponible',
        message: 'Se ha publicado un nuevo torneo en tu área: "Copa Primavera 2024". Regístrate antes del 15 de marzo.',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        actionUrl: '/tournaments/copa-primavera-2024'
      },
      {
        userId: playerUsers[0].id,
        title: 'Pago procesado exitosamente',
        message: 'Tu membresía anual ha sido renovada exitosamente. Válida hasta marzo 2025.',
        type: 'success',
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actionUrl: '/account/membership'
      }
    ], { ignoreDuplicates: true, returning: true });

    console.log(`✅ Seeded ${notifications.length} notifications`);
    return notifications;
  }

  private async seedReservations(courts: any[], users: any[]) {
    const Reservation = (await import('../models/Reservation')).default;
    const CourtReview = (await import('../models/CourtReview')).default;
    
    console.log('📅 Seeding reservations and reviews...');
    
    const playerUsers = users.filter(u => u.role === 'player');
    
    if (courts.length === 0 || playerUsers.length === 0) {
      console.log('⚠️ Skipping reservations - no courts or player users found');
      return [];
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Create sample reservations
    const reservations = await Reservation.bulkCreate([
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
        checkedInAt: new Date(yesterday.getTime() + 16 * 60 * 60 * 1000),
        checkedOutAt: new Date(yesterday.getTime() + 17.5 * 60 * 60 * 1000),
        notes: 'Excelente sesión de entrenamiento'
      }
    ], { ignoreDuplicates: true, returning: true });

    // Create sample reviews for completed reservations
    const completedReservations = reservations.filter(r => r.status === 'completed');
    
    if (completedReservations.length > 0) {
      await CourtReview.bulkCreate([
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
        }
      ], { ignoreDuplicates: true });
    }

    console.log(`✅ Seeded ${reservations.length} reservations and reviews`);
    return reservations;
  }

  private async seedCourtSchedules(courts: any[]) {
    const CourtSchedule = (await import('../models/CourtSchedule')).default;
    
    console.log('📋 Seeding court schedules...');
    
    if (courts.length === 0) {
      console.log('⚠️ Skipping court schedules - no courts found');
      return [];
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const schedules = await CourtSchedule.bulkCreate([
      {
        courtId: courts[1]?.id || courts[0].id,
        date: formatDate(tomorrow),
        startTime: '12:00',
        endTime: '14:00',
        isBlocked: true,
        blockType: 'maintenance',
        blockReason: 'Mantenimiento de superficie y redes',
        notes: 'Cambio de redes y reparación menor de superficie'
      },
      {
        courtId: courts[0].id,
        date: formatDate(nextWeek),
        startTime: '14:00',
        endTime: '16:00',
        isBlocked: false,
        specialRate: 280.00,
        notes: 'Precio especial para promoción de horas valle'
      }
    ], { ignoreDuplicates: true, returning: true });

    console.log(`✅ Seeded ${schedules.length} court schedules`);
    return schedules;
  }

  private printTestAccounts() {
    console.log('\n🔐 Test Accounts Created:');
    console.log('========================================');
    console.log('Federation Admin: admin@federacionpickleball.mx / password123');
    console.log('Player 1: jugador1@example.com / password123');
    console.log('Player 2: jugador2@example.com / password123');
    console.log('Player 3: jugador3@example.com / password123');
    console.log('Player 4: maria.santos@email.com / password123');
    console.log('Player 5: carlos.rivera@email.com / password123');
    console.log('Coach 1: entrenador1@example.com / password123');
    console.log('Coach 2: ana.gonzalez@coaching.mx / password123');
    console.log('Coach 3: luis.fernandez@coaching.mx / password123');
    console.log('Club 1: contacto@clubpickleball.mx / password123');
    console.log('Club 2: info@deportesmonterrey.mx / password123');
    console.log('Club 3: contacto@pickleballgdl.mx / password123');
    console.log('Partner 1: contacto@deportesmexico.mx / password123');
    console.log('Partner 2: eventos@hotelriviera.mx / password123');
    console.log('State CDMX: presidente@pickleballcdmx.mx / password123');
    console.log('State Jalisco: contacto@pickleballjalisco.mx / password123');
    console.log('========================================');
    console.log('\n🏟️ Infrastructure Created:');
    console.log('========================================');
    console.log('- 32 Mexican states');
    console.log('- 6 membership plans (basic/premium for each role)');
    console.log('- 9+ courts across different owners and states');
    console.log('- Multiple surface types and amenities');
    console.log('- Varied pricing and operating hours');
    console.log('- Sample reservations, reviews, and schedules');
    console.log('- Complete microsite system with themes');
    console.log('========================================\n');
  }
}

export default new DatabaseSeeder();