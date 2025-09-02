import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import subscriptionController from '../../controllers/subscriptionController';
import subscriptionService from '../../services/subscriptionService';
import SubscriptionPlan from '../../models/SubscriptionPlan';

// Mock dependencies
jest.mock('../../services/subscriptionService');
jest.mock('../../models/SubscriptionPlan');

const mockSubscriptionService = subscriptionService as jest.Mocked<typeof subscriptionService>;
const mockSubscriptionPlan = SubscriptionPlan as jest.Mocked<typeof SubscriptionPlan>;

// Mock Express request and response
const mockRequest = (overrides = {}) => ({
  user: { id: 1 },
  body: {},
  params: {},
  query: {},
  ...overrides
} as Request);

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('SubscriptionController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlans', () => {
    const mockPlans = [
      {
        id: 'plan-1',
        name: 'Plan Básico',
        amount: 19900,
        currency: 'MXN',
        interval: 'month',
        isActive: true,
        sortOrder: 1
      },
      {
        id: 'plan-2',
        name: 'Plan Pro',
        amount: 39900,
        currency: 'MXN',
        interval: 'month',
        isActive: true,
        sortOrder: 2,
        isPopular: true
      }
    ];

    it('should return active subscription plans', async () => {
      mockSubscriptionPlan.findAll.mockResolvedValue(mockPlans as any);
      
      const req = mockRequest();
      const res = mockResponse();

      await subscriptionController.getPlans(req, res);

      expect(mockSubscriptionPlan.findAll).toHaveBeenCalledWith({
        where: { isActive: true },
        order: [['amount', 'ASC']]
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockPlans
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockSubscriptionPlan.findAll.mockRejectedValue(error);

      const req = mockRequest();
      const res = mockResponse();

      await subscriptionController.getPlans(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch subscription plans',
        error: error.message
      });
    });
  });

  describe('getUserSubscription', () => {
    const mockSubscription = {
      id: 'sub-123',
      planId: 'plan-pro',
      status: 'active',
      amount: 39900,
      currency: 'MXN',
      plan: {
        name: 'Plan Pro',
        features: []
      },
      usage: {
        tournamentRegistrations: 5,
        courtBookings: 8,
        playerMatches: 25
      }
    };

    it('should return user subscription with usage data', async () => {
      mockSubscriptionService.getUserSubscription.mockResolvedValue(mockSubscription);

      const req = mockRequest();
      const res = mockResponse();

      await subscriptionController.getUserSubscription(req, res);

      expect(mockSubscriptionService.getUserSubscription).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSubscription
      });
    });

    it('should return 401 if user not authenticated', async () => {
      const req = mockRequest({ user: null });
      const res = mockResponse();

      await subscriptionController.getUserSubscription(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated'
      });
      expect(mockSubscriptionService.getUserSubscription).not.toHaveBeenCalled();
    });

    it('should handle subscription service errors', async () => {
      const error = new Error('Failed to fetch subscription');
      mockSubscriptionService.getUserSubscription.mockRejectedValue(error);

      const req = mockRequest();
      const res = mockResponse();

      await subscriptionController.getUserSubscription(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch subscription',
        error: error.message
      });
    });
  });

  describe('createSubscription', () => {
    const mockCreatedSubscription = {
      subscription: {
        id: 'sub-123',
        planId: 'plan-pro',
        status: 'active'
      },
      clientSecret: 'pi_123_secret_456'
    };

    it('should create subscription successfully', async () => {
      mockSubscriptionService.createSubscription.mockResolvedValue(mockCreatedSubscription);

      const req = mockRequest({
        body: {
          planId: 'plan-pro',
          paymentMethodId: 'pm-123'
        }
      });
      const res = mockResponse();

      await subscriptionController.createSubscription(req, res);

      expect(mockSubscriptionService.createSubscription).toHaveBeenCalledWith(
        1,
        'plan-pro',
        'pm-123'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Subscription created successfully',
        data: {
          subscription: mockCreatedSubscription.subscription,
          clientSecret: mockCreatedSubscription.clientSecret
        }
      });
    });

    it('should return 400 if planId is missing', async () => {
      const req = mockRequest({
        body: {}
      });
      const res = mockResponse();

      await subscriptionController.createSubscription(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Plan ID is required'
      });
      expect(mockSubscriptionService.createSubscription).not.toHaveBeenCalled();
    });

    it('should return 401 if user not authenticated', async () => {
      const req = mockRequest({
        user: null,
        body: { planId: 'plan-pro' }
      });
      const res = mockResponse();

      await subscriptionController.createSubscription(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated'
      });
    });

    it('should handle subscription creation errors', async () => {
      const error = new Error('Payment method declined');
      mockSubscriptionService.createSubscription.mockRejectedValue(error);

      const req = mockRequest({
        body: { planId: 'plan-pro' }
      });
      const res = mockResponse();

      await subscriptionController.createSubscription(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to create subscription',
        error: error.message
      });
    });
  });

  describe('cancelSubscription', () => {
    const mockCanceledSubscription = {
      id: 'sub-123',
      status: 'canceled',
      cancelAtPeriodEnd: true
    };

    it('should cancel subscription at period end by default', async () => {
      mockSubscriptionService.cancelSubscription.mockResolvedValue(mockCanceledSubscription);

      const req = mockRequest({
        body: {}
      });
      const res = mockResponse();

      await subscriptionController.cancelSubscription(req, res);

      expect(mockSubscriptionService.cancelSubscription).toHaveBeenCalledWith(1, false);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Subscription will cancel at end of billing period',
        data: mockCanceledSubscription
      });
    });

    it('should cancel subscription immediately when requested', async () => {
      const immediatelyCanceled = {
        ...mockCanceledSubscription,
        cancelAtPeriodEnd: false,
        status: 'canceled'
      };
      mockSubscriptionService.cancelSubscription.mockResolvedValue(immediatelyCanceled);

      const req = mockRequest({
        body: { immediately: true }
      });
      const res = mockResponse();

      await subscriptionController.cancelSubscription(req, res);

      expect(mockSubscriptionService.cancelSubscription).toHaveBeenCalledWith(1, true);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Subscription cancelled immediately',
        data: immediatelyCanceled
      });
    });

    it('should return 401 if user not authenticated', async () => {
      const req = mockRequest({
        user: null,
        body: {}
      });
      const res = mockResponse();

      await subscriptionController.cancelSubscription(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated'
      });
    });

    it('should handle cancellation errors', async () => {
      const error = new Error('No active subscription found');
      mockSubscriptionService.cancelSubscription.mockRejectedValue(error);

      const req = mockRequest({
        body: {}
      });
      const res = mockResponse();

      await subscriptionController.cancelSubscription(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to cancel subscription',
        error: error.message
      });
    });
  });

  describe('createTournamentPayment', () => {
    const mockPaymentResult = {
      payment: {
        id: 'payment-123',
        amount: 5000, // $50 in cents
        type: 'tournament_entry'
      },
      clientSecret: 'pi_123_secret_456'
    };

    it('should create tournament payment successfully', async () => {
      mockSubscriptionService.createPaymentForTournament.mockResolvedValue(mockPaymentResult);

      const req = mockRequest({
        body: {
          tournamentId: 'tournament-123',
          amount: 50,
          currency: 'USD'
        }
      });
      const res = mockResponse();

      await subscriptionController.createTournamentPayment(req, res);

      expect(mockSubscriptionService.createPaymentForTournament).toHaveBeenCalledWith(
        1,
        'tournament-123',
        50,
        'USD'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Tournament payment created successfully',
        data: mockPaymentResult
      });
    });

    it('should default to USD currency', async () => {
      mockSubscriptionService.createPaymentForTournament.mockResolvedValue(mockPaymentResult);

      const req = mockRequest({
        body: {
          tournamentId: 'tournament-123',
          amount: 50
        }
      });
      const res = mockResponse();

      await subscriptionController.createTournamentPayment(req, res);

      expect(mockSubscriptionService.createPaymentForTournament).toHaveBeenCalledWith(
        1,
        'tournament-123',
        50,
        'USD'
      );
    });

    it('should return 400 if required fields are missing', async () => {
      const req = mockRequest({
        body: { amount: 50 } // Missing tournamentId
      });
      const res = mockResponse();

      await subscriptionController.createTournamentPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Tournament ID and amount are required'
      });
      expect(mockSubscriptionService.createPaymentForTournament).not.toHaveBeenCalled();
    });

    it('should return 401 if user not authenticated', async () => {
      const req = mockRequest({
        user: null,
        body: {
          tournamentId: 'tournament-123',
          amount: 50
        }
      });
      const res = mockResponse();

      await subscriptionController.createTournamentPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated'
      });
    });

    it('should handle payment creation errors', async () => {
      const error = new Error('Insufficient funds');
      mockSubscriptionService.createPaymentForTournament.mockRejectedValue(error);

      const req = mockRequest({
        body: {
          tournamentId: 'tournament-123',
          amount: 50
        }
      });
      const res = mockResponse();

      await subscriptionController.createTournamentPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to create tournament payment',
        error: error.message
      });
    });
  });

  describe('processWebhook', () => {
    const mockEvent = {
      id: 'evt_123',
      type: 'invoice.payment_succeeded',
      data: { object: {} }
    };

    it('should process webhook successfully', async () => {
      mockSubscriptionService.processWebhook.mockResolvedValue(undefined);

      const req = mockRequest({
        headers: { 'stripe-signature': 'stripe_signature_123' },
        body: 'webhook_body'
      });
      const res = mockResponse();

      // Mock stripeService.constructWebhookEvent
      const mockStripeService = require('../../services/stripeService');
      mockStripeService.constructWebhookEvent = jest.fn().mockReturnValue(mockEvent);

      await subscriptionController.processWebhook(req, res);

      expect(mockStripeService.constructWebhookEvent).toHaveBeenCalledWith(
        'webhook_body',
        'stripe_signature_123'
      );
      expect(mockSubscriptionService.processWebhook).toHaveBeenCalledWith(mockEvent);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Webhook processed successfully'
      });
    });

    it('should return 400 if signature is missing', async () => {
      const req = mockRequest({
        headers: {},
        body: 'webhook_body'
      });
      const res = mockResponse();

      await subscriptionController.processWebhook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Missing Stripe signature'
      });
      expect(mockSubscriptionService.processWebhook).not.toHaveBeenCalled();
    });

    it('should handle webhook processing errors', async () => {
      const error = new Error('Webhook verification failed');
      const mockStripeService = require('../../services/stripeService');
      mockStripeService.constructWebhookEvent = jest.fn().mockImplementation(() => {
        throw error;
      });

      const req = mockRequest({
        headers: { 'stripe-signature': 'invalid_signature' },
        body: 'webhook_body'
      });
      const res = mockResponse();

      await subscriptionController.processWebhook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Webhook processing failed',
        error: error.message
      });
    });
  });
});