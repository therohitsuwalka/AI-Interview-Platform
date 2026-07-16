import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "Remote",
    },

    jobType: {
      type: String,
      enum: [
        "Full Time",
        "Internship",
        "Part Time",
        "Contract",
      ],
      default: "Full Time",
    },

    experience: {
      type: String,
      default: "Fresher",
    },

    salary: {
      type: String,
      default: "Not Disclosed",
    },

    skills: [
      {
        type: String,
      },
    ],

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Open",
        "Closed",
      ],
      default: "Open",
    },

    totalApplicants: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Job",
  jobSchema
);