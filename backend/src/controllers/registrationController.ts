import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import registrationService from '../services/registrationService';

interface MulterRequest extends Request {
  files?: {
    profilePhoto?: Express.Multer.File[];
    idDocument?: Express.Multer.File[];
    logo?: Express.Multer.File[];
  };
  file?: Express.Multer.File;
}

class RegistrationController {
  async registerPlayer(req: MulterRequest, res: Response) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const data = {
        ...req.body,
        profilePhoto: req.files?.profilePhoto?.[0],
        idDocument: req.files?.idDocument?.[0]
      };

      const result = await registrationService.registerPlayer(data);
      
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Player registration failed'
      });
    }
  }

  async registerCoach(req: MulterRequest, res: Response) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const data = {
        ...req.body,
        profilePhoto: req.files?.profilePhoto?.[0],
        idDocument: req.files?.idDocument?.[0]
      };

      const result = await registrationService.registerCoach(data);
      
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Coach registration failed'
      });
    }
  }

  async registerClub(req: MulterRequest, res: Response) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const data = {
        ...req.body,
        logo: req.file,
        socialMedia: req.body.socialMedia ? JSON.parse(req.body.socialMedia) : undefined
      };

      const result = await registrationService.registerClub(data);
      
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Club registration failed'
      });
    }
  }

  async registerPartner(req: MulterRequest, res: Response) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const data = {
        ...req.body,
        logo: req.file,
        socialMedia: req.body.socialMedia ? JSON.parse(req.body.socialMedia) : undefined
      };

      const result = await registrationService.registerPartner(data);
      
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Partner registration failed'
      });
    }
  }

  async registerStateCommittee(req: MulterRequest, res: Response) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const data = {
        ...req.body,
        logo: req.file,
        socialMedia: req.body.socialMedia ? JSON.parse(req.body.socialMedia) : undefined
      };

      const result = await registrationService.registerStateCommittee(data);
      
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'State committee registration failed'
      });
    }
  }

  async checkUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      
      if (!username || username.length < 3) {
        return res.status(400).json({
          success: false,
          error: 'Username must be at least 3 characters'
        });
      }

      const available = await registrationService.checkUsernameAvailability(username);
      
      res.json({
        success: true,
        available,
        message: available ? 'Username is available' : 'Username is already taken'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Error checking username availability'
      });
    }
  }

  async checkEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }

      const available = await registrationService.checkEmailAvailability(email);
      
      res.json({
        success: true,
        available,
        message: available ? 'Email is available' : 'Email is already registered'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Error checking email availability'
      });
    }
  }

  async checkCurp(req: Request, res: Response) {
    try {
      const { curp } = req.params;
      
      if (!curp || curp.length !== 18) {
        return res.status(400).json({
          success: false,
          error: 'CURP must be exactly 18 characters'
        });
      }

      const available = await registrationService.checkCurpAvailability(curp);
      
      res.json({
        success: true,
        available,
        message: available ? 'CURP is available' : 'CURP is already registered'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Error checking CURP availability'
      });
    }
  }
}

export default new RegistrationController();