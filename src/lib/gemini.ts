import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface AIContext {
  messages?: Array<{ sender: string; content: string; isOwnMessage?: boolean }>;
  currentUserName?: string;
  currentMessage?: string;
}

export async function generateAIResponse(
  type: string,
  context: AIContext
): Promise<string> {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Using gemini-2.5-flash (latest model)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    let prompt = "";

    switch (type) {
      case "reply":
        const recentMessages = context.messages?.slice(-5) || [];
        const messageHistory = recentMessages
          .map((m) => `${m.sender}: ${m.content}`)
          .join("\n");
        const lastMessage = recentMessages[recentMessages.length - 1];
        
        // If the user sent the last message, suggest what the other person might reply
        // If someone else sent it, suggest what the user might reply
        if (lastMessage?.isOwnMessage) {
          const userName = context.currentUserName || "You";
          prompt = `You are helping predict possible replies in a chat conversation. Here's the recent conversation:

${messageHistory}

${userName} just sent: "${lastMessage?.content}"

Generate 3 brief, natural reply suggestions (1-2 sentences each) that the OTHER person in the conversation might send back. Make them conversational and relevant responses to what ${userName} just said. Return each suggestion on a new line.`;
        } else {
          prompt = `You are helping someone reply in a chat conversation. Here's the recent conversation:

${messageHistory}

${lastMessage?.sender} just said: "${lastMessage?.content}"

Generate 3 brief, natural reply suggestions (1-2 sentences each) that you could send back. Make them conversational and relevant to what was just said. Return each suggestion on a new line.`;
        }
        break;

      case "improve":
        prompt = `Improve this message to be more clear, professional, and grammatically correct:\n\n"${context.currentMessage}"\n\nProvide only the improved version, no explanations.`;
        break;

      case "summary":
        const allMessages = context.messages || [];
        const conversationText = allMessages.map((m) => m.content).join("\n");
        prompt = `Summarize this conversation in 2-3 sentences:\n\n${conversationText}`;
        break;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Gemini AI error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      error: error,
    });

    if (error instanceof Error && error.message?.includes("API key")) {
      throw new Error("Invalid or missing Gemini API key");
    }

    throw new Error(
      `Failed to generate AI response: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
