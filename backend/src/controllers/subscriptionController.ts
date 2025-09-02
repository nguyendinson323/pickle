import { Request, Response } from 'express';
import subscriptionService from '../services/subscriptionService';
import stripeService from '../services/stripeService';
import SubscriptionPlan from '../models/SubscriptionPlan';
import Payment from '../models/Payment';
import logger from '../utils/logger';

class SubscriptionController {
  
  /**
   * Get all available subscription plans
   */
  async getPlans(req: Request, res: Response) {
    try {
      const plans = await SubscriptionPlan.findAll({
        where: { isActive: true },
        order: [['amount', 'ASC']]
      });

      res.json({
        success: true,
        data: plans
      });
    } catch (error) {
      logger.error('Error fetching subscription plans:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subscription plans',
        error: error.message
      });
    }
  }

  /**
   * Get user's current subscription
   */
  async getUserSubscription(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const subscription = await subscriptionService.getUserSubscription(userId);

      res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Error fetching user subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subscription',
        error: error.message
      });
    }
  }

  /**
   * Create new subscription
   */
  async createSubscription(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { planId, paymentMethodId } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!planId) {
        return res.status(400).json({
          success: false,
          message: 'Plan ID is required'
        });
      }

      const result = await subscriptionService.createSubscription(
        userId,
        planId,
        paymentMethodId
      );

      res.status(201).json({
        success: true,
        message: 'Subscription created successfully',
        data: {
          subscription: result.subscription,
          clientSecret: result.clientSecret
        }
      });
    } catch (error) {
      logger.error('Error creating subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create subscription',
        error: error.message
      });
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { immediately } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const subscription = await subscriptionService.cancelSubscription(
        userId,
        immediately || false
      );

      res.json({
        success: true,
        message: immediately ? 
          'Subscription cancelled immediately' : 
          'Subscription will cancel at end of billing period',
        data: subscription
      });
    } catch (error) {
      logger.error('Error cancelling subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel subscription',
        error: error.message
      });
    }
  }

  /**
   * Change subscription plan
   */
  async changeSubscriptionPlan(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { newPlanId } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!newPlanId) {
        return res.status(400).json({
          success: false,
          message: 'New plan ID is required'
        });
      }

      const subscription = await subscriptionService.changeSubscriptionPlan(
        userId,
        newPlanId
      );

      res.json({
        success: true,
        message: 'Subscription plan changed successfully',
        data: subscription
      });
    } catch (error) {
      logger.error('Error changing subscription plan:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change subscription plan',
        error: error.message
      });
    }
  }

  /**
   * Create payment for tournament entry
   */
  async createTournamentPayment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { tournamentId, amount, currency = 'USD' } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!tournamentId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Tournament ID and amount are required'
        });
      }

      const result = await subscriptionService.createPaymentForTournament(
        userId,
        tournamentId,
        amount,
        currency
      );

      res.status(201).json({
        success: true,
        message: 'Tournament payment created successfully',
        data: {
          payment: result.payment,
          clientSecret: result.clientSecret
        }
      });
    } catch (error) {
      logger.error('Error creating tournament payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create tournament payment',
        error: error.message
      });
    }
  }

  /**
   * Create payment for court booking
   */
  async createBookingPayment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { bookingId, amount, currency = 'USD' } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!bookingId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID and amount are required'
        });
      }

      const result = await subscriptionService.createPaymentForBooking(
        userId,
        bookingId,
        amount,
        currency
      );

      res.status(201).json({
        success: true,
        message: 'Booking payment created successfully',
        data: {
          payment: result.payment,
          clientSecret: result.clientSecret
        }
      });
    } catch (error) {
      logger.error('Error creating booking payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create booking payment',
        error: error.message
      });
    }
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { limit = 10, offset = 0, type } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const where: any = { userId };
      if (type) {
        where.type = type;
      }

      const payments = await Payment.findAndCountAll({
        where,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          payments: payments.rows,
          pagination: {
            total: payments.count,
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
            pages: Math.ceil(payments.count / parseInt(limit as string))
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching payment history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payment history',
        error: error.message
      });
    }
  }

  /**
   * Get upcoming invoice preview
   */
  async getUpcomingInvoice(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const subscription = await subscriptionService.getUserSubscription(userId);
      
      if (!subscription || !subscription.stripeCustomerId) {
        return res.status(404).json({
          success: false,
          message: 'No active subscription found'
        });
      }

      const upcomingInvoice = await stripeService.getUpcomingInvoice(
        subscription.stripeCustomerId,
        subscription.stripeSubscriptionId
      );

      res.json({
        success: true,
        data: {
          amount: upcomingInvoice.amount_due,
          currency: upcomingInvoice.currency,
          periodStart: new Date(upcomingInvoice.period_start * 1000),
          periodEnd: new Date(upcomingInvoice.period_end * 1000),
          invoiceDate: new Date(upcomingInvoice.created * 1000),
          dueDate: upcomingInvoice.due_date ? 
            new Date(upcomingInvoice.due_date * 1000) : null
        }
      });
    } catch (error) {
      logger.error('Error fetching upcoming invoice:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming invoice',
        error: error.message
      });
    }
  }

  /**
   * Process Stripe webhooks
   */
  async processWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const body = req.body;

      if (!signature) {
        return res.status(400).json({
          success: false,
          message: 'Missing Stripe signature'
        });
      }

      const event = stripeService.constructWebhookEvent(body, signature);
      await subscriptionService.processWebhook(event);

      res.json({
        success: true,
        message: 'Webhook processed successfully'
      });
    } catch (error) {
      logger.error('Error processing webhook:', error);
      res.status(400).json({
        success: false,
        message: 'Webhook processing failed',
        error: error.message
      });
    }
  }

  /**
   * Reactivate cancelled subscription
   */
  async reactivateSubscription(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const subscription = await subscriptionService.getUserSubscription(userId);
      
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'No subscription found'
        });
      }

      if (!subscription.cancelAtPeriodEnd) {
        return res.status(400).json({
          success: false,
          message: 'Subscription is not scheduled for cancellation'
        });
      }

      const updatedSubscription = await stripeService.updateSubscription(
        subscription.stripeSubscriptionId,
        { cancel_at_period_end: false }
      );

      // Update local subscription
      await subscription.update({
        cancelAtPeriodEnd: false,
        canceledAt: null
      });

      res.json({
        success: true,
        message: 'Subscription reactivated successfully',
        data: subscription
      });
    } catch (error) {
      logger.error('Error reactivating subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reactivate subscription',
        error: error.message
      });
    }
  }
}

export default new SubscriptionController();