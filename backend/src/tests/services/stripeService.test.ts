import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import stripeService from '../../services/stripeService';
import Stripe from 'stripe';

// Mock the Stripe SDK
jest.mock('stripe');
const MockedStripe = Stripe as jest.MockedClass<typeof Stripe>;

describe('StripeService', () => {
  let mockStripeInstance: jest.Mocked<Stripe>;

  beforeEach(() => {
    mockStripeInstance = {
      paymentIntents: {
        create: jest.fn(),
        retrieve: jest.fn(),
        confirm: jest.fn(),
        cancel: jest.fn(),
      },
      customers: {
        create: jest.fn(),
      },
      subscriptions: {
        create: jest.fn(),
        update: jest.fn(),
        cancel: jest.fn(),
        retrieve: jest.fn(),
      },
      paymentMethods: {
        attach: jest.fn(),
        detach: jest.fn(),
        list: jest.fn(),
        retrieve: jest.fn(),
      },
      refunds: {
        create: jest.fn(),
      },
      setupIntents: {
        create: jest.fn(),
      },
      invoices: {
        retrieveUpcoming: jest.fn(),
      },
      products: {
        create: jest.fn(),
      },
      prices: {
        create: jest.fn(),
        retrieve: jest.fn(),
      },
      webhooks: {
        constructEvent: jest.fn(),
      },
    } as any;

    MockedStripe.mockImplementation(() => mockStripeInstance);
    
    // Reset the stripeService to use mocked Stripe
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPaymentIntent', () => {
    const mockPaymentIntentData = {
      amount: 5000, // $50.00 in cents
      currency: 'usd',
      customerId: 'cus_123',
      metadata: { userId: '1', type: 'tournament' }
    };

    const mockPaymentIntent = {
      id: 'pi_123',
      client_secret: 'pi_123_secret_456',
      amount: 5000,
      currency: 'usd'
    };

    it('should create payment intent successfully', async () => {
      mockStripeInstance.paymentIntents.create.mockResolvedValue(mockPaymentIntent as any);

      const result = await stripeService.createPaymentIntent(mockPaymentIntentData);

      expect(mockStripeInstance.paymentIntents.create).toHaveBeenCalledWith({
        amount: 5000,
        currency: 'usd',
        customer: 'cus_123',
        automatic_payment_methods: { enabled: true },
        metadata: mockPaymentIntentData.metadata
      });
      expect(result).toEqual(mockPaymentIntent);
    });

    it('should handle missing optional parameters', async () => {
      mockStripeInstance.paymentIntents.create.mockResolvedValue(mockPaymentIntent as any);

      await stripeService.createPaymentIntent({ amount: 5000 });

      expect(mockStripeInstance.paymentIntents.create).toHaveBeenCalledWith({
        amount: 5000,
        currency: 'mxn', // Default currency
        customer: undefined,
        automatic_payment_methods: { enabled: true },
        metadata: {}
      });
    });

    it('should throw error on Stripe failure', async () => {
      const stripeError = new Error('Card declined');
      mockStripeInstance.paymentIntents.create.mockRejectedValue(stripeError);

      await expect(stripeService.createPaymentIntent(mockPaymentIntentData))
        .rejects.toThrow('Failed to create payment intent');
    });
  });

  describe('createCustomer', () => {
    const mockCustomerData = {
      email: 'test@example.com',
      name: 'Test User',
      phone: '+1234567890',
      metadata: { userId: '1' }
    };

    const mockCustomer = {
      id: 'cus_123',
      email: 'test@example.com',
      name: 'Test User'
    };

    it('should create customer successfully', async () => {
      mockStripeInstance.customers.create.mockResolvedValue(mockCustomer as any);

      const result = await stripeService.createCustomer(mockCustomerData);

      expect(mockStripeInstance.customers.create).toHaveBeenCalledWith({
        email: mockCustomerData.email,
        name: mockCustomerData.name,
        phone: mockCustomerData.phone,
        metadata: mockCustomerData.metadata
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should handle missing optional fields', async () => {
      mockStripeInstance.customers.create.mockResolvedValue(mockCustomer as any);

      const minimalData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      await stripeService.createCustomer(minimalData);

      expect(mockStripeInstance.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        phone: undefined,
        metadata: {}
      });
    });

    it('should throw error on customer creation failure', async () => {
      const stripeError = new Error('Invalid email');
      mockStripeInstance.customers.create.mockRejectedValue(stripeError);

      await expect(stripeService.createCustomer(mockCustomerData))
        .rejects.toThrow('Failed to create customer');
    });
  });

  describe('createSubscription', () => {
    const mockCustomerId = 'cus_123';
    const mockPriceId = 'price_123';
    const mockMetadata = { userId: '1', planId: 'plan_pro' };

    const mockSubscription = {
      id: 'sub_123',
      customer: mockCustomerId,
      status: 'active',
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
      items: {
        data: [{ price: { id: mockPriceId } }]
      }
    };

    it('should create subscription successfully', async () => {
      mockStripeInstance.subscriptions.create.mockResolvedValue(mockSubscription as any);

      const result = await stripeService.createSubscription(mockCustomerId, mockPriceId, mockMetadata);

      expect(mockStripeInstance.subscriptions.create).toHaveBeenCalledWith({
        customer: mockCustomerId,
        items: [{ price: mockPriceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: mockMetadata
      });
      expect(result).toEqual(mockSubscription);
    });

    it('should handle missing metadata', async () => {
      mockStripeInstance.subscriptions.create.mockResolvedValue(mockSubscription as any);

      await stripeService.createSubscription(mockCustomerId, mockPriceId);

      expect(mockStripeInstance.subscriptions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: {}
        })
      );
    });

    it('should throw error on subscription creation failure', async () => {
      const stripeError = new Error('Invalid price');
      mockStripeInstance.subscriptions.create.mockRejectedValue(stripeError);

      await expect(stripeService.createSubscription(mockCustomerId, mockPriceId, mockMetadata))
        .rejects.toThrow('Failed to create subscription');
    });
  });

  describe('cancelSubscriptionAdvanced', () => {
    const mockSubscriptionId = 'sub_123';
    
    const mockCanceledSubscription = {
      id: mockSubscriptionId,
      status: 'canceled',
      cancel_at_period_end: false,
      canceled_at: Math.floor(Date.now() / 1000)
    };

    const mockScheduledSubscription = {
      id: mockSubscriptionId,
      status: 'active',
      cancel_at_period_end: true,
      canceled_at: null
    };

    it('should cancel subscription immediately', async () => {
      mockStripeInstance.subscriptions.cancel.mockResolvedValue(mockCanceledSubscription as any);

      const result = await stripeService.cancelSubscriptionAdvanced(mockSubscriptionId, true);

      expect(mockStripeInstance.subscriptions.cancel).toHaveBeenCalledWith(mockSubscriptionId);
      expect(mockStripeInstance.subscriptions.update).not.toHaveBeenCalled();
      expect(result).toEqual(mockCanceledSubscription);
    });

    it('should schedule cancellation at period end', async () => {
      mockStripeInstance.subscriptions.update.mockResolvedValue(mockScheduledSubscription as any);

      const result = await stripeService.cancelSubscriptionAdvanced(mockSubscriptionId, false);

      expect(mockStripeInstance.subscriptions.update).toHaveBeenCalledWith(mockSubscriptionId, {
        cancel_at_period_end: true
      });
      expect(mockStripeInstance.subscriptions.cancel).not.toHaveBeenCalled();
      expect(result).toEqual(mockScheduledSubscription);
    });

    it('should default to period end cancellation', async () => {
      mockStripeInstance.subscriptions.update.mockResolvedValue(mockScheduledSubscription as any);

      await stripeService.cancelSubscriptionAdvanced(mockSubscriptionId);

      expect(mockStripeInstance.subscriptions.update).toHaveBeenCalledWith(mockSubscriptionId, {
        cancel_at_period_end: true
      });
    });

    it('should throw error on cancellation failure', async () => {
      const stripeError = new Error('Subscription not found');
      mockStripeInstance.subscriptions.cancel.mockRejectedValue(stripeError);

      await expect(stripeService.cancelSubscriptionAdvanced(mockSubscriptionId, true))
        .rejects.toThrow('Failed to cancel subscription');
    });
  });

  describe('createRefundForPaymentIntent', () => {
    const mockPaymentIntentId = 'pi_123';
    const mockAmount = 25.00;
    const mockReason = 'requested_by_customer';

    const mockRefund = {
      id: 'ref_123',
      payment_intent: mockPaymentIntentId,
      amount: 2500, // $25.00 in cents
      status: 'succeeded',
      reason: mockReason
    };

    it('should create refund successfully', async () => {
      mockStripeInstance.refunds.create.mockResolvedValue(mockRefund as any);

      const result = await stripeService.createRefundForPaymentIntent(
        mockPaymentIntentId,
        mockAmount,
        mockReason
      );

      expect(mockStripeInstance.refunds.create).toHaveBeenCalledWith({
        payment_intent: mockPaymentIntentId,
        amount: 2500, // Converted to cents
        reason: mockReason
      });
      expect(result).toEqual(mockRefund);
    });

    it('should create full refund when amount not specified', async () => {
      mockStripeInstance.refunds.create.mockResolvedValue(mockRefund as any);

      await stripeService.createRefundForPaymentIntent(mockPaymentIntentId, undefined, mockReason);

      expect(mockStripeInstance.refunds.create).toHaveBeenCalledWith({
        payment_intent: mockPaymentIntentId,
        reason: mockReason
      });
    });

    it('should throw error on refund failure', async () => {
      const stripeError = new Error('Payment intent not refundable');
      mockStripeInstance.refunds.create.mockRejectedValue(stripeError);

      await expect(stripeService.createRefundForPaymentIntent(mockPaymentIntentId, mockAmount, mockReason))
        .rejects.toThrow('Failed to create refund');
    });
  });

  describe('createSetupIntent', () => {
    const mockCustomerId = 'cus_123';
    
    const mockSetupIntent = {
      id: 'seti_123',
      client_secret: 'seti_123_secret_456',
      customer: mockCustomerId,
      payment_method_types: ['card'],
      usage: 'off_session'
    };

    it('should create setup intent successfully', async () => {
      mockStripeInstance.setupIntents.create.mockResolvedValue(mockSetupIntent as any);

      const result = await stripeService.createSetupIntent(mockCustomerId);

      expect(mockStripeInstance.setupIntents.create).toHaveBeenCalledWith({
        customer: mockCustomerId,
        payment_method_types: ['card'],
        usage: 'off_session'
      });
      expect(result).toEqual(mockSetupIntent);
    });

    it('should throw error on setup intent failure', async () => {
      const stripeError = new Error('Invalid customer');
      mockStripeInstance.setupIntents.create.mockRejectedValue(stripeError);

      await expect(stripeService.createSetupIntent(mockCustomerId))
        .rejects.toThrow('Failed to create setup intent');
    });
  });

  describe('constructWebhookEvent', () => {
    const mockBody = 'webhook_body';
    const mockSignature = 'stripe_signature';
    const mockWebhookSecret = 'whsec_123';

    const mockEvent = {
      id: 'evt_123',
      type: 'payment_intent.succeeded',
      data: { object: {} }
    };

    it('should construct webhook event successfully', () => {
      mockStripeInstance.webhooks.constructEvent.mockReturnValue(mockEvent as any);

      // Mock the webhook secret
      process.env.STRIPE_WEBHOOK_SECRET = mockWebhookSecret;

      const result = stripeService.constructWebhookEvent(mockBody, mockSignature);

      expect(mockStripeInstance.webhooks.constructEvent).toHaveBeenCalledWith(
        mockBody,
        mockSignature,
        mockWebhookSecret
      );
      expect(result).toEqual(mockEvent);
    });

    it('should throw error on invalid signature', () => {
      const webhookError = new Error('Invalid signature');
      mockStripeInstance.webhooks.constructEvent.mockImplementation(() => {
        throw webhookError;
      });

      expect(() => stripeService.constructWebhookEvent(mockBody, mockSignature))
        .toThrow('Webhook signature verification failed');
    });
  });

  describe('retrievePaymentMethod', () => {
    const mockPaymentMethodId = 'pm_123';
    
    const mockPaymentMethod = {
      id: mockPaymentMethodId,
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025
      },
      billing_details: {
        name: 'Test User',
        email: 'test@example.com'
      }
    };

    it('should retrieve payment method successfully', async () => {
      mockStripeInstance.paymentMethods.retrieve.mockResolvedValue(mockPaymentMethod as any);

      const result = await stripeService.retrievePaymentMethod(mockPaymentMethodId);

      expect(mockStripeInstance.paymentMethods.retrieve).toHaveBeenCalledWith(mockPaymentMethodId);
      expect(result).toEqual(mockPaymentMethod);
    });

    it('should throw error when payment method not found', async () => {
      const stripeError = new Error('Payment method not found');
      mockStripeInstance.paymentMethods.retrieve.mockRejectedValue(stripeError);

      await expect(stripeService.retrievePaymentMethod(mockPaymentMethodId))
        .rejects.toThrow('Failed to retrieve payment method');
    });
  });
});