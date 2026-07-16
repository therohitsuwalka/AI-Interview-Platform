import express from "express";

import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  uploadResume,
  getResumeAnalysis,
  getResumeHistory,
} from "../controllers/resumeController.js";

const router = express.Router();

// Resume is required, JD file is optional (JD text can also be sent as a
// plain form field "jobDescription" instead of a file).
router.post(
  "/upload",
  authMiddleware,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jdFile", maxCount: 1 },
  ]),
  uploadResume
);

router.get("/history", authMiddleware, getResumeHistory);

router.get("/analysis/:id", authMiddleware, getResumeAnalysis);

export default router;
