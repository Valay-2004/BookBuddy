function errorHandler(err, req, res, next) {
  console.log("X Error: ", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: message,
  });
}

module.exports = errorHandler;
