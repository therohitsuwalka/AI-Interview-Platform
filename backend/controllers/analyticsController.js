import Interview from "../models/Interview.js";
import InterviewSession from "../models/InterviewSession.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import CodingSubmission from "../models/CodingSubmission.js";

/* ==========================================================
   GET /api/analytics/overview
   Aggregated analytics for the logged-in user's dashboard.
========================================================== */
export const getAnalyticsOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    const [interviews, sessions, resumeAnalyses, codingSubmissions] = await Promise.all([
      Interview.find({ user: userId }).sort({ createdAt: 1 }).select(
        "overallScore technical communication confidence grammar createdAt role company"
      ),
      InterviewSession.find({ user: userId, status: "completed" })
        .sort({ createdAt: 1 })
        .select("overallScore answers difficulty createdAt role"),
      ResumeAnalysis.find({ user: userId }).sort({ createdAt: 1 }).select(
        "atsScore matchScore missingSkills mode createdAt"
      ),
      CodingSubmission.find({ user: userId }).sort({ createdAt: 1 }).select(
        "verdict passedCount totalCount language createdAt"
      ),
    ]);

    // ---- Interview score trend (static + adaptive combined) ----
    const interviewTrend = [
      ...interviews.map((i) => ({
        date: i.createdAt,
        score: i.overallScore || 0,
        type: "Mock Interview",
        label: `${i.role || "Interview"}${i.company ? " @ " + i.company : ""}`,
      })),
      ...sessions.map((s) => ({
        date: s.createdAt,
        score: s.overallScore || 0,
        type: "Adaptive Interview",
        label: s.role || "Adaptive Interview",
      })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    // ---- ATS / Resume match score trend ----
    const atsTrend = resumeAnalyses.map((r) => ({
      date: r.createdAt,
      atsScore: r.atsScore || 0,
      matchScore: r.mode === "JD_BASED" ? r.matchScore || 0 : null,
    }));

    // ---- Weak topics: aggregate missing skills + low-scoring adaptive tags ----
    const topicFrequency = {};

    const bump = (map, key, weight = 1) => {
      if (!key) return;
      map[key] = (map[key] || 0) + weight;
    };

    resumeAnalyses.forEach((r) => {
      (r.missingSkills || []).forEach((skill) => bump(topicFrequency, skill));
    });

    const strongTopicFrequency = {};

    sessions.forEach((s) => {
      (s.answers || []).forEach((a) => {
        const tag = a.tags?.[0];
        if (!tag) return;

        if ((a.score || 0) < 50) {
          bump(topicFrequency, tag);
        } else if ((a.score || 0) >= 75) {
          bump(strongTopicFrequency, tag);
        }
      });
    });

    const weakTopics = Object.entries(topicFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic, count]) => ({ topic, count }));

    const strongTopics = Object.entries(strongTopicFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic, count]) => ({ topic, count }));

    // ---- Coding stats ----
    const codingStats = {
      total: codingSubmissions.length,
      accepted: codingSubmissions.filter((c) => c.verdict === "Accepted").length,
      byLanguage: codingSubmissions.reduce((acc, c) => {
        acc[c.language] = (acc[c.language] || 0) + 1;
        return acc;
      }, {}),
    };

    // ---- Summary ----
    const allScores = interviewTrend.map((i) => i.score);
    const averageScore = allScores.length
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    const latestScore = allScores.length ? allScores[allScores.length - 1] : 0;
    const firstScore = allScores.length ? allScores[0] : 0;
    const improvement = allScores.length > 1 ? latestScore - firstScore : 0;

    return res.json({
      success: true,
      summary: {
        totalInterviews: interviewTrend.length,
        totalResumeAnalyses: resumeAnalyses.length,
        totalCodingSubmissions: codingStats.total,
        averageScore,
        latestScore,
        improvement,
      },
      interviewTrend,
      atsTrend,
      weakTopics,
      strongTopics,
      codingStats,
    });
  } catch (error) {
    console.error("Analytics Overview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load analytics.",
      error: error.message,
    });
  }
};
