/**
 * Utility functions for consistent API responses
 */

/**
 * Success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} data - Response data
 */
const successResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = null
) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} details - Error details
 */
const errorResponse = (
  res,
  statusCode = 500,
  message = "Internal server error",
  details = null
) => {
  const response = {
    success: false,
    error: message,
  };

  if (details !== null) {
    response.details = details;
  }

  res.status(statusCode).json(response);
};

/**
 * Pagination response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination info
 * @param {string} message - Success message
 */
const paginationResponse = (
  res,
  data,
  pagination,
  message = "Data retrieved successfully"
) => {
  res.json({
    success: true,
    message,
    data,
    pagination,
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginationResponse,
};
