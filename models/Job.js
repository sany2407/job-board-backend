const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    resume: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected", "hired"],
      default: "pending",
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot be more than 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot be more than 100 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot be more than 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location cannot be more than 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Job type is required"],
      enum: ["full-time", "part-time", "contract", "internship"],
      default: "full-time",
    },
    salary: {
      type: String,
      trim: true,
      maxlength: [50, "Salary cannot be more than 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [2000, "Job description cannot be more than 2000 characters"],
    },
    requirements: {
      type: String,
      trim: true,
      maxlength: [1000, "Requirements cannot be more than 1000 characters"],
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    applicants: [applicantSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
jobSchema.index({ title: "text", company: "text", description: "text" });
jobSchema.index({ location: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ createdAt: -1 });

// Virtual for applicant count
jobSchema.virtual("applicantCount").get(function () {
  return this.applicants.length;
});

// Ensure virtual fields are serialized
jobSchema.set("toJSON", { virtuals: true });
jobSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Job", jobSchema);
