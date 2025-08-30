import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import authService from '../services/authService';
import { LoginRequest } from '../types/auth';

// Validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
];

const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const loginData: LoginRequest = req.body;
    const result = await authService.login(loginData);

    if (!result) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      user: result.user,
      token: result.token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('refreshToken');
    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const user = await authService.getCurrentUser(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required'
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    if (!result) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      });
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      token: result.token
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const verifyToken = async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      valid: true,
      user: req.user
    });
  } catch (error) {
    console.error('Verify token error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export default {
  loginValidation,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  verifyToken
};
