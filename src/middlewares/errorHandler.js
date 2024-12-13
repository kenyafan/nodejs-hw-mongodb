export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;

  res.status(statusCode).json({
    status: statusCode,
    message,
    ...(details && { details }),
  });
};
