import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  downloadInterviewReport,
  downloadAdaptiveReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/interview/:id", authMiddleware, downloadInterviewReport);
router.get("/adaptive/:id", authMiddleware, downloadAdaptiveReport);

export default router;
