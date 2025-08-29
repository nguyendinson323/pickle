import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { TokenPayload, RefreshTokenPayload } from '../types/auth';

class JWTService {
  generateAccessToken(payload: TokenPayload): string {
    const secret = config.jwt.secret;
    const options: any = { expiresIn: config.jwt.expiresIn };
    return jwt.sign(payload, secret, options);
  }

  generateRefreshToken(payload: RefreshTokenPayload): string {
    const secret = config.jwt.refreshSecret;
    const options: any = { expiresIn: config.jwt.refreshExpiresIn };
    return jwt.sign(payload, secret, options);
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, config.jwt.secret as string) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret as string) as RefreshTokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    
    return parts[1];
  }
}

export default new JWTService();