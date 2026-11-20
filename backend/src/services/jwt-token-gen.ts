// src/services/jwt-token-gen.ts
import jwt from 'jsonwebtoken';

export const jwtTokenGen = (adminName: string): string | null => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return null;
    }

    // String '8h' (or '1d') is parsed accurately as hours/days by jsonwebtoken
    return jwt.sign({ adminName }, secret, { expiresIn: '8h' });
  } catch (error) {
    console.error('jwtTokenGen error =>', error);
    return null;
  }
};