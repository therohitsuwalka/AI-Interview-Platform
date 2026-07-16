import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAnalyticsOverview } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/overview", authMiddleware, getAnalyticsOverview);

export default router;
