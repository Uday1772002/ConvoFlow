import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Message, User } from "@/lib/models";

interface RouteParams {
  params: Promise<{
    conversationId: string;
    messageId: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await auth();
    const { conversationId, messageId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = await Message.findById(messageId);

    if (!message || message.senderId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { content } = body;

    // Validate input
    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long" },
        { status: 400 }
      );
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        content: content.trim(),
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();

    // Fetch sender details
    const sender = await User.findById((updatedMessage as any).senderId)
      .select("name email image")
      .lean();

    const formattedMessage = {
      id: (updatedMessage as any)._id.toString(),
      content: (updatedMessage as any).content,
      conversationId: (updatedMessage as any).conversationId,
      senderId: (updatedMessage as any).senderId,
      createdAt: (updatedMessage as any).createdAt,
      updatedAt: (updatedMessage as any).updatedAt,
      deletedAt: (updatedMessage as any).deletedAt,
      sender: sender
        ? {
            id: sender._id.toString(),
            name: sender.name,
            email: sender.email,
            image: sender.image,
          }
        : null,
    };

    return NextResponse.json({ message: formattedMessage });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a message (soft delete)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await auth();
    const { conversationId, messageId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = await Message.findById(messageId);

    if (!message || message.senderId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Message.findByIdAndUpdate(messageId, {
      deletedAt: new Date(),
    });

    return NextResponse.json({ message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
