import { GoogleGenAI } from "@google/genai";
import { cleanJson } from "../utils/cleanJson.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Review submitted code and return structured feedback:
 * time/space complexity, optimization tips, and (if failing) hints.
 */
export const reviewCode = async ({
  problemTitle,
  language,
  code,
  verdict,
  passedCount,
  totalCount,
}) => {
  const prompt = `
You are a Senior Software Engineer reviewing a candidate's coding-round submission.

Problem: ${problemTitle}
Language: ${language}
Verdict: ${verdict} (${passedCount}/${totalCount} test cases passed)

Candidate's Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON in this exact shape (no markdown, no extra text):
{
  "timeComplexity": "e.g. O(n)",
  "spaceComplexity": "e.g. O(1)",
  "optimization": "1-2 line suggestion to improve the solution (or 'Already optimal' if it is)",
  "codeQuality": "1 line comment on readability/style",
  "hint": "${verdict === "Accepted" ? "empty string, not needed since it passed" : "a helpful hint (not the full answer) pointing toward why it's failing"}"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text =
      typeof response.text === "function" ? await response.text() : response.text;

    return JSON.parse(cleanJson(text));
  } catch (err) {
    console.error("Code review AI failed:", err.message);

    return {
      timeComplexity: "Not available",
      spaceComplexity: "Not available",
      optimization: "AI reviewer temporarily unavailable.",
      codeQuality: "",
      hint: verdict === "Accepted" ? "" : "Re-check your logic against the failing test cases.",
    };
  }
};
