
import { GoogleGenAI } from "@google/genai";

export const optimizeBio = async (firstName: string, rawBio: string): Promise<string> => {
  try {
    // Correctly initialize with a named parameter using process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Improve and professionalize this member bio for ${firstName}. Keep it concise (max 3 sentences). Bio: "${rawBio}"`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });
    // Access the response text using the property (not a method call)
    return response.text?.trim() || rawBio;
  } catch (error) {
    console.error("Gemini optimization failed", error);
    return rawBio;
  }
};
