import { Request, Response } from 'express';
import { Op, fn, col } from 'sequelize';
import { Membership, MembershipPlan, User, Payment } from '../models';
import { createNotification } from '../services/notificationService';

const getMembership = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const membership = await Membership.findOne({
      where: { userId, status: { [Op.in]: ['active', 'pending'] } },
      include: [
        { model: MembershipPlan, as: 'plan' },
        { model: Payment, as: 'payments', limit: 5, order: [['createdAt', 'DESC']] }
      ],
      order: [['endDate', 'DESC']]
    });

    if (!membership) return res.json({ membership: null });

    const isExpired = membership.endDate < new Date();
    if (isExpired && membership.status === 'active') {
      await membership.update({ status: 'expired' });
      membership.status = 'expired';
    }

    res.json({ membership });
  } catch (error: any) {
    console.error('Error fetching membership:', error);
    res.status(500).json({ error: 'Failed to fetch membership' });
  }
};

const getMembershipHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { page = 1, limit = 10 } = req.query;

    const memberships = await Membership.findAndCountAll({
      where: { userId },
      include: [
        { model: MembershipPlan, as: 'plan' },
        { model: Payment, as: 'payments' }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit)
    });

    res.json({
      memberships: memberships.rows,
      total: memberships.count,
      pages: Math.ceil(memberships.count / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error: any) {
    console.error('Error fetching membership history:', error);
    res.status(500).json({ error: 'Failed to fetch membership history' });
  }
};

const upgradeMembership = async (req: Request, res: Response) => {
  try {
    const { membershipPlanId } = req.body;
    const userId = (req as any).user.userId;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const currentMembership = await Membership.findOne({ where: { userId, status: 'active' }, include: [{ model: MembershipPlan, as: 'plan' }] });
    const newPlan = await MembershipPlan.findByPk(membershipPlanId);
    if (!newPlan) return res.status(404).json({ error: 'Membership plan not found' });
    if (newPlan.role !== user.role) return res.status(400).json({ error: 'Plan not available for your role' });

    if (currentMembership) {
      const currentPlan = currentMembership.get('plan') as any;
      if (currentPlan.annualFee >= newPlan.annualFee) return res.status(400).json({ error: 'Can only upgrade to a higher tier plan' });

      const remainingDays = Math.ceil((currentMembership.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      const dailyCurrentRate = currentPlan.annualFee / 365;
      const dailyNewRate = newPlan.annualFee / 365;
      const prorationAmount = (dailyNewRate - dailyCurrentRate) * remainingDays;

      return res.json({ upgrade: true, currentMembership, newPlan, prorationAmount: Math.max(0, prorationAmount), remainingDays });
    }

    res.json({ upgrade: false, newPlan, message: 'No active membership found. This will be a new subscription.' });
  } catch (error: any) {
    console.error('Error processing upgrade request:', error);
    res.status(500).json({ error: 'Failed to process upgrade request' });
  }
};

const cancelMembership = async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const userId = (req as any).user.userId;
    const membership = await Membership.findOne({ where: { userId, status: { [Op.in]: ['active', 'pending'] } }, include: [{ model: MembershipPlan, as: 'plan' }] });
    if (!membership) return res.status(404).json({ error: 'No active membership found' });

    await membership.update({ status: 'cancelled', cancelledAt: new Date(), cancelReason: reason || 'User requested cancellation' });

    await createNotification({
      userId,
      type: 'membership_cancelled',
      title: 'Membresía Cancelada',
      message: `Tu membresía ${(membership.get('plan') as any).name} ha sido cancelada.`,
      metadata: { membershipId: membership.id, planName: (membership.get('plan') as any).name, cancelReason: reason }
    });

    res.json({ success: true, message: 'Membership cancelled successfully', membership });
  } catch (error: any) {
    console.error('Error cancelling membership:', error);
    res.status(500).json({ error: 'Failed to cancel membership' });
  }
};

const checkMembershipStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const membership = await Membership.findOne({ where: { userId }, include: [{ model: MembershipPlan, as: 'plan' }], order: [['endDate', 'DESC']] });

    if (!membership) {
      return res.json({ hasActiveMembership: false, membershipType: 'none', features: { basicAccess: true, premiumFeatures: false, advancedFeatures: false } });
    }

    const isExpired = membership.endDate < new Date();
    const isActive = membership.status === 'active' && !isExpired;
    if (isExpired && membership.status === 'active') await membership.update({ status: 'expired' });

    const plan = membership.get('plan') as any;
    const isPremium = plan.name.toLowerCase().includes('premium');

    res.json({
      hasActiveMembership: isActive,
      membershipType: isActive ? (isPremium ? 'premium' : 'basic') : 'expired',
      membership,
      features: {
        basicAccess: true,
        premiumFeatures: isActive && isPremium,
        advancedFeatures: isActive && isPremium,
        courtReservation: isActive,
        tournaments: isActive,
        messaging: isActive,
        playerFinder: isActive && isPremium,
        analytics: isActive && isPremium,
        prioritySupport: isActive && isPremium
      },
      expiresIn: isActive ? Math.ceil((membership.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
    });
  } catch (error: any) {
    console.error('Error checking membership status:', error);
    res.status(500).json({ error: 'Failed to check membership status' });
  }
};

const renewMembership = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const membership = await Membership.findOne({ where: { userId, status: { [Op.in]: ['active', 'expired'] } }, include: [{ model: MembershipPlan, as: 'plan' }], order: [['endDate', 'DESC']] });
    if (!membership) return res.status(404).json({ error: 'No membership found to renew' });

    const plan = membership.get('plan') as any;
    res.json({ membership, plan, renewalPrice: plan.annualFee, message: 'Ready for renewal. Proceed with payment to activate.' });
  } catch (error: any) {
    console.error('Error processing renewal request:', error);
    res.status(500).json({ error: 'Failed to process renewal request' });
  }
};

const getMembershipStats = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (user.role !== 'federation') return res.status(403).json({ error: 'Access denied. Federation admin only.' });

    const totalMemberships = await Membership.count();
    const activeMemberships = await Membership.count({ where: { status: 'active' } });
    const expiredMemberships = await Membership.count({ where: { status: 'expired' } });
    const cancelledMemberships = await Membership.count({ where: { status: 'cancelled' } });

    const membershipsByPlan = await MembershipPlan.findAll({
      include: [{ model: Membership, as: 'memberships', attributes: [] }],
      attributes: ['id','name','role','price',[fn('COUNT', col('memberships.id')), 'memberCount']],
      group: ['MembershipPlan.id']
    });

    const recentMemberships = await Membership.findAll({
      include: [
        { model: User, as: 'user', attributes: ['username','email','role'] },
        { model: MembershipPlan, as: 'plan', attributes: ['name','price'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      stats: { total: totalMemberships, active: activeMemberships, expired: expiredMemberships, cancelled: cancelledMemberships },
      membershipsByPlan,
      recentMemberships
    });
  } catch (error: any) {
    console.error('Error fetching membership stats:', error);
    res.status(500).json({ error: 'Failed to fetch membership statistics' });
  }
};

export {
  getMembership,
  getMembershipHistory,
  upgradeMembership,
  cancelMembership,
  checkMembershipStatus,
  renewMembership,
  getMembershipStats
};
