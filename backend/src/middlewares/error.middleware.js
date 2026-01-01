const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  console.error(`[Error] ${statusCode} - ${message}`, err);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export { errorHandler };
