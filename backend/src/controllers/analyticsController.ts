import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';

const getCourtDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Fechas de inicio y fin son requeridas'
      });
      return;
    }

    const dashboard = await AnalyticsService.getCourtPerformanceDashboard(
      parseInt(courtId),
      { startDate: startDate as string, endDate: endDate as string }
    );

    res.json({ success: true, data: dashboard });
  } catch (error: any) {
    console.error('Error fetching court dashboard:', error);
    res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
  }
};

const getCourtRevenue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId } = req.params;
    const { startDate, endDate, previousStartDate, previousEndDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Fechas de inicio y fin son requeridas'
      });
      return;
    }

    const dateRange = { startDate: startDate as string, endDate: endDate as string };
    const previousPeriod = previousStartDate && previousEndDate 
      ? { startDate: previousStartDate as string, endDate: previousEndDate as string }
      : undefined;

    const metrics = await AnalyticsService.getCourtRevenueMetrics(
      parseInt(courtId),
      dateRange,
      previousPeriod
    );

    res.json({ success: true, data: metrics });
  } catch (error: any) {
    console.error('Error fetching court revenue:', error);
    res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
  }
};

const getCourtUsage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Fechas de inicio y fin son requeridas'
      });
      return;
    }

    const metrics = await AnalyticsService.getCourtUsageMetrics(
      parseInt(courtId),
      { startDate: startDate as string, endDate: endDate as string }
    );

    res.json({ success: true, data: metrics });
  } catch (error: any) {
    console.error('Error fetching court usage:', error);
    res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
  }
};

const getCustomerMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId } = req.params;
    const { startDate, endDate, previousStartDate, previousEndDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Fechas de inicio y fin son requeridas'
      });
      return;
    }

    const dateRange = { startDate: startDate as string, endDate: endDate as string };
    const previousPeriod = previousStartDate && previousEndDate 
      ? { startDate: previousStartDate as string, endDate: previousEndDate as string }
      : undefined;

    const metrics = await AnalyticsService.getCustomerMetrics(
      parseInt(courtId),
      dateRange,
      previousPeriod
    );

    res.json({ success: true, data: metrics });
  } catch (error: any) {
    console.error('Error fetching customer metrics:', error);
    res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
  }
};

const getRevenueBreakdown = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId } = req.params;
    const { startDate, endDate, groupBy = 'day' } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Fechas de inicio y fin son requeridas'
      });
      return;
    }

    if (!['day', 'week', 'month'].includes(groupBy as string)) {
      res.status(400).json({
        success: false,
        message: 'groupBy debe ser day, week o month'
      });
      return;
    }

    const breakdown = await AnalyticsService.getRevenueBreakdown(
      parseInt(courtId),
      { startDate: startDate as string, endDate: endDate as string },
      groupBy as 'day' | 'week' | 'month'
    );

    res.json({ success: true, data: breakdown });
  } catch (error: any) {
    console.error('Error fetching revenue breakdown:', error);
    res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
  }
};

const getPopularityRanking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ownerType, ownerId, stateId, startDate, endDate } = req.query;

    let dateRange = undefined;
    if (startDate && endDate) {
      dateRange = { startDate: startDate as string, endDate: endDate as string };
    }

    const ranking = await AnalyticsService.getCourtPopularityRanking(
      ownerType as 'club' | 'partner' | undefined,
      ownerId ? parseInt(ownerId as string) : undefined,
      stateId ? parseInt(stateId as string) : undefined,
      dateRange
    );

    res.json({ success: true, data: ranking });
  } catch (error: any) {
    console.error('Error fetching popularity ranking:', error);
    res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
  }
};

const getOwnerAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ownerType, ownerId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Fechas de inicio y fin son requeridas'
      });
      return;
    }

    if (!['club', 'partner'].includes(ownerType)) {
      res.status(400).json({
        success: false,
        message: 'ownerType debe ser club o partner'
      });
      return;
    }

    const analytics = await AnalyticsService.getOwnerAnalytics(
      ownerType as 'club' | 'partner',
      parseInt(ownerId),
      { startDate: startDate as string, endDate: endDate as string }
    );

    res.json({ success: true, data: analytics });
  } catch (error: any) {
    console.error('Error fetching owner analytics:', error);
    res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
  }
};

const getCourtComparison = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtIds, startDate, endDate } = req.query;

    if (!courtIds) {
      res.status(400).json({
        success: false,
        message: 'Lista de IDs de canchas es requerida'
      });
      return;
    }

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Fechas de inicio y fin son requeridas'
      });
      return;
    }

    const courtIdList = (courtIds as string).split(',').map(id => parseInt(id.trim()));
    const dateRange = { startDate: startDate as string, endDate: endDate as string };

    const comparisons = await Promise.all(
      courtIdList.map(async (courtId) => {
        const [revenue, usage, customers] = await Promise.all([
          AnalyticsService.getCourtRevenueMetrics(courtId, dateRange),
          AnalyticsService.getCourtUsageMetrics(courtId, dateRange),
          AnalyticsService.getCustomerMetrics(courtId, dateRange)
        ]);

        return { courtId, revenue, usage, customers };
      })
    );

    res.json({ success: true, data: comparisons });
  } catch (error: any) {
    console.error('Error fetching court comparison:', error);
    res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
  }
};

const getFederationAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stateId, startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Fechas de inicio y fin son requeridas'
      });
      return;
    }

    const dateRange = { startDate: startDate as string, endDate: endDate as string };

    const ranking = await AnalyticsService.getCourtPopularityRanking(
      undefined,
      undefined,
      stateId ? parseInt(stateId as string) : undefined,
      dateRange
    );

    const totalCourts = ranking.length;
    const totalReservations = ranking.reduce((sum, item) => sum + item.metrics.reservationCount, 0);
    const totalReviews = ranking.reduce((sum, item) => sum + item.metrics.totalReviews, 0);

    const averageRating = ranking.length > 0
      ? ranking.reduce((sum, item) => sum + (item.metrics.averageRating * item.metrics.totalReviews), 0) / totalReviews || 0
      : 0;

    const averageUtilization = ranking.length > 0
      ? ranking.reduce((sum, item) => sum + item.metrics.utilizationRate, 0) / ranking.length
      : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalCourts,
          totalReservations,
          totalReviews,
          averageRating: Number(averageRating.toFixed(1)),
          averageUtilization: Number(averageUtilization.toFixed(2))
        },
        topCourts: ranking.slice(0, 10),
        allCourts: ranking
      }
    });
  } catch (error: any) {
    console.error('Error fetching federation analytics:', error);
    res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
  }
};

export default {
  getCourtDashboard,
  getCourtRevenue,
  getCourtUsage,
  getCustomerMetrics,
  getRevenueBreakdown,
  getPopularityRanking,
  getOwnerAnalytics,
  getCourtComparison,
  getFederationAnalytics
};
