const { body, query } = require("express-validator");

/**
 * Validation rules for getting jobs with filters
 */
const getJobsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search").optional().isString().withMessage("Search must be a string"),
  query("location")
    .optional()
    .isString()
    .withMessage("Location must be a string"),
  query("type")
    .optional()
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Invalid job type"),
  query("remote")
    .optional()
    .isBoolean()
    .withMessage("Remote must be a boolean"),
];

/**
 * Validation rules for creating a job
 */
const createJobValidation = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Job title must be between 5 and 100 characters"),
  body("company")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),
  body("location")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),
  body("type")
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Invalid job type"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Job description must be between 20 and 2000 characters"),
  body("contactEmail")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid contact email"),
  body("salary")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Salary cannot be more than 50 characters"),
  body("requirements")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Requirements cannot be more than 1000 characters"),
];

/**
 * Validation rules for applying to a job
 */
const applyToJobValidation = [
  body("fullName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("phone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Phone number cannot be more than 20 characters"),
  body("coverLetter")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Cover letter cannot be more than 2000 characters"),
  body("resume")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Resume filename cannot be more than 500 characters"),
];

/**
 * Validation rules for updating application status
 */
const updateApplicationStatusValidation = [
  body("status")
    .isIn(["pending", "reviewed", "shortlisted", "rejected", "hired"])
    .withMessage("Invalid status"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes cannot be more than 1000 characters"),
];

module.exports = {
  getJobsValidation,
  createJobValidation,
  applyToJobValidation,
  updateApplicationStatusValidation,
};
