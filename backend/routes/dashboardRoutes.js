import express from "express";
import { getDashboardAnalytics } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/analytics",
  authMiddleware,
  getDashboardAnalytics
);

export default router;