function errorHandler(err, req, res, next) {
  // Log the error for debugging
  console.error("❌ API Error:", err.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific Postgres Errors
  if (err.code) {
    switch (err.code) {
      case "23505": // Unique violation
        status = 409;
        message = "Resource already exists.";
        break;
      case "23503": // Foreign key violation
        status = 400;
        message = "Related resource not found.";
        break;
      case "22P02": // Invalid input syntax (e.g. non-UUID for UUID)
        status = 400;
        message = "Invalid input format.";
        break;
    }
  }

  res.status(status).json({
    success: false,
    error: message,
    // Include error code for frontend to handle if needed
    code: err.code || "INTERNAL_ERROR"
  });
}

module.exports = errorHandler;
