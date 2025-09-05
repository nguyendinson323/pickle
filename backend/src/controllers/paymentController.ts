import { Request, Response } from 'express';
import { MembershipPlan, Payment, User, Membership } from '../models';
import subscriptionService from '../services/subscriptionService';
import stripeService from '../services/stripeService';
import PaymentMethod from '../models/PaymentMethod';
import Subscription from '../models/Subscription';
import SubscriptionPlan from '../models/SubscriptionPlan';
import { UserRole } from '../types/auth';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    id: number;
    email: string;
    role: UserRole;
  };
}

const getPlans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.query;
    const where = role ? { role: role as string } : {};
    const plans = await MembershipPlan.findAll({ where });

    res.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch membership plans' });
  }
};

const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { planId, amount, type, metadata } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripeService.createPaymentIntent({
      amount: amount * 100, // Convert to cents
      currency: 'mxn',
      metadata: {
        userId: userId.toString(),
        planId: planId?.toString() || '',
        type: type || 'membership',
        ...metadata
      }
    });

    // Create payment record
    const payment = await Payment.create({
      userId,
      paymentType: type || 'membership',
      amount,
      status: 'pending',
      paymentMethod: 'stripe',
      stripePaymentIntentId: paymentIntent.id,
      metadata: {
        planId,
        ...metadata
      }
    } as any);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      amount: amount
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error.message 
    });
  }
};

const confirmPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentIntentId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify payment with Stripe
    const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      res.status(400).json({ 
        error: 'Payment not successful',
        status: paymentIntent.status 
      });
      return;
    }

    // Update payment record
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: paymentIntentId }
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment record not found' });
      return;
    }

    if (payment.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to confirm this payment' });
      return;
    }

    await payment.update({
      status: 'succeeded',
      stripeChargeId: paymentIntent.latest_charge as string
    });

    // If membership payment, activate membership
    const paymentData = payment as any;
    if (paymentData.paymentType === 'membership' && paymentData.metadata?.planId) {
      const plan = await MembershipPlan.findByPk(payment.metadata.planId);
      if (plan) {
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        await Membership.create({
          userId,
          membershipPlanId: plan.id,
          status: 'active',
          startDate: new Date(),
          endDate: expirationDate
        } as any);

        await User.update(
          { membershipPlanId: plan.id } as any,
          { where: { id: userId } }
        );
      }
    }

    res.json({
      success: true,
      payment,
      message: 'Payment confirmed successfully'
    });
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ 
      error: 'Failed to confirm payment',
      details: error.message 
    });
  }
};

const getPaymentHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { page = 1, limit = 10, type, status } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const offset = (Number(page) - 1) * Number(limit);
    const where: any = { userId };
    
    if (type) where.type = type;
    if (status) where.status = status;

    const { rows: payments, count: total } = await Payment.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      payments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};

const getPaymentDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const payment = await Payment.findOne({
      where: { id, userId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] }
      ]
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    res.json({ payment });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
};

const refundPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const payment = await Payment.findByPk(id);
    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    if (payment.status !== 'succeeded') {
      res.status(400).json({ error: 'Can only refund succeeded payments' });
      return;
    }

    if (!payment.stripeChargeId) {
      res.status(400).json({ error: 'No charge ID available for refund' });
      return;
    }

    // Process refund with Stripe
    const refund = await stripeService.createRefund({
      chargeId: payment.stripeChargeId,
      reason: reason || 'requested_by_customer'
    });

    // Update payment record
    await payment.update({
      status: 'refunded',
      refundReason: reason
    } as any);

    // If membership payment, deactivate membership
    const paymentType = (payment as any).paymentType;
    if (paymentType === 'membership') {
      await Membership.update(
        { status: 'cancelled', cancelledAt: new Date() } as any,
        { where: { userId: payment.userId } as any }
      );

      await User.update(
        { } as any,
        { where: { id: payment.userId } }
      );
    }

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      refundId: refund.id
    });
  } catch (error: any) {
    console.error('Error processing refund:', error);
    res.status(500).json({ 
      error: 'Failed to process refund',
      details: error.message 
    });
  }
};

const createSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { planId, paymentMethodId } = req.body;
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!planId) {
      res.status(400).json({ error: 'Plan ID is required' });
      return;
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
  } catch (error: any) {
    logger.error('Error creating subscription:', error);
    res.status(500).json({ 
      error: 'Failed to create subscription',
      details: error.message 
    });
  }
};

const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { immediately } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
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
  } catch (error: any) {
    logger.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      error: 'Failed to cancel subscription',
      details: error.message 
    });
  }
};

// New payment method management functions
const createSetupIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Ensure user has Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripeService.createCustomer({
        email: user.email,
        name: user.username || user.email,
        metadata: { userId: userId.toString() }
      });
      stripeCustomerId = customer.id;
      await user.update({ stripeCustomerId });
    }

    const setupIntent = await stripeService.createSetupIntent(stripeCustomerId);

    res.json({
      success: true,
      clientSecret: setupIntent.client_secret
    });
  } catch (error: any) {
    logger.error('Error creating setup intent:', error);
    res.status(500).json({
      error: 'Failed to create setup intent',
      details: error.message
    });
  }
};

const savePaymentMethod = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { paymentMethodId, isDefault = false } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!paymentMethodId) {
      res.status(400).json({ error: 'Payment method ID is required' });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user || !user.stripeCustomerId) {
      res.status(404).json({ error: 'User or Stripe customer not found' });
      return;
    }

    // Get payment method details from Stripe
    const stripePaymentMethod = await stripeService.retrievePaymentMethod(paymentMethodId);

    // If this should be default, set all others to non-default
    if (isDefault) {
      await PaymentMethod.update(
        { isDefault: false },
        { where: { userId } }
      );
    }

    // Create local payment method record
    const paymentMethod = await PaymentMethod.create({
      id: uuidv4(),
      userId,
      stripePaymentMethodId: paymentMethodId,
      type: stripePaymentMethod.type as any,
      card: stripePaymentMethod.card ? {
        brand: stripePaymentMethod.card.brand,
        last4: stripePaymentMethod.card.last4,
        expMonth: stripePaymentMethod.card.exp_month,
        expYear: stripePaymentMethod.card.exp_year,
        funding: stripePaymentMethod.card.funding as any,
        country: stripePaymentMethod.card.country || 'Unknown'
      } : undefined,
      isDefault,
      isActive: true,
      billingDetails: {
        name: stripePaymentMethod.billing_details?.name,
        email: stripePaymentMethod.billing_details?.email,
        phone: stripePaymentMethod.billing_details?.phone,
        address: stripePaymentMethod.billing_details?.address
      }
    });

    res.status(201).json({
      success: true,
      message: 'Payment method saved successfully',
      paymentMethod
    });
  } catch (error: any) {
    logger.error('Error saving payment method:', error);
    res.status(500).json({
      error: 'Failed to save payment method',
      details: error.message
    });
  }
};

const getUserPaymentMethods = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const paymentMethods = await PaymentMethod.findAll({
      where: { userId, isActive: true },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      paymentMethods
    });
  } catch (error: any) {
    logger.error('Error fetching payment methods:', error);
    res.status(500).json({
      error: 'Failed to fetch payment methods',
      details: error.message
    });
  }
};

const removePaymentMethod = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { paymentMethodId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const paymentMethod = await PaymentMethod.findOne({
      where: { id: paymentMethodId, userId }
    });

    if (!paymentMethod) {
      res.status(404).json({ error: 'Payment method not found' });
      return;
    }

    // Detach from Stripe
    await stripeService.detachPaymentMethod(paymentMethod.stripePaymentMethodId);

    // Mark as inactive locally
    await paymentMethod.update({ isActive: false });

    res.json({
      success: true,
      message: 'Payment method removed successfully'
    });
  } catch (error: any) {
    logger.error('Error removing payment method:', error);
    res.status(500).json({
      error: 'Failed to remove payment method',
      details: error.message
    });
  }
};

const createTournamentPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { tournamentId, amount, currency = 'USD' } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!tournamentId || !amount) {
      res.status(400).json({ error: 'Tournament ID and amount are required' });
      return;
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
      payment: result.payment,
      clientSecret: result.clientSecret
    });
  } catch (error: any) {
    logger.error('Error creating tournament payment:', error);
    res.status(500).json({
      error: 'Failed to create tournament payment',
      details: error.message
    });
  }
};

const createBookingPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { bookingId, amount, currency = 'USD' } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!bookingId || !amount) {
      res.status(400).json({ error: 'Booking ID and amount are required' });
      return;
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
      payment: result.payment,
      clientSecret: result.clientSecret
    });
  } catch (error: any) {
    logger.error('Error creating booking payment:', error);
    res.status(500).json({
      error: 'Failed to create booking payment',
      details: error.message
    });
  }
};

const processWebhook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const body = req.body;

    if (!signature) {
      res.status(400).json({ error: 'Missing Stripe signature' });
      return;
    }

    const event = stripeService.constructWebhookEvent(body, signature);
    await subscriptionService.processWebhook(event);

    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error: any) {
    logger.error('Error processing webhook:', error);
    res.status(400).json({
      error: 'Webhook processing failed',
      details: error.message
    });
  }
};

export default {
  getPlans,
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  getPaymentDetails,
  refundPayment,
  createSubscription,
  cancelSubscription,
  createSetupIntent,
  savePaymentMethod,
  getUserPaymentMethods,
  removePaymentMethod,
  createTournamentPayment,
  createBookingPayment,
  processWebhook
};