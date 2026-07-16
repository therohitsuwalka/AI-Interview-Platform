import Recruiter from "../models/Recruiter.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

import User from "../models/User.js";
import Interview from "../models/Interview.js";

/* =====================================================
   Recruiter Signup
===================================================== */

export const recruiterSignup = async (req, res) => {

  try {

    const {
      companyName,
      recruiterName,
      email,
      password,
      companyWebsite,
    } = req.body;

    if (
      !companyName ||
      !recruiterName ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });

    }

    if (!validator.isEmail(email)) {

      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });

    }

    const existingRecruiter =
      await Recruiter.findOne({ email });

    if (existingRecruiter) {

      return res.status(400).json({
        success: false,
        message: "Recruiter already exists.",
      });

    }

    const recruiter =
      await Recruiter.create({

        companyName,

        recruiterName,

        email,

        password,

        companyWebsite,

      });

    const token = jwt.sign(
      {
        id: recruiter._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({

      success: true,

      token,

      recruiter,

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
   Recruiter Login
===================================================== */

export const recruiterLogin = async (req, res) => {
      try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });

    }

    const recruiter = await Recruiter.findOne({
      email,
    });

    if (!recruiter) {

      return res.status(404).json({
        success: false,
        message: "Recruiter not found.",
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      recruiter.password
    );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid password.",
      });

    }

    const token = jwt.sign(
      {
        id: recruiter._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({

      success: true,

      token,

      recruiter,

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
   Recruiter Dashboard
===================================================== */

export const recruiterDashboard = async (req, res) => {

  try {

    const recruiter = await Recruiter.findById(req.user.id)
      .select("-password");

    if (!recruiter) {

      return res.status(404).json({
        success: false,
        message: "Recruiter not found.",
      });

    }

    const totalCandidates = await User.countDocuments();

    const totalInterviews = await Interview.countDocuments();

    const averageScoreData = await Interview.aggregate([
      {
        $group: {
          _id: null,
          average: {
            $avg: "$overallScore",
          },
          best: {
            $max: "$overallScore",
          },
        },
      },
    ]);

    const averageScore =
      averageScoreData.length > 0
        ? Math.round(averageScoreData[0].average)
        : 0;

    const bestScore =
      averageScoreData.length > 0
        ? Math.round(averageScoreData[0].best)
        : 0;

    return res.status(200).json({

      success: true,

      recruiter,

      stats: {

        totalCandidates,

        totalInterviews,

        averageScore,

        bestScore,

      },

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
   Candidate List
===================================================== */

export const getCandidates = async (req, res) => {

  try {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const query = {

      $or: [

        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          email: {
            $regex: search,
            $options: "i",
          },
        },

      ],

    };

    const totalCandidates = await User.countDocuments(query);

    const candidates = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const candidateData = await Promise.all(

      candidates.map(async (candidate) => {

        const interviews = await Interview.find({

          user: candidate._id,

        });

        const totalInterviews = interviews.length;

        const averageScore =
          totalInterviews > 0
            ? Math.round(
                interviews.reduce(
                  (sum, interview) =>
                    sum +
                    Number(interview.overallScore || 0),
                  0
                ) / totalInterviews
              )
            : 0;

        const bestScore =
          totalInterviews > 0
            ? Math.max(
                ...interviews.map((item) =>
                  Number(item.overallScore || 0)
                )
              )
            : 0;

        return {

          _id: candidate._id,

          name: candidate.name,

          email: candidate.email,

          phone: candidate.phone || "",

          profileImage: candidate.profileImage,

          resume: candidate.resume,

          createdAt: candidate.createdAt,

          totalInterviews,

          averageScore,

          bestScore,

          atsScore: averageScore,

          status:
            averageScore >= 80
              ? "Selected"
              : averageScore >= 60
              ? "Pending"
              : "Rejected",

        };

      })

    );

    return res.status(200).json({

      success: true,

      currentPage: page,

      totalPages: Math.ceil(
        totalCandidates / limit
      ),

      totalCandidates,

      candidates: candidateData,

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
   Candidate Details
===================================================== */

export const getCandidateDetails = async (
  req,
  res
) => {
      try {

    const { id } = req.params;

    const candidate = await User.findById(id)
      .select("-password");

    if (!candidate) {

      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });

    }

    const interviews = await Interview.find({
      user: id,
    }).sort({
      createdAt: -1,
    });

    const totalInterviews =
      interviews.length;

    const averageScore =
      totalInterviews > 0
        ? Math.round(
            interviews.reduce(
              (sum, interview) =>
                sum +
                Number(
                  interview.overallScore || 0
                ),
              0
            ) / totalInterviews
          )
        : 0;

    const bestScore =
      totalInterviews > 0
        ? Math.max(
            ...interviews.map((item) =>
              Number(
                item.overallScore || 0
              )
            )
          )
        : 0;

    return res.status(200).json({

      success: true,

      candidate,

      interviews,

      stats: {

        totalInterviews,

        averageScore,

        bestScore,

      },

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};