import { extractResumeText } from "../utils/resumeParser.js";
import { analyzeResume } from "../services/atsService.js";
import { cleanJson } from "../utils/cleanJson.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

/**
 * POST /api/resume/upload
 *
 * Accepts (multipart/form-data):
 *  - resume        : file (required)  -> field name "resume"
 *  - jdFile         : file (optional) -> field name "jdFile"
 *  - jobDescription : text (optional) -> pasted JD text
 *  - targetRole     : text (optional)
 *  - autoDetectRole : "true" | "false"
 */
export const uploadResume = async (req, res) => {
  try {
    const resumeFile = req.files?.resume?.[0] || req.file;

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "Resume not uploaded",
      });
    }

    // ---- Resume text ----
    const resumeText = await extractResumeText(resumeFile.path);

    // ---- Job Description (optional): file takes priority over pasted text ----
    const jdFile = req.files?.jdFile?.[0];

    let jobDescription = req.body.jobDescription?.trim() || "";

    if (jdFile) {
      jobDescription = await extractResumeText(jdFile.path);
    }

    const hasJD = jobDescription.trim().length > 0;

    // ---- Frontend data ----
    const autoDetectRole = req.body.autoDetectRole === "true";
    const targetRole = req.body.targetRole?.trim();

    // Decide which benchmark AI should use when there's no JD
    let selectedRole = "AUTO_DETECT";

    if (!autoDetectRole && targetRole) {
      selectedRole = targetRole;
    }

    // ---- AI Analysis ----
    const aiResponse = await analyzeResume(
      resumeText,
      selectedRole,
      jobDescription
    );

    const cleaned = cleanJson(aiResponse);

    let analysis;

    try {
      analysis = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({
        success: false,
        message: "Invalid AI response",
        raw: cleaned,
      });
    }

    // ---- Save analysis (only when user is authenticated) ----
    let savedAnalysis = null;

    if (req.user?.id) {
      savedAnalysis = await ResumeAnalysis.create({
        user: req.user.id,
        resumeFileUrl: resumeFile.path,
        resumeText,
        mode: hasJD ? "JD_BASED" : "RESUME_ONLY",
        targetRole: targetRole || "",
        jobDescriptionText: jobDescription,
        atsScore: analysis.atsScore || 0,
        matchScore: analysis.matchScore || 0,
        skills: analysis.skills || [],
        matchedSkills: analysis.matchedSkills || [],
        missingSkills: analysis.missingSkills || [],
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        suggestions: analysis.suggestions || [],
        suitableRoles: analysis.suitableRoles || [],
        summary: analysis.summary || "",
      });
    }

    return res.json({
      success: true,
      message: "Resume analyzed successfully",
      mode: hasJD ? "JD_BASED" : "RESUME_ONLY",
      analysis,
      analysisId: savedAnalysis?._id || null,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/resume/analysis/:id
 * Fetch a previously saved resume analysis (used to seed an interview).
 */
export const getResumeAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    return res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/resume/history
 * List all past resume analyses for the logged-in user (most recent first).
 */
export const getResumeHistory = async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-resumeText -jobDescriptionText");

    return res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
