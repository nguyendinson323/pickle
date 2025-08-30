import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { MembershipPlan, Payment, User, Membership } from '../models';
import stripeService from '../services/stripeService';
import { UserRole } from '../types/auth';

interface AuthRequest extends Request {
  user?: {
    userId: number;
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

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
      status: 'completed',
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

    if (payment.status !== 'completed') {
      res.status(400).json({ error: 'Can only refund completed payments' });
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
    const { planId } = req.body;
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

    const plan = await MembershipPlan.findByPk(planId);
    if (!plan) {
      res.status(404).json({ error: 'Plan not found' });
      return;
    }

    // Create or get Stripe customer
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

    // Create subscription
    const subscription = await stripeService.createSubscription(
      stripeCustomerId,
      plan.stripePriceId || '',
      {
        metadata: {
          userId: userId.toString(),
          planId: planId.toString()
        }
      }
    ) as any;

    // Create membership record
    const membership = await Membership.create({
      userId,
      membershipPlanId: planId,
      status: 'active',
      stripeSubscriptionId: subscription.id,
      startDate: new Date((subscription.current_period_start || Date.now() / 1000) * 1000),
      endDate: new Date((subscription.current_period_end || Date.now() / 1000 + 86400 * 365) * 1000)
    } as any);

    await User.update(
      { 
        membershipPlanId: planId,
        stripeCustomerId 
      } as any,
      { where: { id: userId } }
    );

    res.json({
      success: true,
      subscription,
      membership
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ 
      error: 'Failed to create subscription',
      details: error.message 
    });
  }
};

const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const membership = await Membership.findOne({
      where: { userId, status: 'active' }
    });

    if (!membership) {
      res.status(404).json({ error: 'No active membership found' });
      return;
    }

    if (!membership.stripeSubscriptionId) {
      res.status(400).json({ error: 'No subscription to cancel' });
      return;
    }

    // Cancel subscription with Stripe
    const cancelledSubscription = await stripeService.cancelSubscription(
      membership.stripeSubscriptionId
    ) as any;

    // Update membership
    await membership.update({
      status: 'cancelled',
      cancelledAt: new Date(),
      endDate: new Date((cancelledSubscription.current_period_end || Date.now() / 1000) * 1000)
    });

    await User.update(
      { } as any,
      { where: { id: userId } }
    );

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      endsAt: membership.endDate
    });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      error: 'Failed to cancel subscription',
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
  cancelSubscription
};