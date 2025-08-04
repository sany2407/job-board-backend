const { getTimeAgo } = require("../utils/timeUtils");

/**
 * Transform job data to match frontend expectations
 * @param {Object} job - Raw job data from database
 * @returns {Object} Transformed job data
 */
const transformJob = (job) => ({
  id: job._id.toString(),
  title: job.title,
  company: job.company,
  location: job.location,
  type: job.type,
  salary: job.salary || "",
  description: job.description,
  requirements: job.requirements || "",
  contactEmail: job.contactEmail,
  postedBy: job.postedBy._id.toString(),
  postedAt: job.createdAt,
  applicants: job.applicants || [],
  // Frontend computed fields
  experience: "3+ years", // Default experience
  posted: getTimeAgo(new Date(job.createdAt)),
  skills: job.requirements
    ? job.requirements.split(",").map((s) => s.trim())
    : [],
  logo: job.company
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase(),
  featured: Math.random() > 0.5, // Random featured status
  remote: job.location.toLowerCase().includes("remote"),
  applicantCount: job.applicants ? job.applicants.length : 0,
});

/**
 * Transform application data for frontend
 * @param {Object} application - Raw application data
 * @returns {Object} Transformed application data
 */
const transformApplication = (application) => ({
  id: application._id.toString(),
  fullName: application.fullName,
  email: application.email,
  phone: application.phone,
  coverLetter: application.coverLetter,
  resume: application.resume,
  appliedAt: application.appliedAt,
  status: application.status,
  reviewedAt: application.reviewedAt,
  notes: application.notes,
  timeAgo: getTimeAgo(new Date(application.appliedAt)),
});

/**
 * Build filter object for job queries
 * @param {Object} query - Query parameters
 * @returns {Object} Filter object for MongoDB query
 */
const buildJobFilter = (query) => {
  const { search, location, type, remote } = query;
  const filter = { isActive: true };

  if (search) {
    filter.$text = { $search: search };
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (type) {
    filter.type = type;
  }

  if (remote !== undefined) {
    if (remote === "true") {
      filter.location = { $regex: /remote/i };
    } else {
      filter.location = { $not: /remote/i };
    }
  }

  return filter;
};

/**
 * Calculate application statistics
 * @param {Array} applications - Array of applications
 * @returns {Object} Statistics object
 */
const calculateApplicationStats = (applications) => ({
  total: applications.length,
  pending: applications.filter((app) => app.status === "pending").length,
  shortlisted: applications.filter((app) => app.status === "shortlisted")
    .length,
  rejected: applications.filter((app) => app.status === "rejected").length,
  hired: applications.filter((app) => app.status === "hired").length,
});

module.exports = {
  transformJob,
  transformApplication,
  buildJobFilter,
  calculateApplicationStats,
};
