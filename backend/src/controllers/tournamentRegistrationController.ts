import { Request, Response } from 'express';
import { 
  Tournament, 
  TournamentCategory, 
  TournamentRegistration,
  User,
  Payment,
  State
} from '../models';
import { Op } from 'sequelize';
import tournamentService from '../services/tournamentService';
import stripeService from '../services/stripeService';
import notificationService from '../services/notificationService';
import sequelize from '../config/database';

export class TournamentRegistrationController {
  // Register for tournament
  async registerForTournament(req: Request, res: Response) {
    const transaction = await sequelize.transaction();

    try {
      const { tournamentId } = req.params;
      const { 
        categoryId, 
        partnerId,
        emergencyContact,
        medicalInformation,
        tshirtSize,
        dietaryRestrictions,
        transportationNeeds,
        accommodationNeeds
      } = req.body;
      const playerId = req.user?.id;

      if (!playerId) {
        await transaction.rollback();
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Check tournament status
      const tournament = await Tournament.findByPk(tournamentId, { transaction });
      if (!tournament) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Tournament not found' });
      }

      if (tournament.status !== 'open') {
        await transaction.rollback();
        return res.status(400).json({ error: 'Tournament registration is not open' });
      }

      // Check registration deadline
      const now = new Date();
      if (new Date(tournament.registrationEnd) < now && !tournament.allowLateRegistration) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Registration deadline has passed' });
      }

      // Check category
      const category = await TournamentCategory.findByPk(categoryId, { transaction });
      if (!category || category.tournamentId !== Number(tournamentId)) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Category not found' });
      }

      if (!category.isActive) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Category is not active' });
      }

      // Check eligibility
      const eligibility = await tournamentService.checkPlayerEligibility(playerId, categoryId);
      if (!eligibility.eligible) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: 'Not eligible for this category',
          reasons: eligibility.reasons
        });
      }

      // Check capacity
      if (category.currentParticipants >= category.maxParticipants) {
        if (!tournament.enableWaitingList) {
          await transaction.rollback();
          return res.status(400).json({ error: 'Category is full' });
        }
      }

      // Check for doubles partner
      if (category.playFormat !== 'singles' && partnerId) {
        const partner = await User.findByPk(partnerId, { transaction });
        if (!partner) {
          await transaction.rollback();
          return res.status(404).json({ error: 'Partner not found' });
        }

        // Check partner eligibility
        const partnerEligibility = await tournamentService.checkPlayerEligibility(partnerId, categoryId);
        if (!partnerEligibility.eligible) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: 'Partner not eligible for this category',
            reasons: partnerEligibility.reasons
          });
        }
      }

      // Create registration
      const registration = await TournamentRegistration.create({
        tournamentId: Number(tournamentId),
        categoryId,
        playerId,
        partnerId,
        status: 'pending',
        registrationDate: new Date(),
        amountPaid: 0,
        emergencyContact,
        medicalInformation,
        tshirtSize,
        dietaryRestrictions,
        transportationNeeds,
        accommodationNeeds,
        waiverSigned: false,
        isCheckedIn: false
      }, { transaction });

      // Calculate total fee
      const totalFee = Number(tournament.entryFee) + Number(category.entryFee);

      // Create payment intent
      const paymentIntent = await stripeService.createPaymentIntent({
        amount: totalFee,
        currency: 'mxn',
        metadata: {
          registrationId: registration.id,
          tournamentId,
          categoryId,
          playerId
        }
      });

      await transaction.commit();

      res.status(201).json({ 
        registration,
        paymentIntent: {
          clientSecret: paymentIntent.client_secret,
          amount: totalFee
        }
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error registering for tournament:', error);
      res.status(500).json({ error: 'Failed to register for tournament' });
    }
  }

  // Confirm registration payment
  async confirmRegistrationPayment(req: Request, res: Response) {
    const transaction = await sequelize.transaction();

    try {
      const { registrationId } = req.params;
      const { paymentIntentId } = req.body;

      const registration = await TournamentRegistration.findByPk(registrationId, {
        include: [
          { model: Tournament, as: 'tournament' },
          { model: TournamentCategory, as: 'category' }
        ],
        transaction
      });

      if (!registration) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Registration not found' });
      }

      // Verify payment with Stripe
      const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        await transaction.rollback();
        return res.status(400).json({ error: 'Payment not successful' });
      }

      // Calculate total fee
      const totalFee = Number(registration.tournament.entryFee) + Number(registration.category.entryFee);

      // Create payment record
      const payment = await Payment.create({
        userId: registration.playerId,
        amount: totalFee,
        paymentType: 'tournament_registration',
        paymentMethod: 'stripe',
        status: 'completed',
        stripePaymentIntentId: paymentIntentId,
        referenceType: 'tournament_registration',
        referenceId: registration.id,
        description: `Tournament registration - ${registration.tournament.name}`
      }, { transaction });

      // Update registration
      await registration.update({
        status: 'paid',
        paymentId: payment.id,
        amountPaid: totalFee
      }, { transaction });

      // Update category participant count
      await registration.category.increment('currentParticipants', { transaction });

      // Update tournament participant count
      await registration.tournament.increment('currentParticipants', { transaction });

      // Send confirmation notification
      await notificationService.createNotification({
        userId: registration.playerId,
        type: 'tournament',
        title: 'Registration Confirmed',
        message: `Your registration for ${registration.tournament.name} has been confirmed!`,
        link: `/tournaments/${registration.tournamentId}`
      });

      // If partner, notify them too
      if (registration.partnerId) {
        await notificationService.createNotification({
          userId: registration.partnerId,
          type: 'tournament',
          title: 'Tournament Partner Registration',
          message: `You have been registered as a partner for ${registration.tournament.name}`,
          link: `/tournaments/${registration.tournamentId}`
        });
      }

      await transaction.commit();

      res.json({ 
        registration,
        payment,
        message: 'Registration confirmed successfully' 
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error confirming registration payment:', error);
      res.status(500).json({ error: 'Failed to confirm registration payment' });
    }
  }

  // Cancel registration
  async cancelRegistration(req: Request, res: Response) {
    const transaction = await sequelize.transaction();

    try {
      const { registrationId } = req.params;
      const { reason } = req.body;
      const userId = req.user?.id;

      const registration = await TournamentRegistration.findByPk(registrationId, {
        include: [
          { model: Tournament, as: 'tournament' },
          { model: TournamentCategory, as: 'category' }
        ],
        transaction
      });

      if (!registration) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Registration not found' });
      }

      // Check ownership
      if (registration.playerId !== userId && req.user?.role !== 'admin') {
        await transaction.rollback();
        return res.status(403).json({ error: 'Not authorized to cancel this registration' });
      }

      // Check if tournament has started
      if (registration.tournament.status === 'in_progress') {
        await transaction.rollback();
        return res.status(400).json({ error: 'Cannot cancel registration for tournament in progress' });
      }

      // Process refund if payment was made
      let refundAmount = 0;
      if (registration.status === 'paid' && registration.paymentId) {
        const daysBefore = Math.floor((new Date(registration.tournament.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        // Refund policy: 100% if > 7 days, 50% if 3-7 days, 0% if < 3 days
        let refundPercentage = 0;
        if (daysBefore > 7) refundPercentage = 1;
        else if (daysBefore >= 3) refundPercentage = 0.5;

        if (refundPercentage > 0) {
          refundAmount = Number(registration.amountPaid) * refundPercentage;
          
          // Process refund through Stripe
          const payment = await Payment.findByPk(registration.paymentId, { transaction });
          if (payment && payment.stripePaymentIntentId) {
            await stripeService.createRefund({
              paymentIntentId: payment.stripePaymentIntentId,
              amount: Math.round(refundAmount * 100) // Convert to cents
            });
          }
        }
      }

      // Update registration
      await registration.update({
        status: 'cancelled',
        withdrawalReason: reason,
        withdrawalDate: new Date(),
        refundAmount,
        refundProcessedDate: refundAmount > 0 ? new Date() : null
      }, { transaction });

      // Update category participant count
      if (registration.status === 'paid') {
        await registration.category.decrement('currentParticipants', { transaction });
        await registration.tournament.decrement('currentParticipants', { transaction });
      }

      // Notify player
      await notificationService.createNotification({
        userId: registration.playerId,
        type: 'tournament',
        title: 'Registration Cancelled',
        message: `Your registration for ${registration.tournament.name} has been cancelled. ${refundAmount > 0 ? `Refund of $${refundAmount} MXN will be processed.` : ''}`,
        link: `/tournaments/${registration.tournamentId}`
      });

      await transaction.commit();

      res.json({ 
        message: 'Registration cancelled successfully',
        refundAmount
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error cancelling registration:', error);
      res.status(500).json({ error: 'Failed to cancel registration' });
    }
  }

  // Get tournament registrations
  async getTournamentRegistrations(req: Request, res: Response) {
    try {
      const { tournamentId } = req.params;
      const { categoryId, status } = req.query;

      const where: any = { tournamentId: Number(tournamentId) };
      if (categoryId) where.categoryId = categoryId;
      if (status) where.status = status;

      const registrations = await TournamentRegistration.findAll({
        where,
        include: [
          { model: User, as: 'player', attributes: ['id', 'username', 'email'] },
          { model: User, as: 'partner', attributes: ['id', 'username', 'email'] },
          { model: TournamentCategory, as: 'category' }
        ],
        order: [['registrationDate', 'DESC']]
      });

      res.json({ registrations });
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({ error: 'Failed to fetch registrations' });
    }
  }

  // Get player registrations
  async getPlayerRegistrations(req: Request, res: Response) {
    try {
      const playerId = req.user?.id;

      if (!playerId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const registrations = await TournamentRegistration.findAll({
        where: {
          [Op.or]: [
            { playerId },
            { partnerId: playerId }
          ]
        },
        include: [
          { 
            model: Tournament, 
            as: 'tournament',
            include: [{ model: State, as: 'state' }]
          },
          { model: TournamentCategory, as: 'category' },
          { model: User, as: 'player', attributes: ['id', 'username'] },
          { model: User, as: 'partner', attributes: ['id', 'username'] }
        ],
        order: [['registrationDate', 'DESC']]
      });

      res.json({ registrations });
    } catch (error) {
      console.error('Error fetching player registrations:', error);
      res.status(500).json({ error: 'Failed to fetch player registrations' });
    }
  }

  // Sign waiver
  async signWaiver(req: Request, res: Response) {
    try {
      const { registrationId } = req.params;
      const { signature } = req.body;
      const userId = req.user?.id;

      const registration = await TournamentRegistration.findByPk(registrationId);

      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }

      // Check ownership
      if (registration.playerId !== userId) {
        return res.status(403).json({ error: 'Not authorized to sign waiver for this registration' });
      }

      await registration.update({
        waiverSigned: true,
        waiverSignedDate: new Date()
      });

      res.json({ 
        message: 'Waiver signed successfully',
        registration
      });
    } catch (error) {
      console.error('Error signing waiver:', error);
      res.status(500).json({ error: 'Failed to sign waiver' });
    }
  }

  // Check in player
  async checkInPlayer(req: Request, res: Response) {
    try {
      const { registrationId } = req.params;
      const userId = req.user?.id;

      const registration = await TournamentRegistration.findByPk(registrationId, {
        include: [{ model: Tournament, as: 'tournament' }]
      });

      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }

      // Check if user is tournament organizer
      if (registration.tournament.organizerId !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to check in players' });
      }

      // Check if registration is paid
      if (registration.status !== 'paid') {
        return res.status(400).json({ error: 'Registration must be paid before check-in' });
      }

      await registration.update({
        isCheckedIn: true,
        checkInTime: new Date()
      });

      // Notify player
      await notificationService.createNotification({
        userId: registration.playerId,
        type: 'tournament',
        title: 'Checked In',
        message: `You have been checked in for ${registration.tournament.name}`,
        link: `/tournaments/${registration.tournamentId}`
      });

      res.json({ 
        message: 'Player checked in successfully',
        registration
      });
    } catch (error) {
      console.error('Error checking in player:', error);
      res.status(500).json({ error: 'Failed to check in player' });
    }
  }

  // Update registration seed
  async updateRegistrationSeed(req: Request, res: Response) {
    try {
      const { registrationId } = req.params;
      const { seedNumber } = req.body;
      const userId = req.user?.id;

      const registration = await TournamentRegistration.findByPk(registrationId, {
        include: [{ model: Tournament, as: 'tournament' }]
      });

      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }

      // Check if user is tournament organizer
      if (registration.tournament.organizerId !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update seeds' });
      }

      await registration.update({ seedNumber });

      res.json({ 
        message: 'Seed updated successfully',
        registration
      });
    } catch (error) {
      console.error('Error updating seed:', error);
      res.status(500).json({ error: 'Failed to update seed' });
    }
  }
}

export default new TournamentRegistrationController();