import stripeService from './stripeService';
import NotificationService from './notificationService';

const notificationService = new NotificationService();
import User from '../models/User';
import Subscription from '../models/Subscription';
import SubscriptionPlan from '../models/SubscriptionPlan';
import Payment from '../models/Payment';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import Stripe from 'stripe';
import logger from '../utils/logger';

class SubscriptionService {
  
  /**
   * Create a new subscription for a user
   */
  async createSubscription(userId: number, planId: string, paymentMethodId?: string) {
    try {
      const user = await User.findByPk(userId);
      const plan = await SubscriptionPlan.findByPk(planId);

      if (!user || !plan) {
        throw new Error('User or plan not found');
      }

      // Create or get Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripeService.createCustomer({
          email: user.email,
          name: user.username,
          metadata: { userId: userId.toString() }
        });
        stripeCustomerId = customer.id;
        
        await user.update({ stripeCustomerId });
      }

      // Create Stripe subscription
      const stripeSubscription = await stripeService.createSubscription(
        stripeCustomerId,
        plan.stripePriceId,
        { userId: userId.toString(), planId }
      );

      // Create local subscription record
      // Cast to proper Stripe subscription type
      const stripeSub = stripeSubscription as any;
      
      const subscription = await Subscription.create({
        userId,
        planId: parseInt(planId),
        stripeSubscriptionId: stripeSub.id,
        stripeCustomerId,
        status: stripeSub.status,
        currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
        amount: plan.amount,
        currency: plan.currency,
        interval: plan.interval,
        intervalCount: plan.intervalCount,
        nextBillingDate: new Date(stripeSub.current_period_end * 1000)
      });

      logger.info(`Subscription created: ${subscription.id} for user: ${userId}`);

      return {
        subscription,
        stripeSubscription,
        clientSecret: (stripeSub.latest_invoice as any)?.payment_intent?.client_secret
      };
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  /**
   * Cancel a user's subscription
   */
  async cancelSubscription(userId: number, immediately: boolean = false) {
    try {
      const subscription = await Subscription.findOne({
        where: { userId, status: 'active' },
        include: [{ model: SubscriptionPlan, as: 'plan' }]
      });

      if (!subscription) {
        throw new Error('No active subscription found');
      }

      // Cancel Stripe subscription
      const stripeSubscription = await stripeService.cancelSubscriptionAdvanced(
        subscription.stripeSubscriptionId,
        immediately
      );

      // Update local subscription
      await subscription.update({
        status: (stripeSubscription as any).status,
        cancelAtPeriodEnd: (stripeSubscription as any).cancel_at_period_end,
        canceledAt: (stripeSubscription as any).canceled_at ? 
          new Date((stripeSubscription as any).canceled_at * 1000) : new Date()
      });

      logger.info(`Subscription cancelled: ${subscription.id} (immediate: ${immediately})`);

      // Send cancellation notification
      await notificationService.sendNotification({
        userId: userId.toString(),
        type: 'system',
        category: 'info',
        title: 'Subscription Cancelled',
        message: immediately ? 
          'Your subscription has been cancelled immediately.' :
          'Your subscription will cancel at the end of your current billing period.',
        channels: { inApp: true, email: true, sms: false, push: true }
      });

      return subscription;
    } catch (error) {
      logger.error('Error cancelling subscription:', error);
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  /**
   * Change a user's subscription plan
   */
  async changeSubscriptionPlan(userId: number, newPlanId: string) {
    try {
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

      // Get current subscription items from Stripe
      const stripeSubscription = await stripeService.retrieveSubscription(subscription.stripeSubscriptionId);
      
      // Update Stripe subscription
      const updatedStripeSubscription = await stripeService.updateSubscription(
        subscription.stripeSubscriptionId,
        {
          items: [{
            id: stripeSubscription.items.data[0].id,
            price: newPlan.stripePriceId
          }],
          proration_behavior: 'create_prorations'
        }
      );

      // Update local subscription
      await subscription.update({
        planId: parseInt(newPlanId),
        amount: newPlan.amount,
        currency: newPlan.currency,
        interval: newPlan.interval,
        intervalCount: newPlan.intervalCount,
        currentPeriodEnd: new Date((updatedStripeSubscription as any).current_period_end * 1000),
        nextBillingDate: new Date((updatedStripeSubscription as any).current_period_end * 1000)
      });

      logger.info(`Subscription plan changed: ${subscription.id} to plan: ${newPlanId}`);

      // Send plan change notification
      await notificationService.sendNotification({
        userId: userId.toString(),
        type: 'system',
        category: 'success',
        title: 'Subscription Plan Changed',
        message: `Your subscription has been upgraded to ${newPlan.name}.`,
        channels: { inApp: true, email: true, sms: false, push: true }
      });

      return subscription;
    } catch (error) {
      logger.error('Error changing subscription plan:', error);
      throw new Error(`Failed to change subscription plan: ${error.message}`);
    }
  }

  /**
   * Get user's subscription with usage statistics
   */
  async getUserSubscription(userId: number) {
    try {
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
    } catch (error) {
      logger.error('Error getting user subscription:', error);
      throw new Error(`Failed to get subscription: ${error.message}`);
    }
  }

  /**
   * Process Stripe webhook events
   */
  async processWebhook(event: Stripe.Event) {
    try {
      logger.info(`Processing webhook: ${event.type}`);

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
          logger.info(`Unhandled webhook event type: ${event.type}`);
      }
    } catch (error) {
      logger.error(`Error processing webhook ${event.type}:`, error);
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }

  /**
   * Create payment for tournament entry
   */
  async createPaymentForTournament(userId: number, tournamentId: string, amount: number, currency: string = 'USD') {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Ensure user has Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripeService.createCustomer({
          email: user.email,
          name: user.username,
          metadata: { userId: userId.toString() }
        });
        stripeCustomerId = customer.id;
        await user.update({ stripeCustomerId });
      }

      // Create payment intent
      const paymentIntent = await stripeService.createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        customerId: stripeCustomerId,
        metadata: { tournamentId, type: 'tournament_entry' }
      });

      // Create payment record
      const payment = await Payment.create({
        userId,
        stripePaymentIntentId: paymentIntent.id,
        amount: Math.round(amount * 100),
        currency: currency.toUpperCase() as any,
        type: 'tournament_entry',
        relatedEntityType: 'tournament',
        relatedEntityId: parseInt(tournamentId),
        status: 'pending',
        paymentMethod: { type: 'card' }, // Will be updated when payment is confirmed
        webhookProcessed: false
      });

      return {
        payment,
        clientSecret: paymentIntent.client_secret
      };
    } catch (error) {
      logger.error('Error creating tournament payment:', error);
      throw new Error(`Failed to create tournament payment: ${error.message}`);
    }
  }

  /**
   * Create payment for court booking
   */
  async createPaymentForBooking(userId: number, bookingId: string, amount: number, currency: string = 'USD') {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Ensure user has Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripeService.createCustomer({
          email: user.email,
          name: user.username,
          metadata: { userId: userId.toString() }
        });
        stripeCustomerId = customer.id;
        await user.update({ stripeCustomerId });
      }

      // Create payment intent
      const paymentIntent = await stripeService.createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        customerId: stripeCustomerId,
        metadata: { bookingId, type: 'court_booking' }
      });

      // Create payment record
      const payment = await Payment.create({
        userId,
        stripePaymentIntentId: paymentIntent.id,
        amount: Math.round(amount * 100),
        currency: currency.toUpperCase() as any,
        type: 'court_booking',
        relatedEntityType: 'court_booking',
        relatedEntityId: parseInt(bookingId),
        status: 'pending',
        paymentMethod: { type: 'card' },
        webhookProcessed: false
      });

      return {
        payment,
        clientSecret: paymentIntent.client_secret
      };
    } catch (error) {
      logger.error('Error creating booking payment:', error);
      throw new Error(`Failed to create booking payment: ${error.message}`);
    }
  }

  // Private webhook handlers
  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    if (!(invoice as any).subscription) return;

    const subscription = await Subscription.findOne({
      where: { stripeSubscriptionId: (invoice as any).subscription as string }
    });

    if (subscription) {
      // Create payment record
      await Payment.create({
        userId: subscription.userId,
        subscriptionId: subscription.id,
        stripePaymentIntentId: (invoice as any).payment_intent as string,
        amount: invoice.amount_paid,
        currency: invoice.currency.toUpperCase() as any,
        type: 'subscription',
        status: 'succeeded',
        description: `Payment for subscription ${subscription.planId}`,
        paymentMethod: { type: 'card' },
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
      await notificationService.sendNotification({
        userId: subscription.userId.toString(),
        type: 'system',
        category: 'success',
        title: 'Payment Successful',
        message: `Your subscription payment of ${(invoice.amount_paid / 100).toFixed(2)} ${invoice.currency.toUpperCase()} has been processed successfully.`,
        channels: { inApp: true, email: true, sms: false, push: true }
      });
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    if (!(invoice as any).subscription) return;

    const subscription = await Subscription.findOne({
      where: { stripeSubscriptionId: (invoice as any).subscription as string }
    });

    if (subscription) {
      await subscription.update({ status: 'past_due' });

      // Send payment failed notification
      await notificationService.sendNotification({
        userId: subscription.userId.toString(),
        type: 'system',
        category: 'error',
        title: 'Payment Failed',
        message: `Your subscription payment of ${(invoice.amount_due / 100).toFixed(2)} ${invoice.currency.toUpperCase()} failed. Please update your payment method.`,
        channels: { inApp: true, email: true, sms: false, push: true }
      });
    }
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscription = await Subscription.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id }
    });

    if (subscription) {
      await subscription.update({
        status: stripeSubscription.status as any,
        currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: (stripeSubscription as any).cancel_at_period_end,
        canceledAt: (stripeSubscription as any).canceled_at ? 
          new Date((stripeSubscription as any).canceled_at * 1000) : null
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

      // Send cancellation confirmation
      await notificationService.sendNotification({
        userId: subscription.userId.toString(),
        type: 'system',
        category: 'info',
        title: 'Subscription Cancelled',
        message: 'Your subscription has been cancelled and you will not be charged again.',
        channels: { inApp: true, email: true, sms: false, push: true }
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
        stripeChargeId: (paymentIntent as any).charges?.data[0]?.id,
        webhookProcessed: true,
        paymentMethod: {
          type: 'card',
          card: (paymentIntent as any).charges?.data[0]?.payment_method_details?.card ? {
            brand: (paymentIntent as any).charges.data[0].payment_method_details.card.brand,
            last4: (paymentIntent as any).charges.data[0].payment_method_details.card.last4,
            expMonth: (paymentIntent as any).charges.data[0].payment_method_details.card.exp_month,
            expYear: (paymentIntent as any).charges.data[0].payment_method_details.card.exp_year
          } : undefined
        }
      });

      // Send success notification based on payment type
      let title = 'Payment Successful';
      let message = `Your payment of ${(payment.amount / 100).toFixed(2)} ${payment.currency} has been processed successfully.`;

      if (payment.type === 'tournament_entry') {
        title = 'Tournament Registration Complete';
        message = `Your tournament entry fee of ${(payment.amount / 100).toFixed(2)} ${payment.currency} has been paid successfully.`;
      } else if (payment.type === 'court_booking') {
        title = 'Court Booking Confirmed';
        message = `Your court booking payment of ${(payment.amount / 100).toFixed(2)} ${payment.currency} has been processed successfully.`;
      }

      await notificationService.sendNotification({
        userId: payment.userId.toString(),
        type: 'system',
        category: 'success',
        title,
        message,
        channels: { inApp: true, email: true, sms: false, push: true }
      });
    }
  }

  private async getSubscriptionUsage(userId: number, subscription: Subscription) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // For now, return empty usage stats - this would be connected to actual tournament/booking models
    return {
      tournamentRegistrations: 0,
      courtBookings: 0,
      playerMatches: 0,
      period: {
        start: startOfMonth,
        end: subscription.currentPeriodEnd
      }
    };
  }
}

export default new SubscriptionService();