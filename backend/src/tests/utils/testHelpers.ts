import jwt from 'jsonwebtoken';
import User from '../../models/User';
import Subscription from '../../models/Subscription';
import SubscriptionPlan from '../../models/SubscriptionPlan';
import Payment from '../../models/Payment';
import { v4 as uuidv4 } from 'uuid';

// Database test utilities
export const createTestUser = async (overrides: any = {}) => {
  return await User.create({
    username: 'testuser',
    email: 'test@example.com',
    passwordHash: 'hashedpassword',
    role: 'player',
    isActive: true,
    profile: {},
    ...overrides
  });
};

export const createTestSubscriptionPlan = async (overrides: any = {}) => {
  return await SubscriptionPlan.create({
    id: uuidv4(),
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
    maxPlayerMatches: null,
    advancedFilters: true,
    prioritySupport: true,
    analyticsAccess: true,
    customBranding: false,
    isActive: true,
    isPopular: false,
    sortOrder: 1,
    ...overrides
  });
};

export const createTestSubscription = async (userId: number, planId: string, overrides: any = {}) => {
  return await Subscription.create({
    id: uuidv4(),
    userId,
    planId,
    stripeSubscriptionId: 'sub_test123',
    stripeCustomerId: 'cus_test123',
    status: 'active',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 86400 * 30 * 1000),
    cancelAtPeriodEnd: false,
    amount: 39900,
    currency: 'MXN',
    interval: 'month',
    intervalCount: 1,
    nextBillingDate: new Date(Date.now() + 86400 * 30 * 1000),
    ...overrides
  });
};

export const createTestPayment = async (userId: number, overrides: any = {}) => {
  return await Payment.create({
    id: uuidv4(),
    userId,
    subscriptionId: null,
    stripePaymentIntentId: 'pi_test123',
    amount: 5000,
    currency: 'USD',
    status: 'succeeded',
    type: 'tournament_entry',
    relatedEntityId: 'tournament-123',
    description: 'Tournament entry fee',
    metadata: {},
    paymentMethodSnapshot: {
      type: 'card',
      card: { brand: 'visa', last4: '4242' }
    },
    fees: { stripe: 150, platform: 0 },
    ...overrides
  });
};

// Authentication utilities
export const generateAuthToken = (user: any) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

export const mockAuthenticatedRequest = (user: any, overrides: any = {}) => ({
  user,
  headers: {
    authorization: `Bearer ${generateAuthToken(user)}`,
    ...overrides.headers
  },
  body: {},
  params: {},
  query: {},
  ...overrides
});

// Mock Stripe objects
export const createMockStripe = () => ({
  customers: {
    create: jest.fn().mockResolvedValue({
      id: 'cus_mock123',
      email: 'test@example.com'
    }),
    retrieve: jest.fn().mockResolvedValue({
      id: 'cus_mock123',
      email: 'test@example.com'
    }),
    update: jest.fn().mockResolvedValue({
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
      cancel_at_period_end: true
    }),
    cancel: jest.fn().mockResolvedValue({
      id: 'sub_mock123',
      status: 'canceled'
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
  setupIntents: {
    create: jest.fn().mockResolvedValue({
      id: 'seti_mock123',
      client_secret: 'seti_mock123_secret'
    })
  },
  paymentMethods: {
    attach: jest.fn().mockResolvedValue({ id: 'pm_mock123' }),
    detach: jest.fn().mockResolvedValue({ id: 'pm_mock123' }),
    list: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'pm_mock123',
          type: 'card',
          card: { brand: 'visa', last4: '4242' }
        }
      ]
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
          currency: 'mxn'
        }
      }
    })
  }
});

// Database cleanup utilities
export const cleanupDatabase = async () => {
  // Order matters due to foreign keys
  await Payment.destroy({ where: {} });
  await Subscription.destroy({ where: {} });
  await User.destroy({ where: {} });
  await SubscriptionPlan.destroy({ where: {} });
};

// Webhook simulation
export const simulateStripeWebhook = async (eventType: string, data: any) => {
  const webhookPayload = {
    id: `evt_${Date.now()}`,
    type: eventType,
    data: { object: data },
    created: Math.floor(Date.now() / 1000)
  };

  return webhookPayload;
};

// Error response matcher
export const expectErrorResponse = (response: any, status: number, message: string) => {
  expect(response.status).toBe(status);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe(message);
};

// Success response matcher
export const expectSuccessResponse = (response: any, status: number = 200) => {
  expect(response.status).toBe(status);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toBeDefined();
};