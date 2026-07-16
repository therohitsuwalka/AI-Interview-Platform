import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeFileUrl: {
      type: String,
      default: "",
    },

    resumeText: {
      type: String,
      default: "",
    },

    // Whether the user provided a Job Description or not
    mode: {
      type: String,
      enum: ["JD_BASED", "RESUME_ONLY"],
      default: "RESUME_ONLY",
    },

    targetRole: {
      type: String,
      default: "",
    },

    jobDescriptionText: {
      type: String,
      default: "",
    },

    // ---- AI Analysis Result ----

    atsScore: {
      type: Number,
      default: 0,
    },

    // Match % is only meaningful when mode = JD_BASED
    matchScore: {
      type: Number,
      default: 0,
    },

    skills: [
      {
        type: String,
      },
    ],

    matchedSkills: [
      {
        type: String,
      },
    ],

    missingSkills: [
      {
        type: String,
      },
    ],

    strengths: [
      {
        type: String,
      },
    ],

    weaknesses: [
      {
        type: String,
      },
    ],

    suggestions: [
      {
        type: String,
      },
    ],

    suitableRoles: [
      {
        type: String,
      },
    ],

    summary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
