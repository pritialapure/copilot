export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

export function httpError(status, message) {
  return new HttpError(status, message);
}

export default httpError;
