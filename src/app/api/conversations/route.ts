import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Conversation, Message, User } from "@/lib/models";
import type { UserDocument, ConversationDocument } from "@/types/mongoose";

// GET - Fetch all conversations for current user
export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await Conversation.find({
      participantIds: session.user.id,
    })
      .sort({ updatedAt: -1 })
      .lean();

    // Get participants and last message for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv: ConversationDocument) => {
        // Get participant details
        const participantUsers = await User.find({
          _id: { $in: conv.participantIds },
        })
          .select("_id name email image")
          .lean();

        // Get last message
        const lastMessage = await Message.findOne({
          conversationId: conv._id.toString(),
          deletedAt: null,
        })
          .sort({ createdAt: -1 })
          .lean();

        const messageCount = await Message.countDocuments({
          conversationId: conv._id.toString(),
          deletedAt: null,
        });

        let lastMessageFormatted = null;
        if (lastMessage) {
          const sender = participantUsers.find(
            (p: UserDocument) => p._id.toString() === lastMessage.senderId
          );

          if (sender) {
            lastMessageFormatted = {
              id: lastMessage._id.toString(),
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              sender: {
                id: sender._id.toString(),
                name: sender.name,
                email: sender.email,
                image: sender.image || null,
              },
            };
          }
        }

        return {
          id: conv._id.toString(),
          name: conv.name || null,
          isGroup: conv.isGroup,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          participants: participantUsers.map((p: UserDocument) => ({
            userId: p._id.toString(),
            user: {
              id: p._id.toString(),
              name: p.name,
              email: p.email,
              image: p.image || null,
            },
          })),
          messages: lastMessageFormatted ? [lastMessageFormatted] : [],
          _count: { messages: messageCount },
        };
      })
    );

    return NextResponse.json({ conversations: conversationsWithDetails });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { participantIds, isGroup, name } = body;

    // Validate input
    if (
      !participantIds ||
      !Array.isArray(participantIds) ||
      participantIds.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one participant is required" },
        { status: 400 }
      );
    }

    const validatedData = { participantIds, isGroup, name };

    const allParticipantIds = [
      session.user.id,
      ...validatedData.participantIds,
    ];

    // Check if direct conversation already exists
    if (!validatedData.isGroup && validatedData.participantIds.length === 1) {
      const existingConversation = await Conversation.findOne({
        isGroup: false,
        participantIds: { $all: allParticipantIds, $size: 2 },
      }).lean();

      if (existingConversation) {
        const participants = await User.find({
          _id: { $in: existingConversation.participantIds },
        })
          .select("id name email image")
          .lean();

        return NextResponse.json({
          conversation: {
            id: existingConversation._id.toString(),
            name: existingConversation.name,
            isGroup: existingConversation.isGroup,
            createdAt: existingConversation.createdAt,
            updatedAt: existingConversation.updatedAt,
            participants: participants.map((p: UserDocument) => ({
              user: {
                id: p._id.toString(),
                name: p.name,
                email: p.email,
                image: p.image,
              },
            })),
          },
        });
      }
    }

    // Create new conversation
    const conversation = await Conversation.create({
      isGroup: validatedData.isGroup || false,
      name: validatedData.name,
      participantIds: allParticipantIds,
    });

    const participants = await User.find({
      _id: { $in: allParticipantIds },
    })
      .select("id name email image")
      .lean();

    // Note: Real-time updates are handled by Socket.io on the client side
    // The client will emit "new-conversation" event after receiving this response

    return NextResponse.json(
      {
        conversation: {
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
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
