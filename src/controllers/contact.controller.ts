import type { Request, Response } from 'express';
import { ContactService } from '../services/contact.service.js';
import type { AuthRequest } from '../middleware/auth.js';

export class ContactController {
  // Submit contact form (public)
  // static async submitContact(req: Request, res: Response) {
  //   try {
  //     const result = await ContactService.submitContactForm(
  //       req.body,
  //       req.ip
  //     );
      
  //     res.status(201).json({
  //       success: true,
  //       ...result
  //     });
  //   } catch (error: any) {
  //     res.status(400).json({
  //       success: false,
  //       error: error.message
  //     });
  //   }
  // }


// Submit contact form (public)
static async submitContact(req: Request, res: Response) {
  try {
    const result = await ContactService.submitContactForm(req.body);
    
    res.status(201).json({
      success: true,
      ...result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}


  // Admin: Get all messages
  static async getAllMessages(req: AuthRequest, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 20,
        isRead,
        isResolved,
        search
      } = req.query;
      
      const filters: any = {};
      if (isRead !== undefined) filters.isRead = isRead === 'true';
      if (isResolved !== undefined) filters.isResolved = isResolved === 'true';
      if (search) filters.search = search as string;
      
      const result = await ContactService.getAllMessages(
        Number(page),
        Number(limit),
        filters
      );
      
      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch messages'
      });
    }
  }

  // Admin: Get single message
  static async getMessage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      const message = await ContactService.getMessageById(Number(id));
      
      res.json({
        success: true,
        message
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  // Admin: Update message
  static async updateMessage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      const message = await ContactService.updateMessage(Number(id), req.body);
      
      res.json({
        success: true,
        message: 'Contact message updated successfully',
        data: message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Admin: Delete message
  static async deleteMessage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      await ContactService.deleteMessage(Number(id));
      
      res.json({
        success: true,
        message: 'Contact message deleted successfully'
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get message statistics
  static async getMessageStats(req: AuthRequest, res: Response) {
    try {
      const stats = await ContactService.getMessageStats();
      
      res.json({
        success: true,
        stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to get message statistics'
      });
    }
  }
}