import { Request, Response } from 'express';
import registrationService from '../services/registrationService';

interface MulterRequest extends Request {
  files?: {
    profilePhoto?: Express.Multer.File[];
    idDocument?: Express.Multer.File[];
    logo?: Express.Multer.File[];
  };
  file?: Express.Multer.File;
}

const registerPlayer = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
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
};

const registerCoach = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
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
};

const registerClub = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
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
};

const registerPartner = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
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
};

const registerStateCommittee = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
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
};

const checkUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    
    if (!username || username.length < 3) {
      res.status(400).json({
        success: false,
        error: 'Username must be at least 3 characters'
      });
      return;
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
};

const checkEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    
    if (!email || !email.includes('@')) {
      res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
      return;
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
};

const checkCurp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { curp } = req.params;
    
    if (!curp || curp.length !== 18) {
      res.status(400).json({
        success: false,
        error: 'CURP must be exactly 18 characters'
      });
      return;
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
};

export default {
  registerPlayer,
  registerCoach,
  registerClub,
  registerPartner,
  registerStateCommittee,
  checkUsername,
  checkEmail,
  checkCurp
};