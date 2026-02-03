import type { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';
import type { AuthRequest } from './auth.js';

// Log action to database
export const logAction = async (
  action: string,
  details: Record<string, any> = {},
  userType: 'public' | 'admin' = 'public',
  req?: Request
): Promise<void> => {
  try {
    await prisma.log.create({
      data: {
        action,
        details,
        userType,
        ipAddress: req?.ip || req?.socket.remoteAddress || 'unknown',
        endpoint: req ? `${req.method} ${req.originalUrl}` : 'system'
      }
    });
  } catch (error) {
    console.error('❌ Failed to log action:', error);
  }
};

// Request logger middleware
export const requestLogger = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  
  // Log when response is finished
  res.on('finish', async () => {
    const duration = Date.now() - start;
    
    // Don't log health checks
    if (req.path === '/health') return;
    
    // Determine action based on route and method
    let action = '';
    let userType: 'public' | 'admin' = 'public';
    
    // Admin actions
    if (req.path.startsWith('/api/admin')) {
      userType = 'admin';
      if (req.path === '/api/admin/login' && req.method === 'POST') {
        action = 'admin_login';
      } else if (req.method === 'POST') {
        action = 'admin_create';
      } else if (req.method === 'PUT' || req.method === 'PATCH') {
        action = 'admin_update';
      } else if (req.method === 'DELETE') {
        action = 'admin_delete';
      } else {
        action = 'admin_view';
      }
    }
    // Public actions
    else if (req.path === '/api/contact' && req.method === 'POST') {
      action = 'contact_submission';
    } else if (req.path === '/api/reviews' && req.method === 'POST') {
      action = 'review_submission';
    }
    
    // Log significant actions
    if (action) {
      await logAction(
        action,
        {
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          userId: req.admin?.id || null
        },
        userType,
        req
      );
    }
  });
  
  next();
};

// Get today's logs
export const getTodayLogs = async () => {
  try {
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
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Statistics
    const totalLogs = logs.length;
    const publicLogs = logs.filter(log => log.userType === 'public').length;
    const adminLogs = logs.filter(log => log.userType === 'admin').length;
    
    // Group by action
    const actionStats = logs.reduce((acc: Record<string, number>, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});

    return {
      logs,
      statistics: {
        total: totalLogs,
        public: publicLogs,
        admin: adminLogs,
        actions: actionStats
      },
      date: today.toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('Error getting today logs:', error);
    throw error;
  }
};