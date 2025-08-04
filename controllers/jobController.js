const Job = require("../models/Job");
const {
  transformJob,
  transformApplication,
  buildJobFilter,
  calculateApplicationStats,
} = require("../services/jobService");

/**
 * Get all jobs with filtering and pagination
 */
const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const filter = buildJobFilter(req.query);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const jobs = await Job.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Transform jobs
    const transformedJobs = jobs.map(transformJob);

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      jobs: transformedJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalJobs: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ error: "Server error while fetching jobs" });
  }
};

/**
 * Get a specific job by ID
 */
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate("postedBy", "name email")
      .lean();

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (!job.isActive) {
      return res.status(404).json({ error: "Job is no longer active" });
    }

    const transformedJob = transformJob(job);
    res.json({ job: transformedJob });
  } catch (error) {
    console.error("Get job error:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid job ID format" });
    }
    res.status(500).json({ error: "Server error while fetching job" });
  }
};

/**
 * Create a new job
 */
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      contactEmail,
    } = req.body;

    // Create new job
    const job = new Job({
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      contactEmail,
      postedBy: req.user._id,
    });

    await job.save();
    await job.populate("postedBy", "name email");

    const transformedJob = transformJob(job);

    res.status(201).json({
      message: "Job posted successfully",
      job: transformedJob,
    });
  } catch (error) {
    console.error("Post job error:", error);
    res.status(500).json({ error: "Server error while posting job" });
  }
};

/**
 * Update a job
 */
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this job" });
    }

    // Update job fields
    const allowedUpdates = [
      "title",
      "company",
      "location",
      "type",
      "salary",
      "description",
      "requirements",
      "contactEmail",
      "isActive",
    ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates" });
    }

    updates.forEach((update) => (job[update] = req.body[update]));
    await job.save();
    await job.populate("postedBy", "name email");

    const transformedJob = transformJob(job);

    res.json({
      message: "Job updated successfully",
      job: transformedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ error: "Server error while updating job" });
  }
};

/**
 * Delete a job
 */
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(id);

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ error: "Server error while deleting job" });
  }
};

/**
 * Get jobs posted by the authenticated user
 */
const getUserJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const transformedJobs = jobs.map(transformJob);

    res.json({ jobs: transformedJobs });
  } catch (error) {
    console.error("Get user jobs error:", error);
    res.status(500).json({ error: "Server error while fetching user jobs" });
  }
};

/**
 * Get user's jobs with application counts
 */
const getUserJobsWithApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const transformedJobs = jobs.map((job) => {
      const applications = job.applicants || [];
      return {
        ...transformJob(job),
        // Application stats
        totalApplications: applications.length,
        pendingApplications: applications.filter(
          (app) => app.status === "pending"
        ).length,
        shortlistedApplications: applications.filter(
          (app) => app.status === "shortlisted"
        ).length,
        rejectedApplications: applications.filter(
          (app) => app.status === "rejected"
        ).length,
        hiredApplications: applications.filter((app) => app.status === "hired")
          .length,
      };
    });

    res.json({ jobs: transformedJobs });
  } catch (error) {
    console.error("Get user jobs with applications error:", error);
    res.status(500).json({ error: "Server error while fetching user jobs" });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getUserJobs,
  getUserJobsWithApplications,
};
