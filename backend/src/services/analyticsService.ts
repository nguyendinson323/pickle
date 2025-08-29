import { Op, QueryTypes } from 'sequelize';
import sequelize from '../config/database';
import Reservation from '../models/Reservation';
import Court from '../models/Court';
import Payment from '../models/Payment';
import CourtReview from '../models/CourtReview';
import User from '../models/User';

interface RevenueMetrics {
  totalRevenue: number;
  reservationCount: number;
  averageReservationValue: number;
  growth: {
    revenueGrowth: number;
    reservationGrowth: number;
  };
}

interface CourtUsageMetrics {
  totalHours: number;
  utilizationRate: number;
  peakHoursUsage: number;
  averageSessionDuration: number;
}

interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageCustomerValue: number;
  customerRetentionRate: number;
}

interface PopularityMetrics {
  reservationCount: number;
  averageRating: number;
  totalReviews: number;
  utilizationRate: number;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

export class AnalyticsService {

  static async getCourtRevenueMetrics(
    courtId: number,
    dateRange: DateRange,
    previousPeriod?: DateRange
  ): Promise<RevenueMetrics> {
    try {
      // Current period metrics
      const currentReservations = await Reservation.findAll({
        where: {
          courtId,
          reservationDate: {
            [Op.between]: [dateRange.startDate, dateRange.endDate]
          },
          status: {
            [Op.in]: ['confirmed', 'completed', 'checked_in']
          }
        }
      });

      const totalRevenue = currentReservations.reduce((sum, r) => sum + r.totalAmount, 0);
      const reservationCount = currentReservations.length;
      const averageReservationValue = reservationCount > 0 ? totalRevenue / reservationCount : 0;

      let growth = { revenueGrowth: 0, reservationGrowth: 0 };

      // Calculate growth if previous period is provided
      if (previousPeriod) {
        const previousReservations = await Reservation.findAll({
          where: {
            courtId,
            reservationDate: {
              [Op.between]: [previousPeriod.startDate, previousPeriod.endDate]
            },
            status: {
              [Op.in]: ['confirmed', 'completed', 'checked_in']
            }
          }
        });

        const previousRevenue = previousReservations.reduce((sum, r) => sum + r.totalAmount, 0);
        const previousCount = previousReservations.length;

        growth.revenueGrowth = previousRevenue > 0 
          ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
          : 0;
        
        growth.reservationGrowth = previousCount > 0 
          ? ((reservationCount - previousCount) / previousCount) * 100 
          : 0;
      }

      return {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        reservationCount,
        averageReservationValue: Number(averageReservationValue.toFixed(2)),
        growth
      };
    } catch (error: any) {
      throw new Error(`Error calculating revenue metrics: ${error.message}`);
    }
  }

  static async getCourtUsageMetrics(
    courtId: number,
    dateRange: DateRange
  ): Promise<CourtUsageMetrics> {
    try {
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw new Error('Court not found');
      }

      const reservations = await Reservation.findAll({
        where: {
          courtId,
          reservationDate: {
            [Op.between]: [dateRange.startDate, dateRange.endDate]
          },
          status: {
            [Op.in]: ['confirmed', 'completed', 'checked_in']
          }
        }
      });

      // Calculate total hours used
      const totalHours = reservations.reduce((sum, r) => sum + (r.duration / 60), 0);

      // Calculate average session duration
      const averageSessionDuration = reservations.length > 0 
        ? reservations.reduce((sum, r) => sum + r.duration, 0) / reservations.length 
        : 0;

      // Calculate peak hours usage (6-8 AM, 6-10 PM)
      const peakHoursReservations = reservations.filter(r => {
        const hour = parseInt(r.startTime.split(':')[0]);
        return (hour >= 6 && hour < 8) || (hour >= 18 && hour < 22);
      });
      const peakHoursUsage = peakHoursReservations.length;

      // Calculate utilization rate
      // Assuming court is open 14 hours/day (6 AM - 10 PM)
      const daysInRange = this.calculateDaysInRange(dateRange.startDate, dateRange.endDate);
      const totalAvailableHours = daysInRange * 14; // 14 hours per day
      const utilizationRate = totalAvailableHours > 0 
        ? (totalHours / totalAvailableHours) * 100 
        : 0;

      return {
        totalHours: Number(totalHours.toFixed(2)),
        utilizationRate: Number(utilizationRate.toFixed(2)),
        peakHoursUsage,
        averageSessionDuration: Number(averageSessionDuration.toFixed(2))
      };
    } catch (error: any) {
      throw new Error(`Error calculating usage metrics: ${error.message}`);
    }
  }

  static async getCustomerMetrics(
    courtId: number,
    dateRange: DateRange,
    previousPeriod?: DateRange
  ): Promise<CustomerMetrics> {
    try {
      // Get current period customers
      const currentCustomers = await sequelize.query(`
        SELECT DISTINCT user_id, MIN(reservation_date) as first_reservation
        FROM reservations 
        WHERE court_id = :courtId 
        AND reservation_date BETWEEN :startDate AND :endDate
        AND status IN ('confirmed', 'completed', 'checked_in')
      `, {
        replacements: { 
          courtId, 
          startDate: dateRange.startDate, 
          endDate: dateRange.endDate 
        },
        type: QueryTypes.SELECT
      }) as any[];

      const totalCustomers = currentCustomers.length;

      // Calculate customer lifetime value
      const customerValues = await sequelize.query(`
        SELECT user_id, SUM(total_amount) as total_spent
        FROM reservations 
        WHERE court_id = :courtId 
        AND reservation_date BETWEEN :startDate AND :endDate
        AND status IN ('confirmed', 'completed', 'checked_in')
        GROUP BY user_id
      `, {
        replacements: { 
          courtId, 
          startDate: dateRange.startDate, 
          endDate: dateRange.endDate 
        },
        type: QueryTypes.SELECT
      }) as any[];

      const averageCustomerValue = customerValues.length > 0
        ? customerValues.reduce((sum, c) => sum + parseFloat(c.total_spent), 0) / customerValues.length
        : 0;

      // Find new customers (first reservation in this period)
      const newCustomers = currentCustomers.filter(c => 
        c.first_reservation >= dateRange.startDate && c.first_reservation <= dateRange.endDate
      ).length;

      const returningCustomers = totalCustomers - newCustomers;

      let customerRetentionRate = 0;

      // Calculate retention rate if previous period is provided
      if (previousPeriod) {
        const previousCustomers = await sequelize.query(`
          SELECT DISTINCT user_id
          FROM reservations 
          WHERE court_id = :courtId 
          AND reservation_date BETWEEN :startDate AND :endDate
          AND status IN ('confirmed', 'completed', 'checked_in')
        `, {
          replacements: { 
            courtId, 
            startDate: previousPeriod.startDate, 
            endDate: previousPeriod.endDate 
          },
          type: QueryTypes.SELECT
        }) as any[];

        const previousCustomerIds = previousCustomers.map(c => c.user_id);
        const currentCustomerIds = currentCustomers.map(c => c.user_id);
        
        const retainedCustomers = previousCustomerIds.filter(id => 
          currentCustomerIds.includes(id)
        ).length;

        customerRetentionRate = previousCustomerIds.length > 0 
          ? (retainedCustomers / previousCustomerIds.length) * 100 
          : 0;
      }

      return {
        totalCustomers,
        newCustomers,
        returningCustomers,
        averageCustomerValue: Number(averageCustomerValue.toFixed(2)),
        customerRetentionRate: Number(customerRetentionRate.toFixed(2))
      };
    } catch (error: any) {
      throw new Error(`Error calculating customer metrics: ${error.message}`);
    }
  }

  static async getCourtPopularityRanking(
    ownerType?: 'club' | 'partner',
    ownerId?: number,
    stateId?: number,
    dateRange?: DateRange
  ): Promise<Array<{ court: Court; metrics: PopularityMetrics }>> {
    try {
      let whereClause: any = { isActive: true };

      if (ownerType && ownerId) {
        whereClause.ownerType = ownerType;
        whereClause.ownerId = ownerId;
      }

      if (stateId) {
        whereClause.stateId = stateId;
      }

      const courts = await Court.findAll({
        where: whereClause,
        order: [['name', 'ASC']]
      });

      const courtsWithMetrics = await Promise.all(
        courts.map(async (court) => {
          let reservationWhere: any = { courtId: court.id };
          
          if (dateRange) {
            reservationWhere.reservationDate = {
              [Op.between]: [dateRange.startDate, dateRange.endDate]
            };
          }

          // Get reservations
          const reservations = await Reservation.findAll({
            where: reservationWhere
          });

          const reservationCount = reservations.length;

          // Get reviews and calculate average rating
          const reviews = await CourtReview.findAll({
            where: { courtId: court.id }
          });

          const averageRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length
            : 0;

          // Calculate utilization rate
          const confirmedReservations = reservations.filter(r => 
            ['confirmed', 'completed', 'checked_in'].includes(r.status)
          );
          
          const totalHours = confirmedReservations.reduce((sum, r) => sum + (r.duration / 60), 0);
          
          let utilizationRate = 0;
          if (dateRange) {
            const daysInRange = this.calculateDaysInRange(dateRange.startDate, dateRange.endDate);
            const totalAvailableHours = daysInRange * 14; // Assuming 14 hours/day
            utilizationRate = totalAvailableHours > 0 ? (totalHours / totalAvailableHours) * 100 : 0;
          }

          const metrics: PopularityMetrics = {
            reservationCount,
            averageRating: Number(averageRating.toFixed(1)),
            totalReviews: reviews.length,
            utilizationRate: Number(utilizationRate.toFixed(2))
          };

          return { court, metrics };
        })
      );

      // Sort by popularity score (combination of reservations, rating, and utilization)
      return courtsWithMetrics.sort((a, b) => {
        const scoreA = (a.metrics.reservationCount * 0.4) + 
                      (a.metrics.averageRating * 10 * 0.3) + 
                      (a.metrics.utilizationRate * 0.3);
        
        const scoreB = (b.metrics.reservationCount * 0.4) + 
                      (b.metrics.averageRating * 10 * 0.3) + 
                      (b.metrics.utilizationRate * 0.3);
        
        return scoreB - scoreA;
      });
    } catch (error: any) {
      throw new Error(`Error calculating popularity ranking: ${error.message}`);
    }
  }

  static async getRevenueBreakdown(
    courtId: number,
    dateRange: DateRange,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<Array<{ period: string; revenue: number; reservations: number }>> {
    try {
      let groupFormat: string;
      let dateFormat: string;

      switch (groupBy) {
        case 'week':
          groupFormat = 'YYYY-"W"IW';
          dateFormat = 'YYYY-"W"IW';
          break;
        case 'month':
          groupFormat = 'YYYY-MM';
          dateFormat = 'YYYY-MM';
          break;
        default: // day
          groupFormat = 'YYYY-MM-DD';
          dateFormat = 'YYYY-MM-DD';
      }

      const results = await sequelize.query(`
        SELECT 
          TO_CHAR(reservation_date, :dateFormat) as period,
          SUM(total_amount) as revenue,
          COUNT(*) as reservations
        FROM reservations 
        WHERE court_id = :courtId 
        AND reservation_date BETWEEN :startDate AND :endDate
        AND status IN ('confirmed', 'completed', 'checked_in')
        GROUP BY TO_CHAR(reservation_date, :groupFormat)
        ORDER BY period
      `, {
        replacements: { 
          courtId, 
          startDate: dateRange.startDate, 
          endDate: dateRange.endDate,
          dateFormat,
          groupFormat
        },
        type: QueryTypes.SELECT
      }) as any[];

      return results.map(r => ({
        period: r.period,
        revenue: Number(parseFloat(r.revenue).toFixed(2)),
        reservations: parseInt(r.reservations)
      }));
    } catch (error: any) {
      throw new Error(`Error calculating revenue breakdown: ${error.message}`);
    }
  }

  static async getCourtPerformanceDashboard(
    courtId: number,
    dateRange: DateRange
  ): Promise<{
    revenue: RevenueMetrics;
    usage: CourtUsageMetrics;
    customers: CustomerMetrics;
    recentReviews: CourtReview[];
    upcomingReservations: Reservation[];
  }> {
    try {
      const [revenue, usage, customers, recentReviews, upcomingReservations] = await Promise.all([
        this.getCourtRevenueMetrics(courtId, dateRange),
        this.getCourtUsageMetrics(courtId, dateRange),
        this.getCustomerMetrics(courtId, dateRange),
        CourtReview.findAll({
          where: { courtId },
          include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
          order: [['createdAt', 'DESC']],
          limit: 5
        }),
        Reservation.findAll({
          where: {
            courtId,
            reservationDate: { [Op.gte]: new Date() },
            status: { [Op.in]: ['pending', 'confirmed'] }
          },
          include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
          order: [['reservationDate', 'ASC'], ['startTime', 'ASC']],
          limit: 10
        })
      ]);

      return {
        revenue,
        usage,
        customers,
        recentReviews,
        upcomingReservations
      };
    } catch (error: any) {
      throw new Error(`Error generating dashboard: ${error.message}`);
    }
  }

  private static calculateDaysInRange(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  }

  static async getOwnerAnalytics(
    ownerType: 'club' | 'partner',
    ownerId: number,
    dateRange: DateRange
  ): Promise<{
    totalCourts: number;
    totalRevenue: number;
    totalReservations: number;
    averageRating: number;
    courtPerformance: Array<{ court: Court; revenue: number; reservations: number; rating: number }>;
  }> {
    try {
      const courts = await Court.findAll({
        where: { ownerType, ownerId, isActive: true }
      });

      let totalRevenue = 0;
      let totalReservations = 0;
      let totalRatingSum = 0;
      let totalRatingCount = 0;

      const courtPerformance = await Promise.all(
        courts.map(async (court) => {
          const reservations = await Reservation.findAll({
            where: {
              courtId: court.id,
              reservationDate: {
                [Op.between]: [dateRange.startDate, dateRange.endDate]
              },
              status: { [Op.in]: ['confirmed', 'completed', 'checked_in'] }
            }
          });

          const courtRevenue = reservations.reduce((sum, r) => sum + r.totalAmount, 0);
          const courtReservations = reservations.length;

          const reviews = await CourtReview.findAll({
            where: { courtId: court.id }
          });

          const courtRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length
            : 0;

          totalRevenue += courtRevenue;
          totalReservations += courtReservations;
          totalRatingSum += courtRating * reviews.length;
          totalRatingCount += reviews.length;

          return {
            court,
            revenue: Number(courtRevenue.toFixed(2)),
            reservations: courtReservations,
            rating: Number(courtRating.toFixed(1))
          };
        })
      );

      const averageRating = totalRatingCount > 0 
        ? Number((totalRatingSum / totalRatingCount).toFixed(1))
        : 0;

      return {
        totalCourts: courts.length,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalReservations,
        averageRating,
        courtPerformance: courtPerformance.sort((a, b) => b.revenue - a.revenue)
      };
    } catch (error: any) {
      throw new Error(`Error calculating owner analytics: ${error.message}`);
    }
  }
}