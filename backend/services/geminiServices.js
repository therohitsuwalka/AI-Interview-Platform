import { GoogleGenAI } from "@google/genai";



export async function generateAIContent(prompt) {
  try {

    const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
    });


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

    return text;

  } catch (error) {

    console.error("\n========== GEMINI ERROR ==========");
    console.error(error);
    console.error("==================================\n");

    throw error;
  }
}
import { generateAIContent } from "./geminiService.js";
import { extractSkills } from "../utils/skillExtractor.js";
import { calculateATSScore } from "../utils/atsScore.js";
import { getMissingSkills } from "../utils/missingSkills.js";

export const analyzeResume = async (
  resumeText,
  role = "Full Stack Developer"
) => {
  try {
    const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume professionally.

Return ONLY valid JSON.

{
  "atsScore":90,
  "skills":["React","Node.js"],
  "missingSkills":["Docker"],
  "strengths":["Strong Projects"],
  "weaknesses":["No Internship"],
  "suggestions":["Learn Docker"]
}

Resume:

${resumeText}
`;

    const text = await generateAIContent(prompt);

    return text;

  } catch (error) {

    console.log("Gemini Failed. Using Smart ATS Engine...");

    const skills = extractSkills(resumeText);

    const score = calculateATSScore(
      resumeText,
      skills
    );

    const missing = getMissingSkills(
      role,
      skills
    );

    const analysis = {

      atsScore: score,

      skills,

      missingSkills: missing,

      strengths: [
        "Resume parsed successfully",
        "Technical skills detected",
        "ATS compatible structure"
      ],

      weaknesses: [
        "Improve quantified achievements",
        "Add certifications",
        "Mention internship experience"
      ],

      suggestions: [
        "Add GitHub Profile",
        "Add LinkedIn Profile",
        "Include Docker & Cloud Skills",
        "Add measurable achievements"
      ],

      source: "Smart ATS Engine"

    };

    return JSON.stringify(analysis);

  }

};