import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Conversation, Message, User } from "@/lib/models";
import type { MessageDocument, UserDocument } from "@/types/mongoose";

interface RouteParams {
  params: Promise<{
    conversationId: string;
  }>;
}

// GET - Fetch specific conversation with messages
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
    }).lean();

    if (!conversation) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Get participants
    const participants = await User.find({
      _id: { $in: conversation.participantIds },
    })
      .select("name email image")
      .lean();

    // Get messages
    const messages = await Message.find({
      conversationId: conversationId,
      deletedAt: null,
    })
      .sort({ createdAt: 1 })
      .lean();

    // Get unique sender IDs and fetch users
    const senderIds = [...new Set(messages.map((m: MessageDocument) => m.senderId))];
    const senders = await User.find({ _id: { $in: senderIds } })
      .select("name email image")
      .lean();

    const senderMap = new Map(senders.map((s: UserDocument) => [s._id.toString(), s]));

    const formattedConversation = {
      id: conversation._id.toString(),
      name: conversation.name,
      isGroup: conversation.isGroup,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      participants: participants.map((p: UserDocument) => ({
        user: {
          id: p._id.toString(),
          name: p.name,
          email: p.email,
          image: p.image,
        },
      })),
      messages: messages.map((m: MessageDocument) => {
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
      }),
    };

    return NextResponse.json({ conversation: formattedConversation });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete conversation
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
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

    // Delete conversation and messages
    await Conversation.findByIdAndDelete(conversationId);
    await Message.deleteMany({ conversationId: conversationId });

    return NextResponse.json({ message: "Conversation deleted" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
