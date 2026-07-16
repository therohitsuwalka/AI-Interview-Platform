import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adaptiveInterviewRoutes from "./routes/adaptiveInterviewRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";

import jobRoutes from "./routes/jobRoutes.js";

// Load Environment Variables
dotenv.config();

console.log(
  "Gemini Key Loaded:",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);

const app = express();

/* =====================================================
   Database
===================================================== */

connectDB();

/* =====================================================
   Middlewares
===================================================== */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* =====================================================
   API Routes
===================================================== */

app.use("/api/auth", authRoutes);

app.use("/api/interview", interviewRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/adaptive", adaptiveInterviewRoutes);

import reportRoutes from "./routes/reportRoutes.js";
app.use("/api/report", reportRoutes);

import analyticsRoutes from "./routes/analyticsRoutes.js";
app.use("/api/analytics", analyticsRoutes);

app.use("/api/coding", codingRoutes);

app.use("/api/profile", profileRoutes);

/* =====================================================
   Recruiter Routes
===================================================== */

app.use("/api/recruiter", recruiterRoutes);

app.use("/api/jobs", jobRoutes);

/* =====================================================
   Health Check
===================================================== */

app.get("/", (req, res) => {

  res.status(200).json({

    success: true,

    message: "AI Interview Backend Running 🚀",

  });

});

/* =====================================================
   404
===================================================== */

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message: "API Route Not Found",

  });

});

/* =====================================================
   Global Error Handler
===================================================== */

app.use((err, req, res, next) => {

  console.error(err);

  res.status(500).json({

    success: false,

    message: err.message || "Internal Server Error",

  });

});

/* =====================================================
   Server
===================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );

});