class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super(message || 'Internal Server Error');
      this.statusCode = Number.isInteger(statusCode) ? statusCode : 500;
      Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = ErrorHandler