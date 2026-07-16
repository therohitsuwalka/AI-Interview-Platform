import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  startAdaptiveInterview,
  submitAdaptiveAnswer,
  finishAdaptiveInterview,
  getAdaptiveHistory,
  getAdaptiveSessionById,
  getNextQuestion,
} from "../controllers/adaptiveInterviewController.js";

const router = express.Router();

router.post("/start", authMiddleware, startAdaptiveInterview);
router.post("/submit-answer", authMiddleware, submitAdaptiveAnswer);
router.post("/finish", authMiddleware, finishAdaptiveInterview);
router.get("/history", authMiddleware, getAdaptiveHistory);
router.get("/session/:id", authMiddleware, getAdaptiveSessionById);

// Legacy route kept for backward compatibility
router.post("/next-question", authMiddleware, getNextQuestion);

export default router;
