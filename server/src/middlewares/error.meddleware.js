export const errorMeddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = Number.isInteger(err?.statusCode) && err.statusCode >= 100 && err.statusCode < 600
    ? err.statusCode
    : 500;
  const message = err?.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    errorMessage: message,
  });
};