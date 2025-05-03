import { ExpressContext } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET_KEY || '';

export const authenticateToken = ({ req }: ExpressContext) => {
  // Get token from headers
  let token = req.headers.authorization || '';

  if (token) {
    // Remove 'Bearer' if present
    token = token.split(' ').pop()?.trim() || '';

    try {
      const { _id, username, email } = jwt.verify(token, secretKey) as JwtPayload;
      return { user: { _id, username, email } };
    } catch (err) {
      console.log('Invalid token');
      return { user: null };
    }
  }

  return { user: null };
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
