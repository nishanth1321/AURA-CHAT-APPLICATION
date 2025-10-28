
import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAiInstance = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

export const createAiChatSession = (): Chat => {
  const gemini = getAiInstance();
  return gemini.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a friendly and helpful chat assistant named Gemini. Keep your responses concise and conversational.',
    },
  });
};

export const sendMessageToAi = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};
