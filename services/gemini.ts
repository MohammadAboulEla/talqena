import { GoogleGenAI } from "@google/genai";

// This service is used to "Enhance" the user's prompt using Gemini.
// It requires the API Key to be present in the environment.

const apiKey = process.env.API_KEY;

export const enhancePromptContent = async (originalContent: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Cannot use Gemini enhancement.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert Prompt Engineer. Rewrite the following prompt to be more effective, clear, and structured for a Large Language Model. Keep the core intent but improve the phrasing. 
      
      Original Prompt: "${originalContent}"
      
      Output ONLY the improved prompt text. Do not add explanations.`,
    });

    return response.text || originalContent;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};