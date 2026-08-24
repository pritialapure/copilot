import { verifyToken } from '../utils/jwt.js';
import { httpError } from '../utils/httpError.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw httpError(401, 'Missing or invalid authorization header');
  }

  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    throw httpError(401, 'Invalid or expired token');
  }

  req.userId = decoded.userId;
  next();
}

export default authMiddleware;
