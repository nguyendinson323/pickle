import { Request, Response } from 'express';
import { AdminDashboardService } from '../services/adminDashboardService';
import { AdminLog } from '../models/AdminLog';

const adminDashboardService = new AdminDashboardService();

const logAdminAction = async (
  adminId: number,
  action: string,
  category: 'user_management' | 'content_moderation' | 'system_config' | 'financial' | 'tournament' | 'communication',
  description: string,
  req: Request,
  targetId?: number,
  targetType?: string,
  previousData?: any,
  newData?: any,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) => {
  try {
    await AdminLog.create({
      adminId,
      action,
      category,
      description,
      targetId,
      targetType,
      previousData,
      newData,
      ipAddress: req.ip || req.connection.remoteAddress || '0.0.0.0',
      userAgent: req.get('User-Agent') || 'Unknown',
      sessionId: req.session?.id,
      severity,
      status: 'success'
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

export const getDashboardOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const overview = await adminDashboardService.getDashboardOverview(adminId);
    res.json(overview);
  } catch (error: any) {
    console.error('Error getting dashboard overview:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al obtener vista general del panel'
    });
  }
};

export const getUserManagement = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { page = 1, limit = 20, role, status, search } = req.query;
    const userManagement = await adminDashboardService.getUserManagement(
      adminId,
      {
        page: Number(page),
        limit: Number(limit),
        role: role as string,
        status: status as string,
        search: search as string
      }
    );

    res.json(userManagement);
  } catch (error: any) {
    console.error('Error getting user management:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al obtener gestión de usuarios'
    });
  }
};

export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { userId } = req.params;
    const { status, reason } = req.body;

    const result = await adminDashboardService.updateUserStatus(
      adminId,
      Number(userId),
      status,
      reason
    );

    await logAdminAction(
      adminId,
      'update_user_status',
      'user_management',
      `Actualizado estado del usuario ${userId} a ${status}`,
      req,
      Number(userId),
      'user',
      { status: result.previousStatus },
      { status, reason },
      'high'
    );

    res.json(result);
  } catch (error: any) {
    console.error('Error updating user status:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al actualizar estado del usuario'
    });
  }
};

export const getContentModeration = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { page = 1, limit = 20, status, severity, contentType } = req.query;
    const moderation = await adminDashboardService.getContentModeration(
      adminId,
      {
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        severity: severity as string,
        contentType: contentType as string
      }
    );

    res.json(moderation);
  } catch (error: any) {
    console.error('Error getting content moderation:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al obtener moderación de contenido'
    });
  }
};

export const moderateContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { contentId } = req.params;
    const { action, reason } = req.body;

    const result = await adminDashboardService.moderateContent(
      adminId,
      Number(contentId),
      action,
      reason
    );

    await logAdminAction(
      adminId,
      'moderate_content',
      'content_moderation',
      `Moderado contenido ${contentId}: ${action}`,
      req,
      Number(contentId),
      'content',
      { status: result.previousStatus },
      { status: action, reason },
      action === 'rejected' ? 'high' : 'medium'
    );

    res.json(result);
  } catch (error: any) {
    console.error('Error moderating content:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al moderar contenido'
    });
  }
};

export const getSystemAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { page = 1, limit = 20, severity, status, type } = req.query;
    const alerts = await adminDashboardService.getSystemAlerts(
      adminId,
      {
        page: Number(page),
        limit: Number(limit),
        severity: severity as string,
        status: status as string,
        type: type as string
      }
    );

    res.json(alerts);
  } catch (error: any) {
    console.error('Error getting system alerts:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al obtener alertas del sistema'
    });
  }
};

export const updateSystemAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { alertId } = req.params;
    const { status, notes } = req.body;

    const result = await adminDashboardService.updateSystemAlert(
      adminId,
      Number(alertId),
      status,
      notes
    );

    await logAdminAction(
      adminId,
      'update_system_alert',
      'system_config',
      `Actualizada alerta del sistema ${alertId} a ${status}`,
      req,
      Number(alertId),
      'system_alert',
      { status: result.previousStatus },
      { status, notes },
      'medium'
    );

    res.json(result);
  } catch (error: any) {
    console.error('Error updating system alert:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al actualizar alerta del sistema'
    });
  }
};

export const getFinancialOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { startDate, endDate } = req.query;
    const financial = await adminDashboardService.getFinancialOverview(
      adminId,
      startDate as string,
      endDate as string
    );

    res.json(financial);
  } catch (error: any) {
    console.error('Error getting financial overview:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al obtener vista financiera'
    });
  }
};

export const broadcastAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { title, message, targetAudience, priority, scheduledFor } = req.body;

    const result = await adminDashboardService.broadcastAnnouncement(
      adminId,
      {
        title,
        message,
        targetAudience,
        priority: priority || 'medium',
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
      }
    );

    await logAdminAction(
      adminId,
      'broadcast_announcement',
      'communication',
      `Enviado anuncio: "${title}" a ${targetAudience}`,
      req,
      undefined,
      'announcement',
      undefined,
      { title, targetAudience, priority },
      priority === 'high' ? 'high' : 'medium'
    );

    res.json(result);
  } catch (error: any) {
    console.error('Error broadcasting announcement:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al enviar anuncio'
    });
  }
};

export const getAdminLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { 
      page = 1, 
      limit = 50, 
      category, 
      severity, 
      startDate, 
      endDate,
      adminUserId 
    } = req.query;

    const logs = await adminDashboardService.getAdminLogs(
      adminId,
      {
        page: Number(page),
        limit: Number(limit),
        category: category as string,
        severity: severity as string,
        startDate: startDate as string,
        endDate: endDate as string,
        adminUserId: adminUserId ? Number(adminUserId) : undefined
      }
    );

    res.json(logs);
  } catch (error: any) {
    console.error('Error getting admin logs:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al obtener registros de administración'
    });
  }
};

export const generateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { reportType, startDate, endDate, format = 'json', filters } = req.body;

    const report = await adminDashboardService.generateReport(
      adminId,
      {
        reportType,
        startDate,
        endDate,
        format,
        filters
      }
    );

    await logAdminAction(
      adminId,
      'generate_report',
      'system_config',
      `Generado reporte ${reportType} (${format})`,
      req,
      undefined,
      'report',
      undefined,
      { reportType, format, startDate, endDate },
      'low'
    );

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType}-${Date.now()}.csv"`);
    } else {
      res.setHeader('Content-Type', 'application/json');
    }

    res.send(report);
  } catch (error: any) {
    console.error('Error generating report:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al generar reporte'
    });
  }
};

export const getPlatformStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { startDate, endDate, granularity = 'daily' } = req.query;

    const stats = await adminDashboardService.getPlatformStatistics(
      adminId,
      {
        startDate: startDate as string,
        endDate: endDate as string,
        granularity: granularity as 'daily' | 'weekly' | 'monthly'
      }
    );

    res.json(stats);
  } catch (error: any) {
    console.error('Error getting platform statistics:', error);
    res.status(error.message.includes('Insufficient permissions') ? 403 : 500).json({
      error: error.message || 'Error al obtener estadísticas de la plataforma'
    });
  }
};