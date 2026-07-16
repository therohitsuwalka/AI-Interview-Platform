import express from "express";

import recruiterAuthMiddleware from "../middleware/recruiterAuthMiddleware.js";

import {

  createJob,

  getRecruiterJobs,

  getJobById,

  deleteJob,

} from "../controllers/jobController.js";

const router = express.Router();

/* =====================================================
   Create Job
===================================================== */

router.post(
  "/create",
  recruiterAuthMiddleware,
  createJob
);

/* =====================================================
   Get Recruiter's Jobs
===================================================== */

router.get(
  "/my-jobs",
  recruiterAuthMiddleware,
  getRecruiterJobs
);

/* =====================================================
   Get Single Job
===================================================== */

router.get(
  "/:id",
  recruiterAuthMiddleware,
  getJobById
);

/* =====================================================
   Delete Job
===================================================== */

router.delete(
  "/:id",
  recruiterAuthMiddleware,
  deleteJob
);

export default router;