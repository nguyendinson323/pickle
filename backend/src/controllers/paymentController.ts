import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { MembershipPlan, Payment, User, Membership, Invoice } from '../models';
import stripeService from '../services/stripeService';

export const getPlans = async (req: Request, res: Response) => {
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

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { membershipPlanId, paymentMethod = 'card' } = req.body;
    const userId = (req as any).user.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const plan = await MembershipPlan.findByPk(membershipPlanId);
    if (!plan) {
      return res.status(404).json({ error: 'Membership plan not found' });
    }

    if (plan.role !== user.role) {
      return res.status(400).json({ error: 'Plan not available for your role' });
    }

    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripeService.createCustomer({
        email: user.email,
        name: user.username
      });
      stripeCustomerId = customer.id;
      await user.update({ stripeCustomerId });
    }

    const amount = Math.round(plan.annualFee * 100);
    const taxAmount = Math.round(amount * 0.16);
    const totalAmount = amount + taxAmount;

    const paymentIntent = await stripeService.createPaymentIntent({
      amount: totalAmount,
      customerId: stripeCustomerId,
      metadata: {
        userId: userId.toString(),
        membershipPlanId: membershipPlanId.toString(),
        subtotal: amount.toString(),
        taxAmount: taxAmount.toString()
      }
    });

    const payment = await Payment.create({
      userId,
      membershipPlanId,
      paymentType: 'membership',
      stripePaymentIntentId: paymentIntent.id,
      amount: plan.annualFee,
      taxAmount: taxAmount / 100,
      totalAmount: totalAmount / 100,
      currency: 'mxn',
      status: 'pending',
      paymentMethod,
      referenceType: 'membership'
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      amount: totalAmount / 100
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const userId = (req as any).user.userId;

    const payment = await Payment.findOne({
      where: { id: paymentId, userId }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const stripePayment = await stripeService.retrievePaymentIntent(payment.stripePaymentIntentId);
    
    if (stripePayment.status === 'succeeded') {
      await payment.update({
        status: 'completed',
        stripeChargeId: stripePayment.latest_charge as string,
        paidAt: new Date()
      });

      const user = await User.findByPk(userId);
      const plan = await MembershipPlan.findByPk(payment.membershipPlanId);

      if (!plan || !user) {
        return res.status(404).json({ error: 'User or plan not found' });
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(startDate.getFullYear() + 1);

      let membership = await Membership.findOne({
        where: { userId, membershipPlanId: plan.id, status: 'active' }
      });

      if (membership) {
        await membership.update({
          endDate,
          lastPaymentId: payment.id,
          status: 'active'
        });
      } else {
        membership = await Membership.create({
          userId,
          membershipPlanId: plan.id,
          status: 'active',
          startDate,
          endDate,
          isAutoRenew: false,
          lastPaymentId: payment.id,
          renewalReminderSent: false,
          expirationReminderSent: false
        });
      }

      res.json({
        success: true,
        payment,
        membership
      });
    } else {
      await payment.update({ status: 'failed' });
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { page = 1, limit = 10, status } = req.query;
    
    const where: any = { userId };
    if (status) where.status = status;

    const payments = await Payment.findAndCountAll({
      where,
      include: [
        { model: MembershipPlan, as: 'plan' }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit)
    });

    res.json({
      payments: payments.rows,
      total: payments.count,
      pages: Math.ceil(payments.count / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const cancelPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const userId = (req as any).user.userId;

    const payment = await Payment.findOne({
      where: { id: paymentId, userId, status: 'pending' }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found or cannot be cancelled' });
    }

    if (payment.stripePaymentIntentId) {
      await stripeService.cancelPaymentIntent(payment.stripePaymentIntentId);
    }

    await payment.update({ status: 'cancelled' });

    res.json({ success: true, message: 'Payment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling payment:', error);
    res.status(500).json({ error: 'Failed to cancel payment' });
  }
};

export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;
    const userId = (req as any).user.userId;

    const payment = await Payment.findOne({
      where: { id: paymentId, status: 'completed' }
    });

    if (!payment || !payment.stripeChargeId) {
      return res.status(404).json({ error: 'Payment not found or not eligible for refund' });
    }

    const currentUser = await User.findByPk(userId);
    if (!currentUser || currentUser.role !== 'federation') {
      return res.status(403).json({ error: 'Only federation admin can process refunds' });
    }

    const refund = await stripeService.createRefund({
      chargeId: payment.stripeChargeId,
      reason: reason || 'requested_by_customer'
    });

    await payment.update({ status: 'refunded' });

    const membership = await Membership.findOne({
      where: { lastPaymentId: payment.id }
    });
    
    if (membership) {
      await membership.update({ 
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: 'Payment refunded'
      });
    }

    res.json({
      success: true,
      refund,
      payment
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
};