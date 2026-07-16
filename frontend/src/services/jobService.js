import api from "./api";

/* ======================================
   Create Job
====================================== */

export const createJob = (data) =>
  api.post("/jobs/create", data);

/* ======================================
   Get My Jobs
====================================== */

export const getMyJobs = () =>
  api.get("/jobs/my-jobs");

/* ======================================
   Get Job Details
====================================== */

export const getJobById = (id) =>
  api.get(`/jobs/${id}`);

/* ======================================
   Delete Job
====================================== */

export const deleteJob = (id) =>
  api.delete(`/jobs/${id}`);