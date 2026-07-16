import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  listProblems,
  getProblem,
  runCode,
  submitCode,
  getCodingHistory,
} from "../controllers/codingController.js";

const router = express.Router();

router.get("/problems", authMiddleware, listProblems);
router.get("/problems/:id", authMiddleware, getProblem);
router.post("/run", authMiddleware, runCode);
router.post("/submit", authMiddleware, submitCode);
router.get("/history", authMiddleware, getCodingHistory);

export default router;
