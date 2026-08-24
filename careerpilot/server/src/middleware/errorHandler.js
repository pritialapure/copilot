import { HttpError } from '../utils/httpError.js';

export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  // Default error
  res.status(500).json({ message: 'Internal server error' });
}

export default errorHandler;
