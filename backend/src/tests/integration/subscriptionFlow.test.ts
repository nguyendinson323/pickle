import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, jest } from '@jest/globals';
import app from '../../app';
import sequelize from '../../config/database';
import User from '../../models/User';
import Subscription from '../../models/Subscription';
import SubscriptionPlan from '../../models/SubscriptionPlan';
import Payment from '../../models/Payment';
import jwt from 'jsonwebtoken';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn().mockResolvedValue({
        id: 'cus_mock123',
        email: 'test@example.com'
      })
    },
    subscriptions: {
      create: jest.fn().mockResolvedValue({
        id: 'sub_mock123',
        status: 'active',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
        cancel_at_period_end: false,
        latest_invoice: {
          payment_intent: {
            client_secret: 'pi_mock123_secret'
          }
        }
      }),
      update: jest.fn().mockResolvedValue({
        id: 'sub_mock123',
        status: 'active',
        cancel_at_period_end: true
      }),
      cancel: jest.fn().mockResolvedValue({
        id: 'sub_mock123',
        status: 'canceled',
        canceled_at: Math.floor(Date.now() / 1000)
      })
    },
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: 'pi_mock123',
        client_secret: 'pi_mock123_secret',
        amount: 5000,
        currency: 'mxn'
      })
    },
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({
        id: 'evt_mock123',
        type: 'invoice.payment_succeeded',
        data: {
          object: {
            id: 'in_mock123',
            subscription: 'sub_mock123',
            payment_intent: 'pi_mock123',
            amount_paid: 39900,
            currency: 'mxn',
            period_end: Math.floor(Date.now() / 1000) + 86400 * 30
          }
        }
      })
    }
  }));
});

describe('Subscription Integration Tests', () => {
  let testUser: any;
  let testPlan: any;
  let authToken: string;

  beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clean up database
    await Payment.destroy({ where: {} });
    await Subscription.destroy({ where: {} });
    await User.destroy({ where: {} });
    await SubscriptionPlan.destroy({ where: {} });

    // Create test subscription plan
    testPlan = await SubscriptionPlan.create({
      id: 'plan-test',
      name: 'Test Plan',
      description: 'Test subscription plan',
      stripePriceId: 'price_test123',
      stripeProductId: 'prod_test123',
      amount: 39900,
      currency: 'MXN',
      interval: 'month',
      intervalCount: 1,
      features: [
        {
          name: 'Test Feature',
          description: 'Test feature description',
          included: true,
          limit: 10
        }
      ],
      maxTournamentRegistrations: 10,
      maxCourtBookings: 15,
      maxPlayerMatches: null, // Unlimited
      advancedFilters: true,
      prioritySupport: true,
      analyticsAccess: true,
      customBranding: false,
      isActive: true,
      isPopular: false,
      sortOrder: 1
    });

    // Create test user
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      role: 'player',
      isActive: true
    });

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser.id, email: testUser.email, role: testUser.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  describe('Subscription Plan Management', () => {
    it('should fetch available subscription plans', async () => {
      const response = await request(app)
        .get('/api/subscriptions/plans')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        id: 'plan-test',
        name: 'Test Plan',
        amount: 39900,
        currency: 'MXN',
        interval: 'month'
      });
    });

    it('should return empty array when user has no subscription', async () => {
      const response = await request(app)
        .get('/api/subscriptions/current')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeNull();
    });
  });

  describe('Subscription Creation Flow', () => {
    it('should create subscription successfully', async () => {
      const response = await request(app)
        .post('/api/subscriptions/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          planId: testPlan.id
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.subscription).toBeDefined();
      expect(response.body.data.clientSecret).toBe('pi_mock123_secret');
      expect(response.body.data.subscription.planId).toBe(testPlan.id);
      expect(response.body.data.subscription.userId).toBe(testUser.id);

      // Verify subscription was created in database
      const createdSubscription = await Subscription.findOne({
        where: { userId: testUser.id }
      });
      expect(createdSubscription).toBeTruthy();
      expect(createdSubscription?.planId).toBe(testPlan.id);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/subscriptions/create')
        .send({
          planId: testPlan.id
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not authenticated');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/subscriptions/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Plan ID is required');
    });

    it('should handle invalid plan ID', async () => {
      const response = await request(app)
        .post('/api/subscriptions/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          planId: 'non-existent-plan'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('User or plan not found');
    });
  });

  describe('Subscription Management', () => {
    let testSubscription: any;

    beforeEach(async () => {
      // Create a test subscription
      testSubscription = await Subscription.create({
        id: 'sub-test',
        userId: testUser.id,
        planId: testPlan.id,
        stripeSubscriptionId: 'sub_mock123',
        stripeCustomerId: 'cus_mock123',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 86400 * 30 * 1000),
        cancelAtPeriodEnd: false,
        amount: testPlan.amount,
        currency: testPlan.currency,
        interval: testPlan.interval,
        intervalCount: testPlan.intervalCount,
        nextBillingDate: new Date(Date.now() + 86400 * 30 * 1000)
      });
    });

    it('should fetch current subscription', async () => {
      const response = await request(app)
        .get('/api/subscriptions/current')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testSubscription.id);
      expect(response.body.data.status).toBe('active');
      expect(response.body.data.usage).toBeDefined();
    });

    it('should cancel subscription at period end', async () => {
      const response = await request(app)
        .post('/api/subscriptions/cancel')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('end of billing period');

      // Verify subscription was updated
      const updatedSubscription = await Subscription.findByPk(testSubscription.id);
      expect(updatedSubscription?.cancelAtPeriodEnd).toBe(true);
    });

    it('should cancel subscription immediately', async () => {
      const response = await request(app)
        .post('/api/subscriptions/cancel')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          immediately: true
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('immediately');
    });
  });

  describe('Payment Creation', () => {
    beforeEach(async () => {
      // Update user with Stripe customer ID
      await testUser.update({ stripeCustomerId: 'cus_mock123' });
    });

    it('should create tournament payment', async () => {
      const response = await request(app)
        .post('/api/subscriptions/tournament-payment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tournamentId: 'tournament-123',
          amount: 50,
          currency: 'MXN'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.payment).toBeDefined();
      expect(response.body.data.clientSecret).toBe('pi_mock123_secret');

      // Verify payment was created in database
      const createdPayment = await Payment.findOne({
        where: { userId: testUser.id, type: 'tournament_entry' }
      });
      expect(createdPayment).toBeTruthy();
      expect(createdPayment?.relatedEntityId).toBe('tournament-123');
      expect(createdPayment?.amount).toBe(5000); // $50 in cents
    });

    it('should create court booking payment', async () => {
      const response = await request(app)
        .post('/api/subscriptions/booking-payment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bookingId: 'booking-123',
          amount: 25,
          currency: 'MXN'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.payment).toBeDefined();
      expect(response.body.data.clientSecret).toBe('pi_mock123_secret');

      // Verify payment was created
      const createdPayment = await Payment.findOne({
        where: { userId: testUser.id, type: 'court_booking' }
      });
      expect(createdPayment).toBeTruthy();
      expect(createdPayment?.relatedEntityId).toBe('booking-123');
    });

    it('should validate tournament payment fields', async () => {
      const response = await request(app)
        .post('/api/subscriptions/tournament-payment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 50
          // Missing tournamentId
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Tournament ID and amount are required');
    });
  });

  describe('Webhook Processing', () => {
    let testSubscription: any;

    beforeEach(async () => {
      testSubscription = await Subscription.create({
        id: 'sub-test',
        userId: testUser.id,
        planId: testPlan.id,
        stripeSubscriptionId: 'sub_mock123',
        stripeCustomerId: 'cus_mock123',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 86400 * 30 * 1000),
        cancelAtPeriodEnd: false,
        amount: testPlan.amount,
        currency: testPlan.currency,
        interval: testPlan.interval,
        intervalCount: testPlan.intervalCount,
        nextBillingDate: new Date(Date.now() + 86400 * 30 * 1000)
      });
    });

    it('should process invoice.payment_succeeded webhook', async () => {
      const webhookPayload = JSON.stringify({
        id: 'evt_mock123',
        type: 'invoice.payment_succeeded',
        data: {
          object: {
            id: 'in_mock123',
            subscription: 'sub_mock123',
            payment_intent: 'pi_mock123',
            amount_paid: 39900,
            currency: 'mxn'
          }
        }
      });

      const response = await request(app)
        .post('/api/subscriptions/webhook')
        .set('stripe-signature', 'mock_signature')
        .send(webhookPayload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Webhook processed successfully');

      // Verify payment record was created
      const paymentRecord = await Payment.findOne({
        where: { subscriptionId: testSubscription.id, type: 'subscription' }
      });
      expect(paymentRecord).toBeTruthy();
      expect(paymentRecord?.amount).toBe(39900);
      expect(paymentRecord?.status).toBe('succeeded');
    });

    it('should require valid webhook signature', async () => {
      const response = await request(app)
        .post('/api/subscriptions/webhook')
        .send('webhook_body')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Missing Stripe signature');
    });
  });

  describe('Error Handling', () => {
    it('should handle subscription service errors gracefully', async () => {
      // Create invalid plan reference
      await testUser.update({ stripeCustomerId: null });

      // Mock Stripe error
      const stripe = require('stripe');
      stripe().customers.create.mockRejectedValueOnce(new Error('Stripe API error'));

      const response = await request(app)
        .post('/api/subscriptions/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          planId: testPlan.id
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Stripe API error');
    });

    it('should handle missing user gracefully', async () => {
      // Delete the test user
      await testUser.destroy();

      const response = await request(app)
        .post('/api/subscriptions/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          planId: testPlan.id
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('User or plan not found');
    });
  });

  describe('Complete Subscription Flow', () => {
    it('should handle complete subscription lifecycle', async () => {
      // 1. Create subscription
      const createResponse = await request(app)
        .post('/api/subscriptions/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: testPlan.id })
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      const subscriptionId = createResponse.body.data.subscription.id;

      // 2. Fetch subscription
      const fetchResponse = await request(app)
        .get('/api/subscriptions/current')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(fetchResponse.body.data.id).toBe(subscriptionId);
      expect(fetchResponse.body.data.status).toBe('active');

      // 3. Create tournament payment
      const paymentResponse = await request(app)
        .post('/api/subscriptions/tournament-payment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tournamentId: 'tournament-123',
          amount: 50,
          currency: 'MXN'
        })
        .expect(201);

      expect(paymentResponse.body.success).toBe(true);

      // 4. Cancel subscription
      const cancelResponse = await request(app)
        .post('/api/subscriptions/cancel')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(200);

      expect(cancelResponse.body.success).toBe(true);

      // 5. Verify final state
      const finalResponse = await request(app)
        .get('/api/subscriptions/current')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(finalResponse.body.data.cancelAtPeriodEnd).toBe(true);
    });
  });
});