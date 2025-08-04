const express = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validation");

// Import controllers
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getUserJobs,
  getUserJobsWithApplications,
} = require("../controllers/jobController");

const {
  getJobApplications,
  applyToJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");

// Import validators
const {
  getJobsValidation,
  createJobValidation,
  applyToJobValidation,
  updateApplicationStatusValidation,
} = require("../validators/jobValidators");

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getJobsValidation, validate, getJobs);
router.get("/:id", getJobById);

// Protected routes (authentication required)
router.post("/", auth, createJobValidation, validate, createJob);
router.put("/:id", auth, createJobValidation, validate, updateJob);
router.delete("/:id", auth, deleteJob);

// User job management routes
router.get("/user/my-jobs", auth, getUserJobs);
router.get(
  "/user/my-jobs-with-applications",
  auth,
  getUserJobsWithApplications
);

// Application routes
router.get("/:id/applications", auth, getJobApplications);
router.post("/:id/apply", applyToJobValidation, validate, applyToJob);
router.put(
  "/:id/applications/:applicationId/status",
  auth,
  updateApplicationStatusValidation,
  validate,
  updateApplicationStatus
);

module.exports = router;
