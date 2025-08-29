import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth';
import dashboardService from '../services/dashboardService';
import { asyncHandler } from '../middleware/errorHandler';

export const getDashboardData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { role } = req.user;
  const userId = parseInt(req.params.id) || req.user.userId;

  let dashboardData;

  switch (role) {
    case 'player':
      dashboardData = await dashboardService.getPlayerDashboard(userId);
      break;
    case 'coach':
      dashboardData = await dashboardService.getCoachDashboard(userId);
      break;
    case 'club':
      dashboardData = await dashboardService.getClubDashboard(userId);
      break;
    case 'partner':
      dashboardData = await dashboardService.getPartnerDashboard(userId);
      break;
    case 'state':
      dashboardData = await dashboardService.getStateDashboard(userId);
      break;
    case 'federation':
      dashboardData = await dashboardService.getAdminDashboard(userId);
      break;
    default:
      return res.status(400).json({
        success: false,
        error: 'Invalid user role'
      });
  }

  res.json({
    success: true,
    data: dashboardData
  });
});

export const getPlayerDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  
  if (req.user.role !== 'player' && req.user.role !== 'federation' && req.user.userId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    });
  }

  const dashboardData = await dashboardService.getPlayerDashboard(userId);

  res.json({
    success: true,
    data: dashboardData
  });
});

export const getCoachDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  
  if (req.user.role !== 'coach' && req.user.role !== 'federation' && req.user.userId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    });
  }

  const dashboardData = await dashboardService.getCoachDashboard(userId);

  res.json({
    success: true,
    data: dashboardData
  });
});

export const getClubDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  
  if (req.user.role !== 'club' && req.user.role !== 'federation' && req.user.userId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    });
  }

  const dashboardData = await dashboardService.getClubDashboard(userId);

  res.json({
    success: true,
    data: dashboardData
  });
});

export const getPartnerDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  
  if (req.user.role !== 'partner' && req.user.role !== 'federation' && req.user.userId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    });
  }

  const dashboardData = await dashboardService.getPartnerDashboard(userId);

  res.json({
    success: true,
    data: dashboardData
  });
});

export const getStateDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  
  if (req.user.role !== 'state' && req.user.role !== 'federation' && req.user.userId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    });
  }

  const dashboardData = await dashboardService.getStateDashboard(userId);

  res.json({
    success: true,
    data: dashboardData
  });
});

export const getAdminDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'federation') {
    return res.status(403).json({
      success: false,
      error: 'Access denied - Federation admin required'
    });
  }

  const dashboardData = await dashboardService.getAdminDashboard(req.user.userId);

  res.json({
    success: true,
    data: dashboardData
  });
});