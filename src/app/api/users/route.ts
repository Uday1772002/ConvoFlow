import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import mongoose from "mongoose";
import type { UserDocument } from "@/types/mongoose";

// GET - Search users (excluding current user)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q") || "";

    // Cap query length and escape special regex characters to prevent ReDoS attacks
    const query = rawQuery.slice(0, 100);
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Convert string ID to ObjectId
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { name: { $regex: safeQuery, $options: "i" } },
        { email: { $regex: safeQuery, $options: "i" } },
      ],
    })
      .select("name email image")
      .limit(20)
      .lean();

    const formattedUsers = users.map((user: UserDocument) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
