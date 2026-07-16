import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    aiFeedback: {
      type: String,
      default: "",
    },

    followUpQuestion: {
      type: String,
      default: "",
    },

    confidence: {
      type: Number,
      default: 0,
    },

    skipped: {
      type: Boolean,
      default: false,
    },

    markedReview: {
      type: Boolean,
      default: false,
    },

    duration: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    transcript: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const InterviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Links to the resume + JD analysis this interview was generated from
    resumeAnalysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeAnalysis",
    },

    role: {
      type: String,
      required: true,
    },

    totalQuestions: {
      type: Number,
      default: 8,
    },

    experience: {
      type: String,
      default: "Fresher",
    },

    company: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      default: "Medium",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: Date,

    status: {
      type: String,
      enum: ["started", "completed", "paused"],
      default: "started",
    },

    currentQuestion: {
      type: Number,
      default: 0,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    technicalScore: {
      type: Number,
      default: 0,
    },

    communicationScore: {
      type: Number,
      default: 0,
    },

    hrScore: {
      type: Number,
      default: 0,
    },

    recommendation: {
      type: String,
      default: "",
    },

    answers: [AnswerSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("InterviewSession", InterviewSessionSchema);
