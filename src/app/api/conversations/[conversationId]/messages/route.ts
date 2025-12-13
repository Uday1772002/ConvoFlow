import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Message, Conversation, User } from "@/lib/models";
import type { MessageDocument, UserDocument } from "@/types/mongoose";

interface RouteParams {
  params: Promise<{
    conversationId: string;
  }>;
}

// GET - Fetch messages for a conversation
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { conversationId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participantIds: session.user.id,
    });

    if (!conversation) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await Message.find({
      conversationId: conversationId,
      deletedAt: null,
    })
      .sort({ createdAt: 1 })
      .lean();

    // Get unique sender IDs and fetch users
    const senderIds = [
      ...new Set(messages.map((m: MessageDocument) => m.senderId)),
    ];
    const senders = await User.find({ _id: { $in: senderIds } })
      .select("name email image")
      .lean();

    const senderMap = new Map(
      senders.map((s: UserDocument) => [s._id.toString(), s])
    );

    const formattedMessages = messages.map((m: MessageDocument) => {
      const sender = senderMap.get(m.senderId);
      return {
        id: m._id.toString(),
        content: m.content,
        conversationId: m.conversationId,
        senderId: m.senderId,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        deletedAt: m.deletedAt,
        sender: sender
          ? {
              id: sender._id.toString(),
              name: sender.name,
              email: sender.email,
              image: sender.image,
            }
          : null,
      };
    });

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Send a message
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { conversationId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participantIds: session.user.id,
    });

    if (!conversation) {
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

    // Create message
    const message = await Message.create({
      content: content.trim(),
      conversationId: conversationId,
      senderId: session.user.id,
    });

    // Fetch sender details
    const sender = await User.findById(session.user.id)
      .select("name email image")
      .lean();

    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date(),
    });

    const formattedMessage = {
      id: message._id.toString(),
      content: message.content,
      conversationId: message.conversationId,
      senderId: message.senderId,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      deletedAt: message.deletedAt,
      sender: sender
        ? {
            id: sender._id.toString(),
            name: sender.name,
            email: sender.email,
            image: sender.image,
          }
        : null,
    };

    // Note: Real-time updates are handled by Socket.io on the client side
    // The client will emit "new-message" event after receiving this response

    return NextResponse.json({ message: formattedMessage }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
