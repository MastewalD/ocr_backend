const AppError = require('./appError');

function handlePrismaError(err) {
  switch (err.code) {
    case 'P2000':
      return new AppError('Value too long for the field.', 400);

    case 'P2002': {
      const fields = err.meta?.target || [];
      const fieldNames = fields.join(', ');
      const message = `Duplicate field value on ${fieldNames}. Please use another value.`;
      return new AppError(message, 400);
    }

    case 'P2003':
      return new AppError('Foreign key constraint failed.', 400);

    case 'P2004':
      return new AppError('Database constraint failed.', 400);

    case 'P2005':
      return new AppError('Invalid value for the field.', 400);

    case 'P2006':
      return new AppError('Invalid field name in query.', 400);

    case 'P2007':
      return new AppError('Data validation error.', 400);

    case 'P2008':
      return new AppError('Failed to validate the query.', 400);

    case 'P2025':
      return new AppError('Record not found.', 404);

    default:
      return err;
  }
}

module.exports = handlePrismaError;
