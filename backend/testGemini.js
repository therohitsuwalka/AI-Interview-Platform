import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
console.log(process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

try {

  const response = await ai.models.generateContent({

    model: "gemini-2.5-flash",

    contents: "Say Hello from Gemini"

  });

  console.log("SUCCESS");
  console.log(response.text);

} catch (err) {

  console.log("FAILED");
  console.error(err);

}
