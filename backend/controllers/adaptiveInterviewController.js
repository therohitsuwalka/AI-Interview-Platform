import { GoogleGenAI } from "@google/genai";
import InterviewSession from "../models/InterviewSession.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import { cleanJson } from "../utils/cleanJson.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const FALLBACK_QUESTIONS = [
  "Tell me about yourself and your recent projects.",
  "Explain a challenging technical problem you solved recently.",
  "What are your strengths and weaknesses as a developer?",
  "Explain the difference between synchronous and asynchronous code.",
  "How do you approach debugging a production issue?",
];

/* ==========================================================
   Start Adaptive Interview
   Creates an InterviewSession and returns the first question.
========================================================== */
export const startAdaptiveInterview = async (req, res) => {
  try {
    const {
      role,
      company,
      experience,
      difficulty,
      analysisId,
      totalQuestions,
    } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required to start an adaptive interview.",
      });
    }

    let resumeAnalysis = null;

    if (analysisId) {
      resumeAnalysis = await ResumeAnalysis.findOne({
        _id: analysisId,
        user: req.user.id,
      });
    }

    const session = await InterviewSession.create({
      user: req.user.id,
      resumeAnalysis: resumeAnalysis?._id || undefined,
      role,
      company: company || "",
      experience: experience || "Fresher",
      difficulty: difficulty || "Medium",
      totalQuestions: totalQuestions || 8,
      status: "started",
      currentQuestion: 0,
    });

    const prompt = `
You are a Senior Technical Interviewer starting a NEW adaptive interview.

Role: ${role}
Company: ${company || "Not specified"}
Experience: ${experience || "Fresher"}
Starting Difficulty: ${session.difficulty}

${
  resumeAnalysis
    ? `Resume Skills: ${resumeAnalysis.skills?.join(", ") || "N/A"}
${resumeAnalysis.mode === "JD_BASED" ? `Job Description Context: ${resumeAnalysis.jobDescriptionText?.slice(0, 800) || "N/A"}
Missing Skills For This Job: ${resumeAnalysis.missingSkills?.join(", ") || "N/A"}` : `Missing Skills: ${resumeAnalysis.missingSkills?.join(", ") || "N/A"}`}`
    : "No resume analysis available - ask a general opening question for this role."
}

Generate exactly ONE opening interview question (not too easy, not too hard - matched to "${session.difficulty}").
Return ONLY the question text, nothing else, no numbering, no quotes.
`;

    let question = "";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      question =
        typeof response.text === "function"
          ? await response.text()
          : response.text;

      question = question.replace(/```/g, "").trim();
    } catch (err) {
      console.error("Gemini start question failed, using fallback:", err.message);
      question = FALLBACK_QUESTIONS[0];
    }

    return res.status(200).json({
      success: true,
      sessionId: session._id,
      question,
      difficulty: session.difficulty,
      questionNumber: 1,
      totalQuestions: session.totalQuestions,
    });
  } catch (error) {
    console.error("Start Adaptive Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start adaptive interview.",
      error: error.message,
    });
  }
};

/* ==========================================================
   Submit Answer -> Evaluate -> Decide -> Next Question
========================================================== */
export const submitAdaptiveAnswer = async (req, res) => {
  try {
    const { sessionId, question, answer } = req.body;

    if (!sessionId || !question) {
      return res.status(400).json({
        success: false,
        message: "sessionId and question are required.",
      });
    }

    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.user.id,
    }).populate("resumeAnalysis");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found.",
      });
    }

    const isComplete = session.answers.length + 1 >= session.totalQuestions;

    const recentHistory = session.answers
      .slice(-3)
      .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
      .join("\n\n");

    const prompt = `
You are a Senior Technical Interviewer conducting an ADAPTIVE interview.

Role: ${session.role} | Company: ${session.company || "N/A"} | Experience: ${session.experience}
Current Difficulty: ${session.difficulty}

Recent conversation:
${recentHistory || "None yet"}

Current Question:
${question}

Candidate's Answer:
${answer && answer.trim().length > 0 ? answer : "(No answer given / skipped)"}

Evaluate the answer and decide what comes next.

Return ONLY valid JSON in this exact shape:
{
  "score": 72,
  "verdict": "strong" | "average" | "weak",
  "feedback": "1-2 line feedback on this specific answer",
  "decision": "easy_follow_up" | "hard_follow_up" | "cross_question" | "next_topic",
  "nextDifficulty": "Easy" | "Medium" | "Hard",
  "topic": "short topic label e.g. React Hooks",
  ${isComplete ? `"nextQuestion": null` : `"nextQuestion": "the next interview question text"`}
}

Rules:
- If the answer is weak/incomplete -> decision "easy_follow_up" and lower difficulty.
- If the answer is strong -> decision "hard_follow_up" or "cross_question" (dig deeper into the same claim) and raise difficulty.
- If the topic feels exhausted -> decision "next_topic" and move to a new area relevant to the role.
- Never repeat a previously asked question.
${isComplete ? "- This is the LAST question of the interview, so nextQuestion MUST be null." : ""}
`;

    let parsed;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text =
        typeof response.text === "function"
          ? await response.text()
          : response.text;

      parsed = JSON.parse(cleanJson(text));
    } catch (err) {
      console.error("Gemini evaluate/next failed, using fallback:", err.message);

      const answered = session.answers.length;
      parsed = {
        score: answer && answer.trim().length > 20 ? 60 : 30,
        verdict: answer && answer.trim().length > 20 ? "average" : "weak",
        feedback: "Unable to reach AI evaluator, showing a fallback assessment.",
        decision: "next_topic",
        nextDifficulty: session.difficulty,
        topic: "General",
        nextQuestion: isComplete
          ? null
          : FALLBACK_QUESTIONS[(answered + 1) % FALLBACK_QUESTIONS.length],
      };
    }

    // Persist this Q&A turn
    session.answers.push({
      question,
      answer: answer || "",
      aiFeedback: parsed.feedback || "",
      followUpQuestion: parsed.nextQuestion || "",
      score: parsed.score || 0,
      difficulty: session.difficulty,
      tags: parsed.topic ? [parsed.topic] : [],
      skipped: !answer || answer.trim().length === 0,
    });

    session.difficulty = parsed.nextDifficulty || session.difficulty;
    session.currentQuestion += 1;

    if (isComplete) {
      session.status = "completed";
      session.endedAt = new Date();

      const scores = session.answers.map((a) => a.score || 0);
      session.overallScore = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    }

    await session.save();

    return res.status(200).json({
      success: true,
      evaluation: {
        score: parsed.score,
        verdict: parsed.verdict,
        feedback: parsed.feedback,
      },
      decision: parsed.decision,
      difficulty: session.difficulty,
      topic: parsed.topic,
      nextQuestion: parsed.nextQuestion || null,
      questionNumber: session.answers.length + (isComplete ? 0 : 1),
      totalQuestions: session.totalQuestions,
      isComplete,
      overallScore: isComplete ? session.overallScore : undefined,
    });
  } catch (error) {
    console.error("Submit Adaptive Answer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process answer.",
      error: error.message,
    });
  }
};

/* ==========================================================
   Finish Adaptive Interview (manual end / summary)
========================================================== */
export const finishAdaptiveInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found.",
      });
    }

    if (session.status !== "completed") {
      const scores = session.answers.map((a) => a.score || 0);

      session.overallScore = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

      session.status = "completed";
      session.endedAt = new Date();

      await session.save();
    }

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Finish Adaptive Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to finish interview.",
      error: error.message,
    });
  }
};

/* ==========================================================
   Get Adaptive Interview History
========================================================== */
export const getAdaptiveHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("role company difficulty overallScore status createdAt totalQuestions");

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Get Adaptive History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history.",
      error: error.message,
    });
  }
};

/* ==========================================================
   Get Single Adaptive Session (full report)
========================================================== */
export const getAdaptiveSessionById = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Get Adaptive Session Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch session.",
      error: error.message,
    });
  }
};

// Legacy endpoint kept for backward compatibility (not used by the
// current frontend flow anymore - use start/submit instead).
export const getNextQuestion = async (req, res) => {
  try {
    const { role, company, experience, difficulty, previousQuestion, previousAnswer, resumeAnalysis } =
      req.body;

    const prompt = `
You are an expert Senior Technical Interviewer.
Generate ONLY ONE interview question.

Role: ${role}
Company: ${company}
Experience: ${experience}
Difficulty: ${difficulty}
Resume Skills: ${resumeAnalysis?.skills?.join(", ") || "Not Available"}
Previous Question: ${previousQuestion || "None"}
Candidate Answer: ${previousAnswer || "None"}

Rules
1. Generate exactly ONE question.
2. Never repeat previous question.
3. If answer was good increase difficulty.
4. If answer was weak reduce difficulty.
5. Return plain text only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let question =
      typeof response.text === "function" ? await response.text() : response.text;

    question = question.replace(/```/g, "").trim();

    return res.status(200).json({ success: true, question });
  } catch (error) {
    console.error(error);
    return res.json({
      success: true,
      question: FALLBACK_QUESTIONS[0],
      fallback: true,
    });
  }
};
