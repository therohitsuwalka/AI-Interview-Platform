import Job from "../models/Job.js";

/* =====================================================
   Create Job
===================================================== */

export const createJob = async (req, res) => {

  try {

    const {

      jobTitle,

      company,

      location,

      jobType,

      experience,

      salary,

      skills,

      description,

      expiresAt,

    } = req.body;

    if (

      !jobTitle ||

      !company ||

      !description

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Job title, company and description are required.",

      });

    }

    const job = await Job.create({

      recruiter: req.user.id,

      jobTitle,

      company,

      location,

      jobType,

      experience,

      salary,

      skills,

      description,

      expiresAt,

    });

    return res.status(201).json({

      success: true,

      message: "Job Created Successfully",

      job,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

/* =====================================================
   Get Recruiter Jobs
===================================================== */

export const getRecruiterJobs = async (req, res) => {

  try {

    const jobs = await Job.find({

      recruiter: req.user.id,

    }).sort({

      createdAt: -1,

    });

    return res.json({

      success: true,

      totalJobs: jobs.length,

      jobs,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

/* =====================================================
   Get Single Job
===================================================== */

export const getJobById = async (req, res) => {

  try {

    const job = await Job.findById(

      req.params.id

    );

    if (!job) {

      return res.status(404).json({

        success: false,

        message: "Job not found.",

      });

    }

    return res.json({

      success: true,

      job,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

/* =====================================================
   Delete Job
===================================================== */

export const deleteJob = async (req, res) => {

  try {

    const job = await Job.findOne({

      _id: req.params.id,

      recruiter: req.user.id,

    });

    if (!job) {

      return res.status(404).json({

        success: false,

        message: "Job not found.",

      });

    }

    await job.deleteOne();

    return res.json({

      success: true,

      message: "Job Deleted Successfully",

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};