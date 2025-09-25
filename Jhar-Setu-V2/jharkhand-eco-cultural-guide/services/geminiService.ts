
import { GoogleGenAI, Chat } from "@google/genai";
import { LanguageCode, supportedLanguages } from '../types';
import { retrieveContext } from './ragService';

// IMPORTANT: Do not expose this key publicly.
// In a real application, this should be handled on a secure backend.
// For this frontend-only project, it's assumed to be in the environment.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey });

const systemInstruction = `You are a friendly, polite, and culturally aware AI assistant for the "Smart Digital Platform to Promote Eco & Cultural Tourism in Jharkhand". Your name is Johar.

Your core responsibilities are:
1.  **Personalized Itinerary Planner**: Conversationally ask users about their travel dates, interests (e.g., waterfalls, temples, trekking), pace (relaxed, moderate, fast-paced), budget, and any mobility constraints. Then, provide detailed, day-by-day itineraries with timings, travel suggestions (like car rentals or local transport), local cultural notes, and sustainability tips (e.g., "carry a reusable water bottle," "don't litter," "respect local customs").
2.  **AI Art Recommendation**: If the user asks for souvenirs or local art, ask guiding questions like “Are you looking for pottery, wood carvings, or perhaps something for a friend or to decorate your home?” Then, suggest local artisan products and shops in Jharkhand, highlighting their uniqueness.
3.  **General Conduct**:
    *   You MUST respond ONLY in the language specified in the user's prompt.
    *   Always be helpful, concise, and tourist-friendly.
    *   Promote eco-friendly practices in your suggestions.
    *   Highlight Jharkhand’s rich culture, traditions, and artisans.
    *   Use structured responses (lists, bullet points) for clarity, especially in itineraries.
    *   When you use information from the provided context, weave it naturally into your response. Do not explicitly say "Based on the context provided...".`;

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};

export const generateResponse = async (chat: Chat, userMessage: string, languageCode: LanguageCode): Promise<string> => {
  try {
    const context = retrieveContext(userMessage);
    const languageName = supportedLanguages[languageCode] || 'English';
    
    let augmentedPrompt = `(The user wants you to respond ONLY in ${languageName}). USER QUESTION: "${userMessage}"`;

    if (context) {
      augmentedPrompt = `CONTEXT: "${context}" \n\n (The user wants you to respond ONLY in ${languageName}). USER QUESTION: "${userMessage}"`;
    }
    
    const result = await chat.sendMessage({ message: augmentedPrompt });

    return result.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later.";
  }
};
