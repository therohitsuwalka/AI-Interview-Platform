import express from "express";

import {
  recruiterSignup,
  recruiterLogin,
  recruiterDashboard,
  getCandidates,
  getCandidateDetails,
} from "../controllers/recruiterController.js";

import recruiterAuthMiddleware from "../middleware/recruiterAuthMiddleware.js";

const router = express.Router();

/* =====================================================
   Recruiter Authentication
===================================================== */

router.post(
  "/signup",
  recruiterSignup
);

router.post(
  "/login",
  recruiterLogin
);

/* =====================================================
   Recruiter Dashboard
===================================================== */

router.get(
  "/dashboard",
  recruiterAuthMiddleware,
  recruiterDashboard
);

/* =====================================================
   Candidates
===================================================== */

router.get(
  "/candidates",
  recruiterAuthMiddleware,
  getCandidates
);

router.get(
  "/candidate/:id",
  recruiterAuthMiddleware,
  getCandidateDetails
);

export default router;