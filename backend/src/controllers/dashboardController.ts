import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth';
import dashboardService from '../services/dashboardService';
import { asyncHandler } from '../middleware/errorHandler';

const getDashboardData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { role, userId: authUserId } = req.user;
  const userId = parseInt(req.params.id) || authUserId;

  let dashboardData;

  if (role === 'player') dashboardData = await dashboardService.getPlayerDashboard(userId);
  else if (role === 'coach') dashboardData = await dashboardService.getCoachDashboard(userId);
  else if (role === 'club') dashboardData = await dashboardService.getClubDashboard(userId);
  else if (role === 'partner') dashboardData = await dashboardService.getPartnerDashboard(userId);
  else if (role === 'state') dashboardData = await dashboardService.getStateDashboard(userId);
  else if (role === 'federation') dashboardData = await dashboardService.getAdminDashboard(userId);
  else return res.status(400).json({ success: false, error: 'Invalid user role' });

  res.json({ success: true, data: dashboardData });
});

const getPlayerDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id) || req.user.userId;
  if (!['player','federation'].includes(req.user.role) && req.user.userId !== userId) 
    return res.status(403).json({ success: false, error: 'Access denied' });

  const data = await dashboardService.getPlayerDashboard(userId);
  res.json({ success: true, data });
});

const getCoachDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id) || req.user.userId;
  if (!['coach','federation'].includes(req.user.role) && req.user.userId !== userId) 
    return res.status(403).json({ success: false, error: 'Access denied' });

  const data = await dashboardService.getCoachDashboard(userId);
  res.json({ success: true, data });
});

const getClubDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id) || req.user.userId;
  if (!['club','federation'].includes(req.user.role) && req.user.userId !== userId) 
    return res.status(403).json({ success: false, error: 'Access denied' });

  const data = await dashboardService.getClubDashboard(userId);
  res.json({ success: true, data });
});

const getPartnerDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id) || req.user.userId;
  if (!['partner','federation'].includes(req.user.role) && req.user.userId !== userId) 
    return res.status(403).json({ success: false, error: 'Access denied' });

  const data = await dashboardService.getPartnerDashboard(userId);
  res.json({ success: true, data });
});

const getStateDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id) || req.user.userId;
  if (!['state','federation'].includes(req.user.role) && req.user.userId !== userId) 
    return res.status(403).json({ success: false, error: 'Access denied' });

  const data = await dashboardService.getStateDashboard(userId);
  res.json({ success: true, data });
});

const getAdminDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'federation') 
    return res.status(403).json({ success: false, error: 'Access denied - Federation admin required' });

  const data = await dashboardService.getAdminDashboard(req.user.userId);
  res.json({ success: true, data });
});

export {
  getDashboardData,
  getPlayerDashboard,
  getCoachDashboard,
  getClubDashboard,
  getPartnerDashboard,
  getStateDashboard,
  getAdminDashboard
};
