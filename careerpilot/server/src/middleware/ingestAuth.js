import { env } from '../config/env.js';
import { httpError } from '../utils/httpError.js';

// Guards the automation-facing ingest webhook. This is deliberately NOT the
// user JWT middleware: the caller here is your own AI-automation workflow
// (n8n / Zapier / Make), not a logged-in browser session, so it authenticates
// with a single shared secret instead.
//
// Set INGEST_API_KEY in server/.env to a long random string, then send it as
// the `x-ingest-key` header from your workflow's HTTP request node.
export function ingestAuth(req, res, next) {
  if (!env.INGEST_API_KEY) {
    // Fail closed: an unconfigured key must never mean "open to everyone".
    throw httpError(503, 'Ingest endpoint is not configured. Set INGEST_API_KEY in server/.env.');
  }

  const providedKey = req.headers['x-ingest-key'];
  if (!providedKey || providedKey !== env.INGEST_API_KEY) {
    throw httpError(401, 'Invalid or missing x-ingest-key header');
  }

  next();
}

export default ingestAuth;
