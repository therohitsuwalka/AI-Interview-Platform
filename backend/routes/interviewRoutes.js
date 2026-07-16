import express from "express";

import {
  generateInterview,
  evaluateInterview,
  getInterviewHistory,
  getInterviewById,
} from "../controllers/interviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/generate",
  authMiddleware,
  generateInterview
);

router.post(
  "/evaluate",
  authMiddleware,
  evaluateInterview
);

router.get(
  "/history",
  authMiddleware,
  getInterviewHistory
);

router.get(
  "/:id",
  authMiddleware,
  getInterviewById
);

export default router;