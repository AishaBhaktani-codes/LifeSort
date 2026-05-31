export const errorHandler = (err, req, res, next) => {
  console.error('ERROR ENCOUNTERED:', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    stack: err.stack,
    details: err
  });
};
