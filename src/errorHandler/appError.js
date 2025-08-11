class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.customMessage = message || 'error';
    this.statusCode = statusCode;
    this.success = `${statusCode}`.startsWith('4') ? false : false;
    this.isOperational = true; 
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
