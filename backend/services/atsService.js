import { GoogleGenAI } from "@google/genai";
import { extractSkills } from "../utils/skillExtractor.js";
import { calculateATSScore } from "../utils/atsScore.js";
import { getMissingSkills } from "../utils/missingSkills.js";

/**
 * Analyze a resume, optionally against a Job Description (JD).
 *
 * If `jobDescription` is provided -> AI compares resume vs JD and
 * returns a match score + matched/missing skills specific to that JD.
 *
 * If `jobDescription` is NOT provided -> AI gives a general resume
 * analysis (optionally benchmarked against `role` if one was given).
 */
export const analyzeResume = async (
  resumeText,
  role = "AUTO_DETECT",
  jobDescription = ""
) => {
  const hasJD = Boolean(jobDescription && jobDescription.trim().length > 0);

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = hasJD
      ? `
You are an expert ATS (Applicant Tracking System) + Technical Recruiter.

Compare the CANDIDATE RESUME against the JOB DESCRIPTION below and
tell the candidate exactly how well they fit this specific job.

Return ONLY valid JSON in this exact shape (no markdown, no extra text):

{
  "atsScore": 78,
  "matchScore": 65,
  "skills": ["React", "Node.js"],
  "matchedSkills": ["React", "Node.js"],
  "missingSkills": ["Docker", "AWS"],
  "strengths": ["Strong frontend projects"],
  "weaknesses": ["No cloud/deployment experience"],
  "suggestions": ["Learn Docker and deploy one project on AWS"],
  "suitableRoles": ["Frontend Developer"],
  "summary": "2-3 line summary of fit for this specific job"
}

Rules:
- "matchScore" = how well this resume fits THIS job description (0-100).
- "matchedSkills" = skills required by the JD that ARE present in the resume.
- "missingSkills" = skills required by the JD that are NOT present in the resume.
- Be specific and honest, not generic.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}
`
      : `
You are an expert ATS (Applicant Tracking System) Resume Analyzer.

No specific job description was provided, so analyze the resume on
its own merits and suggest which roles it is best suited for.

Return ONLY valid JSON in this exact shape (no markdown, no extra text):

{
  "atsScore": 90,
  "matchScore": 0,
  "skills": ["React"],
  "matchedSkills": [],
  "missingSkills": ["Docker"],
  "strengths": ["Strong Projects"],
  "weaknesses": ["No Internship"],
  "suggestions": ["Learn Docker"],
  "suitableRoles": ["Frontend Developer", "Full Stack Developer"],
  "summary": "2-3 line overall summary of this resume"
}

${role && role !== "AUTO_DETECT" ? `The candidate is targeting the role: ${role}. Benchmark "missingSkills" against skills typically required for that role.` : ""}

RESUME:
${resumeText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = "";

    if (typeof response.text === "function") {
      text = await response.text();
    } else {
      text = response.text;
    }

    console.log("========== GEMINI SUCCESS ==========");
    console.log(text);
    console.log("====================================");

    return text;
  } catch (error) {
    console.log("\n========== GEMINI ERROR ==========");
    console.error(error);
    console.log("==================================\n");

    console.log("Gemini Failed. Using Smart ATS Engine (offline fallback)...");

    const skills = extractSkills(resumeText);
    const score = calculateATSScore(resumeText, skills);
    const detectedAnything = skills.length > 0;

    if (hasJD) {
      // Offline fallback: extract "required" skills straight from the JD
      // text itself and diff them against the resume's skills.
      const jdSkills = extractSkills(jobDescription);

      const matchedSkills = jdSkills.filter((s) => skills.includes(s));
      const missingSkills = jdSkills.filter((s) => !skills.includes(s));

      const matchScore = jdSkills.length
        ? Math.round((matchedSkills.length / jdSkills.length) * 100)
        : 0;

      return JSON.stringify({
        atsScore: score,
        matchScore,
        skills,
        matchedSkills,
        missingSkills,
        strengths: matchedSkills.length
          ? [`Matches ${matchedSkills.length} skill(s) required by this job`]
          : ["Resume parsed successfully"],
        weaknesses: jdSkills.length
          ? missingSkills.length
            ? [`Missing ${missingSkills.length} skill(s) required by this job`]
            : ["No major gaps detected against this job description"]
          : [
              "Our AI reviewer is temporarily unavailable, so we couldn't confidently extract requirements from this job description. Please try again shortly for a full analysis.",
            ],
        suggestions: missingSkills.map((s) => `Learn/highlight ${s} to better match this job`),
        suitableRoles: [],
        summary: jdSkills.length
          ? `Offline match engine estimates a ${matchScore}% skill match with this job description.`
          : "Our AI reviewer is temporarily unavailable. This is a limited offline estimate - please try again shortly for a complete analysis.",
        source: "Smart ATS Engine (offline, limited accuracy)",
      });
    }

    const missing = getMissingSkills(role, skills);

    return JSON.stringify({
      atsScore: score,
      matchScore: 0,
      skills,
      matchedSkills: [],
      missingSkills: missing,
      strengths: detectedAnything
        ? ["Resume parsed successfully", "Relevant keywords detected", "ATS compatible structure"]
        : ["Resume parsed successfully"],
      weaknesses: detectedAnything
        ? ["Improve quantified achievements", "Add certifications", "Mention relevant experience"]
        : [
            "Our AI reviewer is temporarily unavailable and the offline engine couldn't confidently identify your field from this resume. Please try again shortly for an accurate analysis.",
          ],
      suggestions: detectedAnything
        ? [
            "Add measurable, quantified achievements",
            "Include relevant certifications",
            "Add a LinkedIn profile link",
          ]
        : ["Please retry once our AI service is back online for personalized suggestions."],
      suitableRoles: [],
      summary: detectedAnything
        ? "Offline analysis based on detected keywords and resume structure. For best accuracy, please retry when our AI service is available."
        : "Our AI reviewer is temporarily unavailable. Please try again shortly for a complete, personalized analysis.",
      source: "Smart ATS Engine (offline, limited accuracy)",
    });
  }
};