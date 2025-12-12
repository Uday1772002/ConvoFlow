import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateAIResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messages, type = "reply" } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const text = await generateAIResponse(type, {
      messages: messages.map((msg) => ({
        content: msg.content,
        sender: msg.sender || "user",
        isOwnMessage: msg.isOwnMessage || false,
      })),
      currentUserName: body.currentUserName || "You",
    });

    if (type === "reply") {
      // Parse suggestions from response
      const suggestions = text
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .slice(0, 3);

      return NextResponse.json({
        suggestions: suggestions.length > 0 ? suggestions : [text],
      });
    }

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("AI generation error:", error);

    const errorMessage = error?.message || "Failed to generate AI response";
    const status = errorMessage.includes("API key") ? 503 : 500;

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development"
            ? error?.toString()
            : undefined,
      },
      { status }
    );
  }
}
