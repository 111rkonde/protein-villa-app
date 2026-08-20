import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { TokenPayload } from '../types';

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: (ENV.JWT_EXPIRES_IN || '7d') as any,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Authentication token has expired. Please log in again.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid authentication token.');
    }
    throw new Error('Authentication failed.');
  }
};
