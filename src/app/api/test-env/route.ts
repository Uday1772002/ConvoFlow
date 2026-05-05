import { NextRequest, NextResponse } from "next/server";

// This endpoint is only available in development to check basic config status.
// It intentionally does NOT expose key values or prefixes.
export async function GET(_request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasDbUrl: !!process.env.DATABASE_URL,
    hasAuthSecret: !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    nodeEnv: process.env.NODE_ENV,
  });
}
