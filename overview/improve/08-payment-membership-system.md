# 08. Payment & Membership System - Complete Implementation Guide

## Problem Analysis
The current project lacks a comprehensive payment and membership system essential for monetizing the platform through premium features, tournament entries, court bookings, and subscription-based services.

## Core Requirements
1. **Stripe Integration**: Secure payment processing for all transactions
2. **Subscription Management**: Premium memberships with recurring billing
3. **Tournament Entry Fees**: Payment processing for tournament registrations
4. **Court Booking Payments**: Payment for court reservations
5. **Membership Tiers**: Different access levels with varying features
6. **Payment History**: Transaction tracking and invoicing
7. **Refund Management**: Automated and manual refund processing
8. **Billing Administration**: Revenue tracking and financial reporting

## Step-by-Step Implementation Plan

### Phase 1: Database Schema Design

#### 1.1 Create Subscription Model (`backend/src/models/Subscription.ts`)
```typescript
interface Subscription extends Model {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  
  // Subscription Details
  status: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  
  // Pricing
  amount: number; // in cents
  currency: 'USD' | 'MXN';
  interval: 'month' | 'year';
  intervalCount: number; // e.g., 3 for every 3 months
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Billing
  nextBillingDate?: Date;
  lastPaymentDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

Subscription.belongsTo(User);
Subscription.belongsTo(SubscriptionPlan, { as: 'plan' });
Subscription.hasMany(Payment);
```

#### 1.2 Create Subscription Plan Model (`backend/src/models/SubscriptionPlan.ts`)
```typescript
interface SubscriptionPlan extends Model {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  stripeProductId: string;
  
  // Pricing
  amount: number; // in cents
  currency: 'USD' | 'MXN';
  interval: 'month' | 'year';
  intervalCount: number;
  
  // Trial
  trialPeriodDays?: number;
  
  // Features
  features: {
    name: string;
    description: string;
    included: boolean;
    limit?: number; // null means unlimited
  }[];
  
  // Limits
  maxTournamentRegistrations?: number; // per month
  maxCourtBookings?: number; // per month
  maxPlayerMatches?: number; // per month
  advancedFilters: boolean;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  customBranding: boolean; // for clubs
  
  // Status
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
  
  createdAt: Date;
  updatedAt: Date;
}

SubscriptionPlan.hasMany(Subscription);
```

#### 1.3 Create Payment Model (`backend/src/models/Payment.ts`)
```typescript
interface Payment extends Model {
  id: string;
  userId: string;
  subscriptionId?: string;
  
  // Payment Details
  stripePaymentIntentId: string;
  stripeChargeId?: string;
  amount: number; // in cents
  currency: 'USD' | 'MXN';
  
  // Payment Purpose
  type: 'subscription' | 'tournament_entry' | 'court_booking' | 'one_time' | 'refund';
  relatedEntityType?: 'tournament' | 'court_booking' | 'subscription';
  relatedEntityId?: string;
  
  // Status
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'requires_action';
  failureReason?: string;
  
  // Payment Method
  paymentMethod: {
    type: 'card' | 'bank_account' | 'wallet';
    card?: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    };
  };
  
  // Fees
  platformFee?: number; // in cents
  stripeFee?: number; // in cents
  netAmount?: number; // amount - fees
  
  // Refund Info
  refundedAmount?: number; // in cents
  refundedAt?: Date;
  refundReason?: string;
  
  // Metadata
  description?: string;
  metadata?: Record<string, any>;
  
  // Webhooks
  webhookProcessed: boolean;
  webhookData?: any;
  
  createdAt: Date;
  updatedAt: Date;
}

Payment.belongsTo(User);
Payment.belongsTo(Subscription);
```

#### 1.4 Create Payment Method Model (`backend/src/models/PaymentMethod.ts`)
```typescript
interface PaymentMethod extends Model {
  id: string;
  userId: string;
  stripePaymentMethodId: string;
  
  // Payment Method Details
  type: 'card' | 'bank_account';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
    country: string;
  };
  
  bankAccount?: {
    bankName: string;
    last4: string;
    accountType: 'checking' | 'savings';
    routingNumber: string;
  };
  
  // Settings
  isDefault: boolean;
  isActive: boolean;
  
  // Billing Details
  billingDetails: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
}

PaymentMethod.belongsTo(User);
```

#### 1.5 Create Invoice Model (`backend/src/models/Invoice.ts`)
```typescript
interface Invoice extends Model {
  id: string;
  userId: string;
  subscriptionId?: string;
  stripeInvoiceId?: string;
  
  // Invoice Details
  invoiceNumber: string;
  amount: number; // in cents
  currency: 'USD' | 'MXN';
  tax?: number; // in cents
  total: number; // amount + tax
  
  // Status
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  
  // Dates
  issueDate: Date;
  dueDate?: Date;
  paidAt?: Date;
  
  // Line Items
  items: {
    description: string;
    amount: number; // in cents
    quantity: number;
    period?: {
      start: Date;
      end: Date;
    };
  }[];
  
  // PDF
  pdfUrl?: string;
  hostedInvoiceUrl?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

Invoice.belongsTo(User);
Invoice.belongsTo(Subscription);
```

### Phase 2: Payment Services

#### 2.1 Stripe Service (`backend/src/services/stripeService.ts`)
```typescript
import Stripe from 'stripe';

class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16'
    });
  }

  async createCustomer(userId: string, email: string, name?: string) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: { userId }
      });

      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  async createSubscription(customerId: string, priceId: string, paymentMethodId?: string) {
    try {
      const subscriptionData: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      };

      if (paymentMethodId) {
        subscriptionData.default_payment_method = paymentMethodId;
      }

      const subscription = await this.stripe.subscriptions.create(subscriptionData);
      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  async updateSubscription(subscriptionId: string, updates: Partial<Stripe.SubscriptionUpdateParams>) {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, updates);
      return subscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  async cancelSubscription(subscriptionId: string, immediately: boolean = false) {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: !immediately
      });

      if (immediately) {
        await this.stripe.subscriptions.cancel(subscriptionId);
      }

      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  async createPaymentIntent(amount: number, currency: string, customerId: string, metadata?: any) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        customer: customerId,
        metadata,
        automatic_payment_methods: { enabled: true }
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  async createRefund(paymentIntentId: string, amount?: number, reason?: string) {
    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
        reason: reason as Stripe.RefundCreateParams.Reason
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }

      const refund = await this.stripe.refunds.create(refundData);
      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw new Error('Failed to create refund');
    }
  }

  async attachPaymentMethod(paymentMethodId: string, customerId: string) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });

      return paymentMethod;
    } catch (error) {
      console.error('Error attaching payment method:', error);
      throw new Error('Failed to attach payment method');
    }
  }

  async detachPaymentMethod(paymentMethodId: string) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.detach(paymentMethodId);
      return paymentMethod;
    } catch (error) {
      console.error('Error detaching payment method:', error);
      throw new Error('Failed to detach payment method');
    }
  }

  async getCustomerPaymentMethods(customerId: string, type: string = 'card') {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: type as Stripe.PaymentMethodListParams.Type
      });

      return paymentMethods.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error('Failed to fetch payment methods');
    }
  }

  async constructWebhookEvent(body: string | Buffer, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      return event;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      throw new Error('Invalid webhook signature');
    }
  }

  async retrieveSubscription(subscriptionId: string) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice', 'customer']
      });

      return subscription;
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw new Error('Failed to retrieve subscription');
    }
  }

  async getUpcomingInvoice(customerId: string, subscriptionId?: string) {
    try {
      const upcomingInvoice = await this.stripe.invoices.retrieveUpcoming({
        customer: customerId,
        subscription: subscriptionId
      });

      return upcomingInvoice;
    } catch (error) {
      console.error('Error retrieving upcoming invoice:', error);
      throw new Error('Failed to retrieve upcoming invoice');
    }
  }
}

export default new StripeService();
```

#### 2.2 Subscription Service (`backend/src/services/subscriptionService.ts`)
```typescript
class SubscriptionService {
  async createSubscription(userId: string, planId: string, paymentMethodId?: string) {
    const user = await User.findByPk(userId);
    const plan = await SubscriptionPlan.findByPk(planId);

    if (!user || !plan) {
      throw new Error('User or plan not found');
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripeService.createCustomer(
        userId,
        user.email,
        user.username
      );
      stripeCustomerId = customer.id;
      
      await user.update({ stripeCustomerId });
    }

    // Create Stripe subscription
    const stripeSubscription = await stripeService.createSubscription(
      stripeCustomerId,
      plan.stripePriceId,
      paymentMethodId
    );

    // Create local subscription record
    const subscription = await Subscription.create({
      userId,
      planId,
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId,
      status: stripeSubscription.status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      amount: plan.amount,
      currency: plan.currency,
      interval: plan.interval,
      intervalCount: plan.intervalCount,
      nextBillingDate: new Date(stripeSubscription.current_period_end * 1000)
    });

    // Update user's subscription status
    await user.update({
      subscriptionStatus: stripeSubscription.status,
      subscriptionId: subscription.id
    });

    return {
      subscription,
      stripeSubscription,
      clientSecret: (stripeSubscription.latest_invoice as Stripe.Invoice)?.payment_intent?.client_secret
    };
  }

  async cancelSubscription(userId: string, immediately: boolean = false) {
    const subscription = await Subscription.findOne({
      where: { userId, status: 'active' }
    });

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    // Cancel Stripe subscription
    const stripeSubscription = await stripeService.cancelSubscription(
      subscription.stripeSubscriptionId,
      immediately
    );

    // Update local subscription
    await subscription.update({
      status: stripeSubscription.status,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      canceledAt: stripeSubscription.canceled_at ? 
        new Date(stripeSubscription.canceled_at * 1000) : new Date()
    });

    // Update user
    const user = await User.findByPk(userId);
    await user?.update({
      subscriptionStatus: stripeSubscription.status
    });

    return subscription;
  }

  async changeSubscriptionPlan(userId: string, newPlanId: string) {
    const subscription = await Subscription.findOne({
      where: { userId, status: 'active' },
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    const newPlan = await SubscriptionPlan.findByPk(newPlanId);
    if (!newPlan) {
      throw new Error('New plan not found');
    }

    // Update Stripe subscription
    const stripeSubscription = await stripeService.updateSubscription(
      subscription.stripeSubscriptionId,
      {
        items: [{
          id: subscription.stripeSubscriptionId, // This would be the subscription item ID
          price: newPlan.stripePriceId
        }],
        proration_behavior: 'create_prorations'
      }
    );

    // Update local subscription
    await subscription.update({
      planId: newPlanId,
      amount: newPlan.amount,
      currency: newPlan.currency,
      interval: newPlan.interval,
      intervalCount: newPlan.intervalCount,
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
    });

    return subscription;
  }

  async getUserSubscription(userId: string) {
    const subscription = await Subscription.findOne({
      where: { userId },
      include: [
        { model: SubscriptionPlan, as: 'plan' },
        { model: Payment, limit: 5, order: [['createdAt', 'DESC']] }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!subscription) {
      return null;
    }

    // Get usage statistics
    const usage = await this.getSubscriptionUsage(userId, subscription);

    return {
      ...subscription.toJSON(),
      usage
    };
  }

  async processWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    if (!invoice.subscription) return;

    const subscription = await Subscription.findOne({
      where: { stripeSubscriptionId: invoice.subscription as string }
    });

    if (subscription) {
      // Create payment record
      await Payment.create({
        userId: subscription.userId,
        subscriptionId: subscription.id,
        stripePaymentIntentId: invoice.payment_intent as string,
        amount: invoice.amount_paid,
        currency: invoice.currency.toUpperCase(),
        type: 'subscription',
        status: 'succeeded',
        description: `Payment for ${subscription.planId}`,
        webhookProcessed: true
      });

      // Update subscription
      await subscription.update({
        status: 'active',
        lastPaymentDate: new Date(),
        nextBillingDate: invoice.period_end ? 
          new Date(invoice.period_end * 1000) : undefined
      });

      // Send confirmation notification
      await notificationService.createFromTemplate(
        'subscription_payment_success',
        subscription.userId,
        {
          amount: (invoice.amount_paid / 100).toFixed(2),
          currency: invoice.currency.toUpperCase(),
          nextBillingDate: subscription.nextBillingDate?.toLocaleDateString()
        }
      );
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    if (!invoice.subscription) return;

    const subscription = await Subscription.findOne({
      where: { stripeSubscriptionId: invoice.subscription as string }
    });

    if (subscription) {
      await subscription.update({ status: 'past_due' });

      // Send payment failed notification
      await notificationService.createFromTemplate(
        'subscription_payment_failed',
        subscription.userId,
        {
          amount: (invoice.amount_due / 100).toFixed(2),
          currency: invoice.currency.toUpperCase()
        }
      );
    }
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscription = await Subscription.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id }
    });

    if (subscription) {
      await subscription.update({
        status: stripeSubscription.status,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt: stripeSubscription.canceled_at ? 
          new Date(stripeSubscription.canceled_at * 1000) : null
      });
    }
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    const subscription = await Subscription.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id }
    });

    if (subscription) {
      await subscription.update({
        status: 'canceled',
        canceledAt: new Date()
      });

      // Update user
      const user = await User.findByPk(subscription.userId);
      await user?.update({
        subscriptionStatus: 'canceled',
        subscriptionId: null
      });
    }
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: paymentIntent.id }
    });

    if (payment && payment.status !== 'succeeded') {
      await payment.update({
        status: 'succeeded',
        stripeChargeId: paymentIntent.charges?.data[0]?.id,
        webhookProcessed: true
      });

      // Send success notification based on payment type
      if (payment.type === 'tournament_entry') {
        await notificationService.createFromTemplate(
          'tournament_payment_success',
          payment.userId,
          {
            amount: (payment.amount / 100).toFixed(2),
            currency: payment.currency,
            tournamentName: 'Tournament Name' // You'd get this from related entity
          }
        );
      } else if (payment.type === 'court_booking') {
        await notificationService.createFromTemplate(
          'booking_payment_success',
          payment.userId,
          {
            amount: (payment.amount / 100).toFixed(2),
            currency: payment.currency
          }
        );
      }
    }
  }

  private async getSubscriptionUsage(userId: string, subscription: Subscription) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get current month usage
    const [tournamentRegistrations, courtBookings, playerMatches] = await Promise.all([
      // Count tournament registrations this month
      Registration.count({
        where: {
          playerId: userId,
          createdAt: { [Op.gte]: startOfMonth }
        }
      }),
      
      // Count court bookings this month
      CourtBooking.count({
        where: {
          playerId: userId,
          createdAt: { [Op.gte]: startOfMonth }
        }
      }),
      
      // Count player matches this month
      PlayerMatch.count({
        where: {
          [Op.or]: [
            { playerId: userId },
            { partnerId: userId }
          ],
          createdAt: { [Op.gte]: startOfMonth }
        }
      })
    ]);

    return {
      tournamentRegistrations,
      courtBookings,
      playerMatches,
      period: {
        start: startOfMonth,
        end: subscription.currentPeriodEnd
      }
    };
  }

  async createPaymentForBooking(userId: string, bookingId: string, amount: number, currency: string = 'USD') {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Ensure user has Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripeService.createCustomer(userId, user.email, user.username);
      stripeCustomerId = customer.id;
      await user.update({ stripeCustomerId });
    }

    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent(
      amount,
      currency,
      stripeCustomerId,
      { bookingId, type: 'court_booking' }
    );

    // Create payment record
    const payment = await Payment.create({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toUpperCase(),
      type: 'court_booking',
      relatedEntityType: 'court_booking',
      relatedEntityId: bookingId,
      status: 'pending',
      webhookProcessed: false
    });

    return {
      payment,
      clientSecret: paymentIntent.client_secret
    };
  }

  async createPaymentForTournament(userId: string, tournamentId: string, amount: number, currency: string = 'USD') {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Ensure user has Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripeService.createCustomer(userId, user.email, user.username);
      stripeCustomerId = customer.id;
      await user.update({ stripeCustomerId });
    }

    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent(
      amount,
      currency,
      stripeCustomerId,
      { tournamentId, type: 'tournament_entry' }
    );

    // Create payment record
    const payment = await Payment.create({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toUpperCase(),
      type: 'tournament_entry',
      relatedEntityType: 'tournament',
      relatedEntityId: tournamentId,
      status: 'pending',
      webhookProcessed: false
    });

    return {
      payment,
      clientSecret: paymentIntent.client_secret
    };
  }
}

export default new SubscriptionService();
```

### Phase 3: Payment Controllers

#### 3.1 Subscription Controller (`backend/src/controllers/subscriptionController.ts`)
```typescript
export class SubscriptionController {
  async getPlans(req: Request, res: Response) {
    try {
      const plans = await SubscriptionPlan.findAll({
        where: { isActive: true },
        order: [['sortOrder', 'ASC'], ['amount', 'ASC']]
      });

      res.json({
        success: true,
        data: plans
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createSubscription(req: Request, res: Response) {
    try {
      const { planId, paymentMethodId } = req.body;
      
      const result = await subscriptionService.createSubscription(
        req.user.id,
        planId,
        paymentMethodId
      );

      res.status(201).json({
        success: true,
        data: result.subscription,
        clientSecret: result.clientSecret
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getMySubscription(req: Request, res: Response) {
    try {
      const subscription = await subscriptionService.getUserSubscription(req.user.id);

      res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async cancelSubscription(req: Request, res: Response) {
    try {
      const { immediately = false } = req.body;
      
      const subscription = await subscriptionService.cancelSubscription(
        req.user.id,
        immediately
      );

      res.json({
        success: true,
        data: subscription,
        message: immediately ? 
          'Subscription canceled immediately' : 
          'Subscription will cancel at the end of current period'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async changePlan(req: Request, res: Response) {
    try {
      const { planId } = req.body;
      
      const subscription = await subscriptionService.changeSubscriptionPlan(
        req.user.id,
        planId
      );

      res.json({
        success: true,
        data: subscription,
        message: 'Subscription plan changed successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getPaymentMethods(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.user.id);
      
      if (!user?.stripeCustomerId) {
        return res.json({
          success: true,
          data: []
        });
      }

      const paymentMethods = await stripeService.getCustomerPaymentMethods(
        user.stripeCustomerId
      );

      res.json({
        success: true,
        data: paymentMethods
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async addPaymentMethod(req: Request, res: Response) {
    try {
      const { paymentMethodId } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user?.stripeCustomerId) {
        return res.status(400).json({
          success: false,
          error: 'No customer account found'
        });
      }

      const paymentMethod = await stripeService.attachPaymentMethod(
        paymentMethodId,
        user.stripeCustomerId
      );

      res.status(201).json({
        success: true,
        data: paymentMethod,
        message: 'Payment method added successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async removePaymentMethod(req: Request, res: Response) {
    try {
      const { paymentMethodId } = req.params;
      
      await stripeService.detachPaymentMethod(paymentMethodId);

      res.json({
        success: true,
        message: 'Payment method removed successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getPaymentHistory(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, type, status } = req.query;

      let whereClause: any = { userId: req.user.id };
      
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;

      const payments = await Payment.findAndCountAll({
        where: whereClause,
        include: [
          { model: Subscription, include: [{ model: SubscriptionPlan, as: 'plan' }] }
        ],
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: payments.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: payments.count,
          totalPages: Math.ceil(payments.count / Number(limit))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async webhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'] as string;

    try {
      const event = await stripeService.constructWebhookEvent(
        req.body,
        signature
      );

      await subscriptionService.processWebhook(event);

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({
        success: false,
        error: 'Webhook signature verification failed'
      });
    }
  }

  async createPaymentIntent(req: Request, res: Response) {
    try {
      const { amount, currency = 'USD', type, relatedEntityId } = req.body;
      
      let result;
      
      if (type === 'court_booking') {
        result = await subscriptionService.createPaymentForBooking(
          req.user.id,
          relatedEntityId,
          amount,
          currency
        );
      } else if (type === 'tournament_entry') {
        result = await subscriptionService.createPaymentForTournament(
          req.user.id,
          relatedEntityId,
          amount,
          currency
        );
      } else {
        throw new Error('Invalid payment type');
      }

      res.status(201).json({
        success: true,
        data: result.payment,
        clientSecret: result.clientSecret
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}
```

### Phase 4: Frontend Payment Components

#### 4.1 Subscription Plans Component (`frontend/src/components/payments/SubscriptionPlans.tsx`)
```typescript
const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await api.get('/subscriptions/plans');
      setPlans(response.data.data);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="subscription-plans py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="text-lg text-gray-600 mt-4">
            Unlock premium features and take your pickleball experience to the next level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-lg border-2 ${
                plan.isPopular ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.amount / 100}
                  </span>
                  <span className="text-gray-600">
                    /{plan.interval === 'year' ? 'year' : 'month'}
                  </span>
                  {plan.trialPeriodDays && (
                    <div className="text-sm text-green-600 mt-1">
                      {plan.trialPeriodDays} day free trial
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className={`h-5 w-5 ${
                          feature.included ? 'text-green-500' : 'text-gray-400'
                        } mr-3`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        {feature.included ? (
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        ) : (
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        )}
                      </svg>
                      <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
                        {feature.name}
                        {feature.limit && ` (${feature.limit} per month)`}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    plan.isPopular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {user?.subscriptionStatus === 'active' ? 'Switch Plan' : 'Get Started'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPlan && (
          <PaymentModal
            plan={selectedPlan}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedPlan(null);
            }}
          />
        )}
      </div>
    </div>
  );
};
```

#### 4.2 Payment Modal Component (`frontend/src/components/payments/PaymentModal.tsx`)
```typescript
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  plan: SubscriptionPlan;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <Elements stripe={stripePromise}>
          <PaymentForm plan={plan} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
};

const PaymentForm: React.FC<PaymentModalProps> = ({ plan, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message || 'Payment method creation failed');
        return;
      }

      // Create subscription
      const response = await api.post('/subscriptions', {
        planId: plan.id,
        paymentMethodId: paymentMethod.id
      });

      const { clientSecret } = response.data;

      if (clientSecret) {
        // Confirm payment
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
        
        if (confirmError) {
          setError(confirmError.message || 'Payment confirmation failed');
          return;
        }
      }

      // Success
      alert('Subscription created successfully!');
      onClose();
      window.location.reload(); // Refresh to update user subscription status

    } catch (error: any) {
      setError(error.response?.data?.error || 'Subscription creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Subscribe to {plan.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Plan Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium">{plan.name}</span>
          <span className="text-lg font-bold">
            ${plan.amount / 100}/{plan.interval}
          </span>
        </div>
        {plan.trialPeriodDays && (
          <div className="text-sm text-green-600 mt-1">
            {plan.trialPeriodDays} day free trial included
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card Element */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Information
          </label>
          <div className="border border-gray-300 rounded-lg p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Terms */}
        <div className="mb-6 text-xs text-gray-600">
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          You can cancel your subscription at any time.
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Subscribe - $${plan.amount / 100}/${plan.interval}`}
          </button>
        </div>
      </form>
    </div>
  );
};
```

#### 4.3 Subscription Management Component (`frontend/src/components/payments/SubscriptionManagement.tsx`)
```typescript
const SubscriptionManagement: React.FC = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      const [subRes, pmRes, histRes] = await Promise.all([
        api.get('/subscriptions/me'),
        api.get('/subscriptions/payment-methods'),
        api.get('/subscriptions/payment-history', { params: { limit: 10 } })
      ]);

      setSubscription(subRes.data.data);
      setPaymentMethods(pmRes.data.data);
      setPaymentHistory(histRes.data.data);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (immediately: boolean = false) => {
    const confirmMessage = immediately 
      ? 'Are you sure you want to cancel your subscription immediately? You will lose access to premium features right away.'
      : 'Are you sure you want to cancel your subscription? You will retain access until the end of your current billing period.';

    if (!window.confirm(confirmMessage)) return;

    try {
      await api.post('/subscriptions/cancel', { immediately });
      await loadSubscriptionData();
      alert(immediately ? 'Subscription canceled immediately.' : 'Subscription will cancel at the end of the current period.');
    } catch (error) {
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>

      {/* Current Subscription */}
      {subscription ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Current Subscription</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Plan Details</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Plan:</span> {subscription.plan.name}</p>
                <p><span className="font-medium">Price:</span> {formatAmount(subscription.amount, subscription.currency)}/{subscription.interval}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                    subscription.status === 'past_due' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1).replace('_', ' ')}
                  </span>
                </p>
                <p><span className="font-medium">Next Billing:</span> {formatDate(subscription.currentPeriodEnd)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Usage This Month</h3>
              <div className="space-y-1">
                <p>Tournament Registrations: {subscription.usage?.tournamentRegistrations || 0}</p>
                <p>Court Bookings: {subscription.usage?.courtBookings || 0}</p>
                <p>Player Matches: {subscription.usage?.playerMatches || 0}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Change Plan
            </button>
            
            {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
              <button 
                onClick={() => handleCancelSubscription(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Cancel Subscription
              </button>
            )}

            {subscription.cancelAtPeriodEnd && (
              <div className="flex items-center text-yellow-600">
                <span>⚠️ Subscription will cancel on {formatDate(subscription.currentPeriodEnd)}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">No Active Subscription</h2>
          <p className="text-gray-600 mb-4">Subscribe to unlock premium features</p>
          <Link
            to="/subscribe"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            View Plans
          </Link>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
        
        {paymentHistory.length === 0 ? (
          <p className="text-gray-600">No payments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="py-3">{formatDate(payment.createdAt)}</td>
                    <td className="py-3">{payment.description || payment.type.replace('_', ' ')}</td>
                    <td className="py-3">{formatAmount(payment.amount, payment.currency)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
```

### Phase 5: Testing & Quality Assurance

#### 5.1 Payment System Tests
```typescript
// backend/tests/payments.test.ts
describe('Payment System', () => {
  describe('Subscription Management', () => {
    it('should create subscription', async () => {
      const subscriptionData = {
        planId: 'plan-id',
        paymentMethodId: 'pm_test_card'
      };

      const response = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${playerToken}`)
        .send(subscriptionData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.clientSecret).toBeDefined();
    });

    it('should cancel subscription', async () => {
      const response = await request(app)
        .post('/api/subscriptions/cancel')
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ immediately: false })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Payment Processing', () => {
    it('should create payment intent for tournament', async () => {
      const paymentData = {
        amount: 50,
        currency: 'USD',
        type: 'tournament_entry',
        relatedEntityId: 'tournament-id'
      };

      const response = await request(app)
        .post('/api/payments/create-payment-intent')
        .set('Authorization', `Bearer ${playerToken}`)
        .send(paymentData)
        .expect(201);

      expect(response.body.data.amount).toBe(5000); // cents
      expect(response.body.clientSecret).toBeDefined();
    });
  });

  describe('Webhook Processing', () => {
    it('should handle subscription webhook', async () => {
      const webhookEvent = {
        type: 'customer.subscription.updated',
        data: { object: mockStripeSubscription }
      };

      const response = await request(app)
        .post('/api/subscriptions/webhook')
        .send(webhookEvent)
        .expect(200);

      expect(response.body.received).toBe(true);
    });
  });
});
```

## Implementation Priority
1. **CRITICAL**: Database schema and Stripe integration (Phase 1-2)
2. **CRITICAL**: Subscription service and webhooks (Phase 2)
3. **HIGH**: Payment controllers and API endpoints (Phase 3)
4. **HIGH**: Frontend subscription management (Phase 4)
5. **MEDIUM**: Payment history and reporting features
6. **LOW**: Comprehensive testing (Phase 5)

## Expected Results
After implementation:
- Complete Stripe integration for secure payments
- Subscription management with multiple tiers
- Tournament and court booking payment processing
- Automated billing and invoice generation
- Payment method management for users
- Comprehensive webhook handling for real-time updates
- Financial reporting and analytics for administrators
- Refund management and processing

## Files to Create/Modify
- `backend/src/models/Subscription.ts`
- `backend/src/models/SubscriptionPlan.ts`
- `backend/src/models/Payment.ts`
- `backend/src/models/PaymentMethod.ts`
- `backend/src/models/Invoice.ts`
- `backend/src/services/stripeService.ts`
- `backend/src/services/subscriptionService.ts`
- `backend/src/controllers/subscriptionController.ts`
- `backend/src/routes/subscriptionRoutes.ts`
- `frontend/src/components/payments/SubscriptionPlans.tsx`
- `frontend/src/components/payments/PaymentModal.tsx`
- `frontend/src/components/payments/SubscriptionManagement.tsx`
- `frontend/src/store/paymentSlice.ts`