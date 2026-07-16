import {
  getProblemSummaries,
  getProblemPublic,
  getProblemFull,
} from "../data/codingProblems.js";
import { runAgainstTestCases, SUPPORTED_LANGUAGES } from "../services/judgeService.js";
import { reviewCode } from "../services/codeReviewService.js";
import CodingSubmission from "../models/CodingSubmission.js";

/* ==========================================================
   GET /api/coding/problems
========================================================== */
export const listProblems = (req, res) => {
  return res.json({
    success: true,
    languages: SUPPORTED_LANGUAGES,
    problems: getProblemSummaries(),
  });
};

/* ==========================================================
   GET /api/coding/problems/:id
========================================================== */
export const getProblem = (req, res) => {
  const problem = getProblemPublic(req.params.id);

  if (!problem) {
    return res.status(404).json({
      success: false,
      message: "Problem not found.",
    });
  }

  return res.json({
    success: true,
    problem,
  });
};

/* ==========================================================
   POST /api/coding/run
   Body: { problemId, language, code }
   Runs against SAMPLE test cases only.
========================================================== */
export const runCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: "problemId, language and code are required.",
      });
    }

    const problem = getProblemFull(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found.",
      });
    }

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported language. Choose from: ${SUPPORTED_LANGUAGES.join(", ")}`,
      });
    }

    const result = await runAgainstTestCases({
      language,
      code,
      testCases: problem.sampleTestCases,
      exposeInput: true,
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Run Code Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to run code. The judge service may be temporarily unavailable.",
      error: error.message,
    });
  }
};

/* ==========================================================
   POST /api/coding/submit
   Body: { problemId, language, code, timeTakenSeconds }
   Runs against SAMPLE + HIDDEN test cases, saves the submission.
========================================================== */
export const submitCode = async (req, res) => {
  try {
    const { problemId, language, code, timeTakenSeconds } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: "problemId, language and code are required.",
      });
    }

    const problem = getProblemFull(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found.",
      });
    }

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported language. Choose from: ${SUPPORTED_LANGUAGES.join(", ")}`,
      });
    }

    const allTestCases = [...problem.sampleTestCases, ...problem.hiddenTestCases];

    const result = await runAgainstTestCases({
      language,
      code,
      testCases: allTestCases,
      exposeInput: false,
    });

    let verdict = "Wrong Answer";

    const hasCompileError = result.results.some((r) => r.error === "Compilation Error");

    if (hasCompileError) {
      verdict = "Compilation Error";
    } else if (result.passedCount === result.totalCount) {
      verdict = "Accepted";
    } else if (result.passedCount > 0) {
      verdict = "Partial";
    }

    const submission = await CodingSubmission.create({
      user: req.user.id,
      problemId: problem.id,
      problemTitle: problem.title,
      language,
      code,
      verdict,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
      timeTakenSeconds: timeTakenSeconds || 0,
    });

    // AI code review runs after the DB write so a slow/unavailable AI
    // call never blocks the submission itself from being recorded.
    const aiReview = await reviewCode({
      problemTitle: problem.title,
      language,
      code,
      verdict,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
    });

    submission.aiFeedback = JSON.stringify(aiReview);
    await submission.save();

    return res.json({
      success: true,
      verdict,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
      // Only reveal per-test-case pass/fail (not the hidden input/output)
      results: result.results.map((r) => ({ passed: r.passed, error: r.error || null })),
      submissionId: submission._id,
      aiReview,
    });
  } catch (error) {
    console.error("Submit Code Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit code. The judge service may be temporarily unavailable.",
      error: error.message,
    });
  }
};

/* ==========================================================
   GET /api/coding/history
========================================================== */
export const getCodingHistory = async (req, res) => {
  try {
    const submissions = await CodingSubmission.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-code");

    return res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Get Coding History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch coding history.",
      error: error.message,
    });
  }
};
