const Job = require('../models/Job');
const { transformApplication, calculateApplicationStats } = require('../services/jobService');

/**
 * Get all applications for a job (job poster only)
 */
const getJobApplications = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate('postedBy', 'name email')
      .lean();

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user is the job poster
    if (job.postedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view applications for this job' });
    }

    // Transform applications
    const applications = job.applicants.map(transformApplication);
    const stats = calculateApplicationStats(job.applicants);

    res.json({
      job: {
        id: job._id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type
      },
      applications,
      stats
    });
  } catch (error) {
    console.error('Get applications error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }
    res.status(500).json({ error: 'Server error while fetching applications' });
  }
};

/**
 * Apply for a job
 */
const applyToJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, coverLetter, resume } = req.body;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (!job.isActive) {
      return res.status(400).json({ error: 'This job is no longer accepting applications' });
    }

    // Check if user has already applied
    const existingApplication = job.applicants.find(
      applicant => applicant.email === email
    );
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Add application to job
    job.applicants.push({
      fullName,
      email,
      phone,
      coverLetter,
      resume,
      appliedAt: new Date()
    });

    await job.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        fullName,
        email,
        phone,
        coverLetter,
        resume,
        appliedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ error: 'Server error while submitting application' });
  }
};

/**
 * Update application status
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { id, applicationId } = req.params;
    const { status, notes } = req.body;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update applications for this job' });
    }

    // Find the application
    const application = job.applicants.id(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update application status
    application.status = status;
    application.reviewedAt = new Date();
    application.reviewedBy = req.user._id;
    if (notes) {
      application.notes = notes;
    }

    await job.save();

    const transformedApplication = transformApplication(application);

    res.json({
      message: 'Application status updated successfully',
      application: transformedApplication
    });
  } catch (error) {
    console.error('Update application status error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: 'Server error while updating application status' });
  }
};

module.exports = {
  getJobApplications,
  applyToJob,
  updateApplicationStatus
}; 