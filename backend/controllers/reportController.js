import Interview from "../models/Interview.js";
import InterviewSession from "../models/InterviewSession.js";
import User from "../models/User.js";
import {
  generateInterviewReportPDF,
  generateAdaptiveReportPDF,
} from "../services/pdfService.js";

/* ==========================================================
   GET /api/report/interview/:id
   Static interview report as downloadable PDF
========================================================== */
export const downloadInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    const user = await User.findById(req.user.id);

    const doc = generateInterviewReportPDF(interview, user?.name);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="interview-report-${interview._id}.pdf"`
    );

    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("Download Interview Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate report.",
      error: error.message,
    });
  }
};

/* ==========================================================
   GET /api/report/adaptive/:id
   Adaptive interview session report as downloadable PDF
========================================================== */
export const downloadAdaptiveReport = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found.",
      });
    }

    const user = await User.findById(req.user.id);

    const doc = generateAdaptiveReportPDF(session, user?.name);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="adaptive-interview-report-${session._id}.pdf"`
    );

    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("Download Adaptive Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate report.",
      error: error.message,
    });
  }
};
