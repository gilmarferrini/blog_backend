import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/authConfig';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

const checkAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('Token JWT ausente');
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, authConfig.secret);
    const { sub } = decoded as TokenPayload;
    request.user = { id: sub };

    return next();
  } catch (err) {
    throw new Error('Token JWT inválido');
  }
};

export default checkAuthenticated;
