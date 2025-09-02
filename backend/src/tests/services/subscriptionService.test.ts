import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import subscriptionService from '../../services/subscriptionService';
import stripeService from '../../services/stripeService';
import notificationService from '../../services/notificationService';
import User from '../../models/User';
import Subscription from '../../models/Subscription';
import SubscriptionPlan from '../../models/SubscriptionPlan';
import Payment from '../../models/Payment';

// Mock dependencies
jest.mock('../../services/stripeService');
jest.mock('../../services/notificationService');
jest.mock('../../models/User');
jest.mock('../../models/Subscription');
jest.mock('../../models/SubscriptionPlan');
jest.mock('../../models/Payment');

const mockStripeService = stripeService as jest.Mocked<typeof stripeService>;
const mockNotificationService = notificationService as jest.Mocked<typeof notificationService>;
const mockUser = User as jest.Mocked<typeof User>;
const mockSubscription = Subscription as jest.Mocked<typeof Subscription>;
const mockSubscriptionPlan = SubscriptionPlan as jest.Mocked<typeof SubscriptionPlan>;
const mockPayment = Payment as jest.Mocked<typeof Payment>;

describe('SubscriptionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSubscription', () => {
    const mockUserId = 1;
    const mockPlanId = 'plan-123';
    const mockPaymentMethodId = 'pm-123';

    const mockUser = {
      id: mockUserId,
      email: 'test@example.com',
      username: 'testuser',
      stripeCustomerId: null,
      update: jest.fn().mockResolvedValue(true)
    };

    const mockPlan = {
      id: mockPlanId,
      name: 'Plan Pro',
      stripePriceId: 'price-123',
      amount: 39900,
      currency: 'MXN',
      interval: 'month',
      intervalCount: 1
    };

    const mockStripeCustomer = {
      id: 'cus-123',
      email: 'test@example.com'
    };

    const mockStripeSubscription = {
      id: 'sub-123',
      status: 'active',
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
      cancel_at_period_end: false,
      latest_invoice: {
        payment_intent: {
          client_secret: 'pi_123_secret_456'
        }
      }
    };

    beforeEach(() => {
      mockUser.findByPk = jest.fn().mockResolvedValue(mockUser);
      mockSubscriptionPlan.findByPk = jest.fn().mockResolvedValue(mockPlan);
      mockStripeService.createCustomer = jest.fn().mockResolvedValue(mockStripeCustomer);
      mockStripeService.createSubscription = jest.fn().mockResolvedValue(mockStripeSubscription);
      mockSubscription.create = jest.fn().mockResolvedValue({
        id: 'local-sub-123',
        userId: mockUserId,
        planId: mockPlanId,
        stripeSubscriptionId: 'sub-123'
      });
    });

    it('should create subscription successfully for new customer', async () => {
      const result = await subscriptionService.createSubscription(mockUserId, mockPlanId);

      expect(mockUser.findByPk).toHaveBeenCalledWith(mockUserId);
      expect(mockSubscriptionPlan.findByPk).toHaveBeenCalledWith(mockPlanId);
      expect(mockStripeService.createCustomer).toHaveBeenCalledWith({
        email: mockUser.email,
        name: mockUser.username,
        metadata: { userId: mockUserId.toString() }
      });
      expect(mockUser.update).toHaveBeenCalledWith({ stripeCustomerId: mockStripeCustomer.id });
      expect(mockStripeService.createSubscription).toHaveBeenCalledWith(
        mockStripeCustomer.id,
        mockPlan.stripePriceId,
        { userId: mockUserId.toString(), planId: mockPlanId }
      );
      expect(mockSubscription.create).toHaveBeenCalled();
      expect(result.subscription).toBeDefined();
      expect(result.clientSecret).toBe('pi_123_secret_456');
    });

    it('should use existing Stripe customer if available', async () => {
      const userWithStripeId = { ...mockUser, stripeCustomerId: 'cus-existing' };
      mockUser.findByPk = jest.fn().mockResolvedValue(userWithStripeId);

      await subscriptionService.createSubscription(mockUserId, mockPlanId);

      expect(mockStripeService.createCustomer).not.toHaveBeenCalled();
      expect(mockStripeService.createSubscription).toHaveBeenCalledWith(
        'cus-existing',
        mockPlan.stripePriceId,
        { userId: mockUserId.toString(), planId: mockPlanId }
      );
    });

    it('should throw error if user not found', async () => {
      mockUser.findByPk = jest.fn().mockResolvedValue(null);

      await expect(subscriptionService.createSubscription(mockUserId, mockPlanId))
        .rejects.toThrow('User or plan not found');
    });

    it('should throw error if plan not found', async () => {
      mockSubscriptionPlan.findByPk = jest.fn().mockResolvedValue(null);

      await expect(subscriptionService.createSubscription(mockUserId, mockPlanId))
        .rejects.toThrow('User or plan not found');
    });

    it('should handle Stripe errors gracefully', async () => {
      mockStripeService.createCustomer = jest.fn().mockRejectedValue(new Error('Stripe error'));

      await expect(subscriptionService.createSubscription(mockUserId, mockPlanId))
        .rejects.toThrow('Failed to create subscription: Stripe error');
    });
  });

  describe('cancelSubscription', () => {
    const mockUserId = 1;
    const mockSubscription = {
      id: 'sub-123',
      userId: mockUserId,
      stripeSubscriptionId: 'stripe-sub-123',
      update: jest.fn().mockResolvedValue(true)
    };

    const mockStripeSubscription = {
      id: 'stripe-sub-123',
      status: 'canceled',
      cancel_at_period_end: true,
      canceled_at: Math.floor(Date.now() / 1000)
    };

    beforeEach(() => {
      mockSubscription.findOne = jest.fn().mockResolvedValue(mockSubscription);
      mockStripeService.cancelSubscriptionAdvanced = jest.fn().mockResolvedValue(mockStripeSubscription);
      mockNotificationService.sendNotification = jest.fn().mockResolvedValue(true);
    });

    it('should cancel subscription at period end by default', async () => {
      const result = await subscriptionService.cancelSubscription(mockUserId);

      expect(mockSubscription.findOne).toHaveBeenCalledWith({
        where: { userId: mockUserId, status: 'active' },
        include: [{ model: SubscriptionPlan, as: 'plan' }]
      });
      expect(mockStripeService.cancelSubscriptionAdvanced).toHaveBeenCalledWith(
        mockSubscription.stripeSubscriptionId,
        false
      );
      expect(mockSubscription.update).toHaveBeenCalled();
      expect(mockNotificationService.sendNotification).toHaveBeenCalled();
      expect(result).toBe(mockSubscription);
    });

    it('should cancel subscription immediately when requested', async () => {
      await subscriptionService.cancelSubscription(mockUserId, true);

      expect(mockStripeService.cancelSubscriptionAdvanced).toHaveBeenCalledWith(
        mockSubscription.stripeSubscriptionId,
        true
      );
    });

    it('should throw error if no active subscription found', async () => {
      mockSubscription.findOne = jest.fn().mockResolvedValue(null);

      await expect(subscriptionService.cancelSubscription(mockUserId))
        .rejects.toThrow('No active subscription found');
    });
  });

  describe('changeSubscriptionPlan', () => {
    const mockUserId = 1;
    const mockNewPlanId = 'plan-456';

    const mockSubscription = {
      id: 'sub-123',
      userId: mockUserId,
      stripeSubscriptionId: 'stripe-sub-123',
      update: jest.fn().mockResolvedValue(true)
    };

    const mockNewPlan = {
      id: mockNewPlanId,
      name: 'Plan Elite',
      stripePriceId: 'price-456',
      amount: 79900,
      currency: 'MXN',
      interval: 'month',
      intervalCount: 1
    };

    const mockStripeSubscription = {
      id: 'stripe-sub-123',
      items: {
        data: [{ id: 'si-123' }]
      }
    };

    const mockUpdatedStripeSubscription = {
      id: 'stripe-sub-123',
      current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30
    };

    beforeEach(() => {
      mockSubscription.findOne = jest.fn().mockResolvedValue(mockSubscription);
      mockSubscriptionPlan.findByPk = jest.fn().mockResolvedValue(mockNewPlan);
      mockStripeService.retrieveSubscription = jest.fn().mockResolvedValue(mockStripeSubscription);
      mockStripeService.updateSubscription = jest.fn().mockResolvedValue(mockUpdatedStripeSubscription);
      mockNotificationService.sendNotification = jest.fn().mockResolvedValue(true);
    });

    it('should change subscription plan successfully', async () => {
      const result = await subscriptionService.changeSubscriptionPlan(mockUserId, mockNewPlanId);

      expect(mockSubscription.findOne).toHaveBeenCalledWith({
        where: { userId: mockUserId, status: 'active' },
        include: [{ model: SubscriptionPlan, as: 'plan' }]
      });
      expect(mockSubscriptionPlan.findByPk).toHaveBeenCalledWith(mockNewPlanId);
      expect(mockStripeService.retrieveSubscription).toHaveBeenCalledWith(mockSubscription.stripeSubscriptionId);
      expect(mockStripeService.updateSubscription).toHaveBeenCalledWith(
        mockSubscription.stripeSubscriptionId,
        {
          items: [{
            id: 'si-123',
            price: mockNewPlan.stripePriceId
          }],
          proration_behavior: 'create_prorations'
        }
      );
      expect(mockSubscription.update).toHaveBeenCalled();
      expect(mockNotificationService.sendNotification).toHaveBeenCalled();
      expect(result).toBe(mockSubscription);
    });

    it('should throw error if no active subscription found', async () => {
      mockSubscription.findOne = jest.fn().mockResolvedValue(null);

      await expect(subscriptionService.changeSubscriptionPlan(mockUserId, mockNewPlanId))
        .rejects.toThrow('No active subscription found');
    });

    it('should throw error if new plan not found', async () => {
      mockSubscriptionPlan.findByPk = jest.fn().mockResolvedValue(null);

      await expect(subscriptionService.changeSubscriptionPlan(mockUserId, mockNewPlanId))
        .rejects.toThrow('New plan not found');
    });
  });

  describe('createPaymentForTournament', () => {
    const mockUserId = 1;
    const mockTournamentId = 'tournament-123';
    const mockAmount = 50; // $50 USD
    const mockCurrency = 'USD';

    const mockUser = {
      id: mockUserId,
      email: 'test@example.com',
      username: 'testuser',
      stripeCustomerId: 'cus-123',
      update: jest.fn().mockResolvedValue(true)
    };

    const mockPaymentIntent = {
      id: 'pi-123',
      client_secret: 'pi_123_secret_456'
    };

    beforeEach(() => {
      mockUser.findByPk = jest.fn().mockResolvedValue(mockUser);
      mockStripeService.createPaymentIntent = jest.fn().mockResolvedValue(mockPaymentIntent);
      mockPayment.create = jest.fn().mockResolvedValue({
        id: 'payment-123',
        userId: mockUserId,
        stripePaymentIntentId: 'pi-123'
      });
    });

    it('should create tournament payment successfully', async () => {
      const result = await subscriptionService.createPaymentForTournament(
        mockUserId,
        mockTournamentId,
        mockAmount,
        mockCurrency
      );

      expect(mockUser.findByPk).toHaveBeenCalledWith(mockUserId);
      expect(mockStripeService.createPaymentIntent).toHaveBeenCalledWith({
        amount: mockAmount * 100, // Convert to cents
        currency: mockCurrency,
        customerId: mockUser.stripeCustomerId,
        metadata: { tournamentId: mockTournamentId, type: 'tournament_entry' }
      });
      expect(mockPayment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          stripePaymentIntentId: mockPaymentIntent.id,
          amount: mockAmount * 100,
          currency: mockCurrency,
          type: 'tournament_entry',
          relatedEntityType: 'tournament',
          relatedEntityId: mockTournamentId,
          status: 'pending'
        })
      );
      expect(result.payment).toBeDefined();
      expect(result.clientSecret).toBe(mockPaymentIntent.client_secret);
    });

    it('should create Stripe customer if user does not have one', async () => {
      const userWithoutStripe = { ...mockUser, stripeCustomerId: null };
      mockUser.findByPk = jest.fn().mockResolvedValue(userWithoutStripe);
      mockStripeService.createCustomer = jest.fn().mockResolvedValue({ id: 'cus-new' });

      await subscriptionService.createPaymentForTournament(
        mockUserId,
        mockTournamentId,
        mockAmount,
        mockCurrency
      );

      expect(mockStripeService.createCustomer).toHaveBeenCalledWith({
        email: userWithoutStripe.email,
        name: userWithoutStripe.username,
        metadata: { userId: mockUserId.toString() }
      });
      expect(userWithoutStripe.update).toHaveBeenCalledWith({ stripeCustomerId: 'cus-new' });
    });

    it('should throw error if user not found', async () => {
      mockUser.findByPk = jest.fn().mockResolvedValue(null);

      await expect(subscriptionService.createPaymentForTournament(
        mockUserId,
        mockTournamentId,
        mockAmount,
        mockCurrency
      )).rejects.toThrow('User not found');
    });
  });

  describe('processWebhook', () => {
    const mockEvent = {
      id: 'evt_123',
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: 'in_123',
          subscription: 'sub_123',
          payment_intent: 'pi_123',
          amount_paid: 39900,
          currency: 'mxn',
          period_end: Math.floor(Date.now() / 1000) + 86400 * 30
        }
      }
    };

    it('should process invoice.payment_succeeded webhook', async () => {
      const mockSubscription = {
        id: 'local-sub-123',
        userId: 1,
        update: jest.fn().mockResolvedValue(true)
      };

      mockSubscription.findOne = jest.fn().mockResolvedValue(mockSubscription);
      mockPayment.create = jest.fn().mockResolvedValue({});
      mockNotificationService.sendNotification = jest.fn().mockResolvedValue(true);

      await subscriptionService.processWebhook(mockEvent);

      expect(mockSubscription.findOne).toHaveBeenCalledWith({
        where: { stripeSubscriptionId: 'sub_123' }
      });
      expect(mockPayment.create).toHaveBeenCalled();
      expect(mockSubscription.update).toHaveBeenCalledWith({
        status: 'active',
        lastPaymentDate: expect.any(Date),
        nextBillingDate: expect.any(Date)
      });
      expect(mockNotificationService.sendNotification).toHaveBeenCalled();
    });

    it('should handle unrecognized webhook types gracefully', async () => {
      const unknownEvent = { ...mockEvent, type: 'unknown.event' };

      await expect(subscriptionService.processWebhook(unknownEvent))
        .resolves.not.toThrow();
    });

    it('should propagate webhook processing errors', async () => {
      mockSubscription.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(subscriptionService.processWebhook(mockEvent))
        .rejects.toThrow('Webhook processing failed: Database error');
    });
  });
});