import prisma from '../config/database.js';

export class LogService {
  // Get all logs
  static async getAllLogs(page: number = 1, limit: number = 50, filters?: {
    userType?: 'public' | 'admin';
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const skip = (page - 1) * limit;
    
    const whereClause: any = {};
    
    if (filters?.userType) {
      whereClause.userType = filters.userType;
    }
    
    if (filters?.action) {
      whereClause.action = filters.action;
    }
    
    if (filters?.startDate || filters?.endDate) {
      whereClause.createdAt = {};
      
      if (filters.startDate) {
        whereClause.createdAt.gte = filters.startDate;
      }
      
      if (filters.endDate) {
        whereClause.createdAt.lte = filters.endDate;
      }
    }

    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.log.count({ where: whereClause })
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    };
  }

  // Get today's logs
  static async getTodayLogs() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const logs = await prisma.log.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by action type for statistics
    const stats = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      logs,
      stats,
      total: logs.length,
      date: today.toDateString()
    };
  }

  // Get logs by date range
  static async getLogsByDateRange(startDate: Date, endDate: Date) {
    const logs = await prisma.log.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return logs;
  }

  // Get activity summary
  static async getActivitySummary(days: number = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.log.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        action: true,
        userType: true,
        createdAt: true
      }
    });

    // Group by date
    const activityByDate = logs.reduce((acc, log) => {
      const date = log.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          public: 0,
          admin: 0,
          total: 0
        };
      }
      acc[date][log.userType]++;
      acc[date].total++;
      return acc;
    }, {} as Record<string, { public: number; admin: number; total: number }>);

    // Get top actions
    const actionCounts = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActions = Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }));

    return {
      activityByDate,
      topActions,
      totalLogs: logs.length,
      period: `${days} days`
    };
  }
}


