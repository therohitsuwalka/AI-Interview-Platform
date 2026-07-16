import { GoogleGenAI } from "@google/genai";
import Interview from "../models/Interview.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";


/* ==========================================================
   Generate AI Interview Questions
========================================================== */

export const generateInterview = async (req, res) => {
 
  try {

    const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
    });


    const {
      company,
      role,
      experience,
      difficulty,
      questions,
      analysisId,
      manualSkills,
    } = req.body;

    // resumeAnalysis can be passed directly in the body (legacy) OR
    // looked up from DB via analysisId (preferred - works for both
    // JD-based and resume-only analyses saved during resume upload).
    let resumeAnalysis = req.body.resumeAnalysis || null;

    if (analysisId) {
      const saved = await ResumeAnalysis.findOne({
        _id: analysisId,
        user: req.user.id,
      });

      if (saved) {
        resumeAnalysis = saved;
      }
    }

    const isJDBased = resumeAnalysis?.mode === "JD_BASED";

    // Skills come either from a linked resume analysis, or - for
    // candidates with no resume at all - from skills they typed in
    // manually on the Interview Setup page. These two are independent;
    // a candidate never needs a resume to practice.
    const skillsList = resumeAnalysis?.skills?.length
      ? resumeAnalysis.skills.join(", ")
      : Array.isArray(manualSkills) && manualSkills.length
      ? manualSkills.join(", ")
      : "Not Available";

    const prompt = `
You are a Senior Technical Interviewer.

Generate exactly ${questions} interview questions.

Candidate Details

Company: ${company}

Role: ${role}

Experience: ${experience}

Difficulty: ${difficulty}

Candidate Skills:
${skillsList}

${
  isJDBased
    ? `
This candidate is applying for a SPECIFIC job. Use the job description
context below to make questions targeted to this exact job, not generic.

Job Description:
${resumeAnalysis?.jobDescriptionText || "Not Available"}

Skills Matched With This Job:
${resumeAnalysis?.matchedSkills?.join?.(", ") || "Not Available"}

Skills Missing For This Job (probe these areas to check depth/awareness):
${resumeAnalysis?.missingSkills?.join?.(", ") || "Not Available"}

Resume-to-Job Match Score: ${resumeAnalysis?.matchScore ?? "Not Available"}%
`
    : `
Missing Skills:
${resumeAnalysis?.missingSkills?.join?.(", ") || resumeAnalysis?.missingSkills || "Not Available"}
`
}

Strengths:
${resumeAnalysis?.strengths?.join?.(", ") || resumeAnalysis?.strengths || "Not Available"}

Weaknesses:
${resumeAnalysis?.weaknesses?.join?.(", ") || resumeAnalysis?.weaknesses || "Not Available"}

Rules

1. Mix HR, Technical and Scenario questions.
2. Start easy and increase difficulty gradually.
3. Ask company specific questions whenever possible.
4. Include resume based questions.
${isJDBased ? "5. Prioritize questions that test the missing/weak skills for this specific job." : "5. Don't repeat questions."}
6. Return ONLY a numbered list.
`;

    let response;

try {

  response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

} catch (error) {

  console.log("2.5 Flash Busy. Trying Gemini 2.0 Flash...");

  response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

}

    let text = response.text;

    text = text.replace(/```/g, "").replace(/json/g, "").trim();
    let questionArray = text
      .split("\n")
      .map((question) => question.replace(/^\d+\.\s*/, "").trim())
      .filter((question) => question.length > 0);

    // Fallback Questions
    if (questionArray.length === 0) {
      questionArray = [
        "Tell me about yourself.",
        "Explain your final year project.",
        "What are your strengths?",
        "Explain React Virtual DOM.",
        "Difference between SQL and NoSQL.",
        "What is JWT Authentication?",
        "How does REST API work?",
        "Explain a challenging bug you solved.",
        "Why should we hire you?",
        "Do you have any questions for us?",
      ];
    }

    return res.status(200).json({
      success: true,

      totalQuestions: questionArray.length,

      questions: questionArray,
    });
  } catch (error) {
    console.error("Generate Interview Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to generate interview.",

      error: error.message,
    });
  }
};

/* ==========================================================
   Evaluate Interview
========================================================== */

export const evaluateInterview = async (req, res) => {


  try {

    const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
    });

    const {
      answers,

      interviewData,
    } = req.body;

    // ----------------------------------------------------
// Validate Empty Answers
// ----------------------------------------------------

const hasValidAnswer = answers.some(
  (item) =>
    item.answer &&
    item.answer.trim().length > 0
);

if (!hasValidAnswer) {

  const evaluation = {

    overallScore: 0,

    technical: 0,

    communication: 0,

    confidence: 0,

    grammar: 0,

    recommendation: "Unable to Evaluate",

    feedback:
      "No answers were submitted during the interview.",

    strengths: [],

    weaknesses: [
      "Candidate did not answer any interview question."
    ],

    improvements: [
      "Answer the interview questions to receive AI evaluation."
    ]

  };

  const interview = await Interview.create({
  user: req.user.id,

  resumeAnalysis: interviewData.analysisId || undefined,

  company: interviewData.company,

  role: interviewData.role,

  experience: interviewData.experience,

  difficulty: interviewData.difficulty,

  answers,

  transcript: answers
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n"),

  overallScore: evaluation.overallScore,

  communication: evaluation.communication,

  technical: evaluation.technical,

  confidence: evaluation.confidence,

  grammar: evaluation.grammar,

  feedback: evaluation.feedback,

  status: "Completed",
});

  return res.status(200).json({

    success: true,

    evaluation,

    interview,

  });

}

    if (!answers || answers.length === 0) {
      return res.status(400).json({
        success: false,

        message: "Interview answers are required.",
      });
    }

    const prompt = `
You are an expert Senior Technical Interviewer.

Evaluate the following interview professionally.

Role:
${interviewData?.role}

Company:
${interviewData?.company}

Candidate Answers:

${JSON.stringify(answers, null, 2)}

Return ONLY valid JSON in the following format.

{
  "overallScore": 90,
  "technical": 88,
  "communication": 91,
  "confidence": 89,
  "grammar": 92,
  "recommendation": "Selected",
  "feedback": "Overall interview feedback here.",
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "weaknesses": [
    "Weakness 1",
    "Weakness 2"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2",
    "Improvement 3"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: prompt,
    });

    

   let result = "";

if (typeof response.text === "function") {
  result = await response.text();
} else {
  result = response.text;
}

result = result
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log("========== AI EVALUATION ==========");
console.log(result);
console.log("==================================");

    let evaluation;

    try {
      evaluation = JSON.parse(result);
      console.log("Evaluation Parsed Successfully");
    } catch (parseError) {
      console.error("========== JSON PARSE ERROR ==========");
console.error(parseError);
console.log(result);
console.error("======================================");

      evaluation = {
        overallScore: 75,
        technical: 72,
        communication: 80,
        confidence: 78,
        grammar: 82,
        recommendation: "Needs Improvement",
        feedback: "Unable to parse AI response. Showing fallback evaluation.",
        strengths: ["Good communication"],
        weaknesses: ["Technical depth"],
        improvements: [
          "Practice DSA",
          "Improve project explanations",
          "Revise core subjects",
        ],
      };
    }
    // ------------------------------------------
    // Save Interview Result
    // ------------------------------------------

    console.log("===== DATA GOING TO DB =====");
    console.log(
      JSON.stringify(
        {
          company: interviewData?.company,
          role: interviewData?.role,
          experience: interviewData?.experience,
          difficulty: interviewData?.difficulty,
          answers,
        },
        null,
        2,
      ),
    );

   const interview = await Interview.create({

  // Logged-in User
  user: req.user.id,

  resumeAnalysis: interviewData.analysisId || undefined,

  company: interviewData.company,

  role: interviewData.role,

  experience: interviewData.experience,

  difficulty: interviewData.difficulty,

  answers,

  transcript: answers
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n"),

  overallScore: evaluation.overallScore,

  communication: evaluation.communication,

  technical: evaluation.technical,

  confidence: evaluation.confidence,

  grammar: evaluation.grammar,

  feedback: evaluation.feedback,

  status: "Completed",

});

    return res.status(200).json({
      success: true,

      message: "Interview evaluated successfully.",

      interview,

      evaluation,
    });
  } catch (error) {
    console.error("Evaluate Interview Error:", error);

    return res.status(500).json({
      success: false,

      message: "Interview evaluation failed.",

      error: error.message,
    });
  }
};
/* ==========================================================
   Get Interview History
========================================================== */

export const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({

  user: req.user.id,
    })

      .sort({ createdAt: -1 })

      .select(
        "company role overallScore communication technical confidence grammar status createdAt",
      );

    return res.status(200).json({
      success: true,

      count: interviews.length,

      interviews,
    });
  } catch (error) {
    console.error("Get Interview History Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch interview history.",

      error: error.message,
    });
  }
};
/* ==========================================================
   Get Single Interview
========================================================== */

export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,

        message: "Interview not found.",
      });
    }

    return res.status(200).json({
      success: true,

      interview,
    });
  } catch (error) {
    console.error("Get Interview Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch interview.",

      error: error.message,
    });
  }
};