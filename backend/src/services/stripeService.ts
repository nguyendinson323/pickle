import stripe, { STRIPE_CONFIG } from '../config/stripe';
import logger from '../utils/logger';

interface PaymentIntentData {
  amount: number;
  currency?: string;
  customerId?: string;
  metadata?: any;
}

interface StripeCustomerData {
  email: string;
  name: string;
  phone?: string;
  metadata?: any;
}

class StripeService {
  // Expose stripe instance for direct access when needed
  public stripe = stripe;

  /**
   * Create a payment intent
   */
  async createPaymentIntent(data: PaymentIntentData) {
    try {
      const { amount, currency = STRIPE_CONFIG.currency, customerId, metadata } = data;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount already in cents
        currency: currency.toLowerCase(),
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: metadata || {},
      });

      logger.info(`Payment intent created: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      logger.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Confirm a payment intent
   */
  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      logger.info(`Payment confirmed: ${paymentIntentId}`);
      return paymentIntent;
    } catch (error) {
      logger.error('Error confirming payment:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  /**
   * Create a Stripe customer
   */
  async createCustomer(customerData: StripeCustomerData) {
    try {
      const customer = await stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        metadata: customerData.metadata || {},
      });
      
      logger.info(`Stripe customer created: ${customer.id}`);
      return customer;
    } catch (error) {
      logger.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(customerId: string, priceId: string, metadata?: any) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: metadata || {},
      });

      logger.info(`Subscription created: ${subscription.id}`);
      return subscription;
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Update a subscription
   */
  async updateSubscription(subscriptionId: string, updates: any) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, updates);
      logger.info(`Subscription updated: ${subscriptionId}`);
      return subscription;
    } catch (error) {
      logger.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      logger.info(`Payment intent cancelled: ${paymentIntentId}`);
      return paymentIntent;
    } catch (error) {
      logger.error('Error cancelling payment intent:', error);
      throw new Error('Failed to cancel payment intent');
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      logger.info(`Subscription cancelled: ${subscriptionId}`);
      return subscription;
    } catch (error) {
      logger.error('Error cancelling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Create a refund
   */
  async createRefund(options: { chargeId: string; amount?: number; reason?: string }) {
    try {
      const refund = await stripe.refunds.create({
        charge: options.chargeId,
        amount: options.amount ? Math.round(options.amount * 100) : undefined,
        reason: options.reason as any,
      });

      logger.info(`Refund created: ${refund.id}`);
      return refund;
    } catch (error) {
      logger.error('Error creating refund:', error);
      throw new Error('Failed to create refund');
    }
  }

  /**
   * Retrieve payment intent
   */
  async retrievePaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      logger.error('Error retrieving payment intent:', error);
      throw new Error('Failed to retrieve payment intent');
    }
  }

  /**
   * List customer payment methods
   */
  async listPaymentMethods(customerId: string) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods;
    } catch (error) {
      logger.error('Error listing payment methods:', error);
      throw new Error('Failed to list payment methods');
    }
  }

  /**
   * Construct webhook event
   */
  constructWebhookEvent(body: string | Buffer, signature: string) {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_CONFIG.webhookSecret || ''
      );
      return event;
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      throw new Error('Webhook signature verification failed');
    }
  }

  /**
   * Calculate tax amount
   */
  calculateTax(amount: number): number {
    return Math.round(amount * STRIPE_CONFIG.taxRate * 100) / 100;
  }

  /**
   * Calculate total with tax
   */
  calculateTotalWithTax(subtotal: number): number {
    const tax = this.calculateTax(subtotal);
    return subtotal + tax;
  }

  /**
   * Attach payment method to customer
   */
  async attachPaymentMethod(paymentMethodId: string, customerId: string) {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
      logger.info(`Payment method attached: ${paymentMethodId} to ${customerId}`);
      return paymentMethod;
    } catch (error) {
      logger.error('Error attaching payment method:', error);
      throw new Error('Failed to attach payment method');
    }
  }

  /**
   * Detach payment method from customer
   */
  async detachPaymentMethod(paymentMethodId: string) {
    try {
      const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
      logger.info(`Payment method detached: ${paymentMethodId}`);
      return paymentMethod;
    } catch (error) {
      logger.error('Error detaching payment method:', error);
      throw new Error('Failed to detach payment method');
    }
  }

  /**
   * Retrieve subscription with expanded data
   */
  async retrieveSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice', 'customer']
      });
      return subscription;
    } catch (error) {
      logger.error('Error retrieving subscription:', error);
      throw new Error('Failed to retrieve subscription');
    }
  }

  /**
   * Get upcoming invoice
   */
  async getUpcomingInvoice(customerId: string, subscriptionId?: string) {
    try {
      const upcomingInvoice = await (stripe.invoices as any).retrieveUpcoming({
        customer: customerId,
        subscription: subscriptionId
      });
      return upcomingInvoice;
    } catch (error) {
      logger.error('Error retrieving upcoming invoice:', error);
      throw new Error('Failed to retrieve upcoming invoice');
    }
  }

  /**
   * Create Stripe product
   */
  async createProduct(name: string, description: string) {
    try {
      const product = await stripe.products.create({
        name,
        description
      });
      logger.info(`Product created: ${product.id}`);
      return product;
    } catch (error) {
      logger.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  /**
   * Create Stripe price for subscription
   */
  async createPrice(productId: string, amount: number, currency: string, interval: 'month' | 'year') {
    try {
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: amount,
        currency: currency.toLowerCase(),
        recurring: {
          interval
        }
      });
      logger.info(`Price created: ${price.id}`);
      return price;
    } catch (error) {
      logger.error('Error creating price:', error);
      throw new Error('Failed to create price');
    }
  }

  /**
   * Create setup intent for saving payment method
   */
  async createSetupIntent(customerId: string) {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        usage: 'off_session'
      });
      logger.info(`Setup intent created: ${setupIntent.id}`);
      return setupIntent;
    } catch (error) {
      logger.error('Error creating setup intent:', error);
      throw new Error('Failed to create setup intent');
    }
  }

  /**
   * Cancel subscription with option to cancel immediately or at period end
   */
  async cancelSubscriptionAdvanced(subscriptionId: string, immediately: boolean = false) {
    try {
      let subscription;
      
      if (immediately) {
        subscription = await stripe.subscriptions.cancel(subscriptionId);
      } else {
        subscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true
        });
      }
      
      logger.info(`Subscription ${immediately ? 'cancelled immediately' : 'marked for cancellation'}: ${subscriptionId}`);
      return subscription;
    } catch (error) {
      logger.error('Error cancelling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Create refund for payment intent
   */
  async createRefundForPaymentIntent(paymentIntentId: string, amount?: number, reason?: string) {
    try {
      const refundData: any = {
        payment_intent: paymentIntentId,
        reason: reason as any
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }

      const refund = await stripe.refunds.create(refundData);
      logger.info(`Refund created: ${refund.id} for payment intent: ${paymentIntentId}`);
      return refund;
    } catch (error) {
      logger.error('Error creating refund for payment intent:', error);
      throw new Error('Failed to create refund');
    }
  }

  /**
   * Get customer payment methods with type filter
   */
  async getCustomerPaymentMethods(customerId: string, type: string = 'card') {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: type as any
      });
      return paymentMethods.data;
    } catch (error) {
      logger.error('Error fetching customer payment methods:', error);
      throw new Error('Failed to fetch payment methods');
    }
  }

  /**
   * Retrieve payment method from Stripe
   */
  async retrievePaymentMethod(paymentMethodId: string) {
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      return paymentMethod;
    } catch (error) {
      logger.error('Error retrieving payment method:', error);
      throw new Error('Failed to retrieve payment method');
    }
  }
}

export default new StripeService();