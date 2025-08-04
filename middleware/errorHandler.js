/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // MongoDB validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      error: "Validation failed",
      details: errors,
    });
  }

  // MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: `${field} already exists`,
    });
  }

  // MongoDB ObjectId errors
  if (err.kind === "ObjectId") {
    return res.status(400).json({
      error: "Invalid ID format",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expired",
    });
  }

  // Default error
  res.status(500).json({
    error: "Internal server error",
  });
};

module.exports = errorHandler;
