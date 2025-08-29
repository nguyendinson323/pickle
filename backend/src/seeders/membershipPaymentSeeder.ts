import Membership from '../models/Membership';
import Payment from '../models/Payment';
import Invoice from '../models/Invoice';

export const seedMembershipsAndPayments = async (users: any[], plans: any[]): Promise<any> => {
  console.log('💳 Seeding memberships and payments...');
  
  const playerUsers = users.filter(u => u.role === 'player');
  const coachUsers = users.filter(u => u.role === 'coach');
  const clubUsers = users.filter(u => u.role === 'club');
  const partnerUsers = users.filter(u => u.role === 'partner');
  const stateUsers = users.filter(u => u.role === 'state');

  const today = new Date();
  const oneYearFromNow = new Date(today);
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sixMonthsFromNow = new Date(today);
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  // Create memberships with proper data types
  const memberships = await Membership.bulkCreate([
    // Active player memberships
    {
      userId: playerUsers[0]?.id,
      membershipPlanId: plans.find(p => p.role === 'player' && p.planType === 'basic')?.id,
      status: 'active',
      startDate: sixMonthsAgo,
      endDate: sixMonthsFromNow,
      isAutoRenew: false,
      stripeSubscriptionId: 'sub_player1_basic',
      renewalReminderSent: false,
      expirationReminderSent: false
    },
    {
      userId: playerUsers[1]?.id,
      membershipPlanId: plans.find(p => p.role === 'player' && p.planType === 'premium')?.id,
      status: 'active',
      startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 335 * 24 * 60 * 60 * 1000),
      isAutoRenew: true,
      stripeSubscriptionId: 'sub_player2_premium',
      renewalReminderSent: false,
      expirationReminderSent: false
    },
    {
      userId: playerUsers[2]?.id,
      membershipPlanId: plans.find(p => p.role === 'player' && p.planType === 'basic')?.id,
      status: 'expired',
      startDate: new Date(today.getTime() - 400 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000),
      isAutoRenew: false,
      stripeSubscriptionId: 'sub_player3_basic_expired',
      renewalReminderSent: true,
      expirationReminderSent: true
    },

    // Coach memberships
    {
      userId: coachUsers[0]?.id,
      membershipPlanId: plans.find(p => p.role === 'coach' && p.planType === 'basic')?.id,
      status: 'active',
      startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 275 * 24 * 60 * 60 * 1000),
      isAutoRenew: true,
      stripeSubscriptionId: 'sub_coach1_basic',
      renewalReminderSent: false,
      expirationReminderSent: false
    },

    // Club memberships
    {
      userId: clubUsers[0]?.id,
      membershipPlanId: plans.find(p => p.role === 'club' && p.planType === 'premium')?.id,
      status: 'active',
      startDate: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 185 * 24 * 60 * 60 * 1000),
      isAutoRenew: true,
      stripeSubscriptionId: 'sub_club1_premium',
      renewalReminderSent: false,
      expirationReminderSent: false
    },
    {
      userId: clubUsers[1]?.id,
      membershipPlanId: plans.find(p => p.role === 'club' && p.planType === 'basic')?.id,
      status: 'active',
      startDate: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 305 * 24 * 60 * 60 * 1000),
      isAutoRenew: false,
      stripeSubscriptionId: 'sub_club2_basic',
      renewalReminderSent: false,
      expirationReminderSent: false
    },

    // Partner membership
    {
      userId: partnerUsers[0]?.id,
      membershipPlanId: plans.find(p => p.role === 'partner' && p.planType === 'premium')?.id,
      status: 'active',
      startDate: new Date(today.getTime() - 100 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 265 * 24 * 60 * 60 * 1000),
      isAutoRenew: true,
      stripeSubscriptionId: 'sub_partner1_premium',
      renewalReminderSent: false,
      expirationReminderSent: false
    },

    // State committee membership
    {
      userId: stateUsers[0]?.id,
      membershipPlanId: plans.find(p => p.role === 'state' && p.planType === 'basic')?.id,
      status: 'active',
      startDate: new Date(today.getTime() - 200 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 165 * 24 * 60 * 60 * 1000),
      isAutoRenew: true,
      stripeSubscriptionId: 'sub_state1_basic',
      renewalReminderSent: false,
      expirationReminderSent: false
    }
  ], { returning: true });

  // Create payments with proper decimal values and enums
  const payments = await Payment.bulkCreate([
    // Player payments
    {
      userId: playerUsers[0]?.id,
      membershipPlanId: plans.find(p => p.role === 'player' && p.planType === 'basic')?.id,
      paymentType: 'membership',
      status: 'succeeded',
      amount: 800.00,
      currency: 'mxn',
      stripePaymentIntentId: 'pi_player1_membership',
      stripeCustomerId: 'cus_player1',
      stripeChargeId: 'ch_player1_membership',
      paymentMethod: 'card',
      subtotal: 689.66,
      taxAmount: 110.34,
      totalAmount: 800.00,
      description: 'Membresía Básica de Jugador - Anual',
      referenceId: memberships[0]?.id,
      referenceType: 'membership',
      metadata: { plan: 'basic', period: 'annual' },
      paidAt: sixMonthsAgo
    },
    {
      userId: playerUsers[1]?.id,
      membershipPlanId: plans.find(p => p.role === 'player' && p.planType === 'premium')?.id,
      paymentType: 'membership',
      status: 'succeeded',
      amount: 1500.00,
      currency: 'mxn',
      stripePaymentIntentId: 'pi_player2_membership',
      stripeCustomerId: 'cus_player2',
      stripeChargeId: 'ch_player2_membership',
      paymentMethod: 'card',
      subtotal: 1293.10,
      taxAmount: 206.90,
      totalAmount: 1500.00,
      description: 'Membresía Premium de Jugador - Anual',
      referenceId: memberships[1]?.id,
      referenceType: 'membership',
      metadata: { plan: 'premium', period: 'annual' },
      paidAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    },
    
    // Tournament payment
    {
      userId: playerUsers[0]?.id,
      membershipPlanId: null,
      paymentType: 'tournament',
      status: 'succeeded',
      amount: 800.00,
      currency: 'mxn',
      stripePaymentIntentId: 'pi_player1_tournament',
      stripeCustomerId: 'cus_player1',
      stripeChargeId: 'ch_player1_tournament',
      paymentMethod: 'card',
      subtotal: 689.66,
      taxAmount: 110.34,
      totalAmount: 800.00,
      description: 'Inscripción - Copa Ciudad de México Primavera 2024',
      referenceId: 1, // Tournament ID
      referenceType: 'tournament',
      metadata: { tournamentName: 'Copa Ciudad de México', category: 'Nivel 3.0 - 3.5' },
      paidAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
    },

    // Court rental payment
    {
      userId: playerUsers[2]?.id,
      membershipPlanId: null,
      paymentType: 'court_rental',
      status: 'succeeded',
      amount: 523.74,
      currency: 'mxn',
      stripePaymentIntentId: 'pi_player3_court',
      stripeCustomerId: 'cus_player3',
      stripeChargeId: 'ch_player3_court',
      paymentMethod: 'card',
      subtotal: 451.50,
      taxAmount: 72.24,
      totalAmount: 523.74,
      description: 'Reserva de cancha - 90 minutos',
      referenceId: 1, // Reservation ID
      referenceType: 'reservation',
      metadata: { courtName: 'Cancha Principal CDMX', duration: 90, date: '2024-03-15' },
      paidAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    },

    // Club premium membership payment
    {
      userId: clubUsers[0]?.id,
      membershipPlanId: plans.find(p => p.role === 'club' && p.planType === 'premium')?.id,
      paymentType: 'membership',
      status: 'succeeded',
      amount: 6000.00,
      currency: 'mxn',
      stripePaymentIntentId: 'pi_club1_membership',
      stripeCustomerId: 'cus_club1',
      stripeChargeId: 'ch_club1_membership',
      paymentMethod: 'card',
      subtotal: 5172.41,
      taxAmount: 827.59,
      totalAmount: 6000.00,
      description: 'Membresía Premium de Club - Anual',
      referenceId: memberships[4]?.id,
      referenceType: 'membership',
      metadata: { plan: 'premium', period: 'annual', features: 'court_management,tournaments' },
      paidAt: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000)
    },

    // Failed payment example
    {
      userId: playerUsers[3]?.id || playerUsers[0]?.id,
      membershipPlanId: plans.find(p => p.role === 'player' && p.planType === 'basic')?.id,
      paymentType: 'membership',
      status: 'failed',
      amount: 800.00,
      currency: 'mxn',
      stripePaymentIntentId: 'pi_player4_failed',
      stripeCustomerId: 'cus_player4',
      paymentMethod: 'card',
      subtotal: 689.66,
      taxAmount: 110.34,
      totalAmount: 800.00,
      description: 'Membresía Básica de Jugador - Anual (FALLIDO)',
      failureReason: 'Tu tarjeta fue rechazada. Fondos insuficientes.',
      metadata: { plan: 'basic', period: 'annual', attempt: 1 }
    },

    // Refunded payment example
    {
      userId: playerUsers[2]?.id,
      membershipPlanId: null,
      paymentType: 'tournament',
      status: 'refunded',
      amount: 500.00,
      currency: 'mxn',
      stripePaymentIntentId: 'pi_player3_refunded',
      stripeCustomerId: 'cus_player3',
      stripeChargeId: 'ch_player3_refunded',
      paymentMethod: 'card',
      subtotal: 431.03,
      taxAmount: 68.97,
      totalAmount: 500.00,
      description: 'Inscripción torneo cancelado - REEMBOLSADO',
      referenceId: 2,
      referenceType: 'tournament',
      metadata: { tournamentName: 'Torneo Cancelado', reason: 'Evento cancelado por clima' },
      paidAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000),
      refundedAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
      refundAmount: 500.00
    }
  ], { returning: true });

  // Create invoices for completed payments
  const completedPayments = payments.filter(p => p.status === 'succeeded');
  const invoices = await Invoice.bulkCreate(
    completedPayments.map((payment, index) => ({
      userId: payment.userId,
      paymentId: payment.id,
      invoiceNumber: `FPM-2024-${String(index + 1).padStart(6, '0')}`,
      invoiceDate: payment.paidAt || new Date(),
      dueDate: new Date(payment.paidAt || new Date()),
      status: 'paid',
      subtotal: payment.subtotal,
      taxAmount: payment.taxAmount,
      totalAmount: payment.totalAmount,
      currency: payment.currency,
      description: payment.description,
      billingName: `Usuario ${payment.userId}`,
      billingAddress: 'Dirección de facturación ejemplo',
      billingEmail: `user${payment.userId}@example.com`,
      billingPhone: '+525551234567',
      billingRfc: 'XAXX010101000',
      items: [
        {
          description: payment.description,
          quantity: 1,
          unitPrice: payment.subtotal,
          amount: payment.subtotal
        }
      ],
      notes: 'Factura generada automáticamente',
      paidAt: payment.paidAt,
      paymentMethod: payment.paymentMethod,
      stripeInvoiceId: `in_${payment.stripePaymentIntentId}`
    })),
    { returning: true }
  );

  console.log(`✅ Seeded ${memberships.length} memberships, ${payments.length} payments, and ${invoices.length} invoices`);
  return { memberships, payments, invoices };
};

export default seedMembershipsAndPayments;