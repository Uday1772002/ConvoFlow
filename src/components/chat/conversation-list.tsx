"use client";

import { ConversationWithLastMessage } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatDate, truncate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";

interface ConversationListProps {
  conversations: ConversationWithLastMessage[];
  selectedId?: string;
  onSelect: (id: string) => void;
  unreadCounts?: Record<string, number>;
  onlineUsers?: string[];
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  unreadCounts = {},
  onlineUsers = [],
}: ConversationListProps) {
  const { data: session } = useSession();

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
        <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-center">No conversations yet. Start a new chat!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conversation) => {
        const otherParticipants = conversation.participants.filter(
          (p) => p.user.id !== session?.user?.id
        );

        const displayName = conversation.isGroup
          ? conversation.name || "Group Chat"
          : otherParticipants[0]?.user.name ||
            otherParticipants[0]?.user.email ||
            "Unknown User";

        const lastMessage = conversation.messages[0];
        const isSelected = conversation.id === selectedId;

        return (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`w-full p-4 flex gap-3 items-start hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 ${
              isSelected ? "bg-cyan-50 dark:bg-cyan-900/20" : ""
            }`}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                {!conversation.isGroup && otherParticipants[0] && (
                  <AvatarImage
                    src={otherParticipants[0].user.image || undefined}
                  />
                )}
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              {!conversation.isGroup &&
                otherParticipants[0] &&
                onlineUsers.includes(otherParticipants[0].user.id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-950"></div>
                )}
              {/* Debug logging */}
              {!conversation.isGroup && otherParticipants[0] && (
                <div className="hidden">
                  {console.log(
                    `🔍 Checking ${displayName}:`,
                    "participantId:",
                    otherParticipants[0].user.id,
                    "isOnline:",
                    onlineUsers.includes(otherParticipants[0].user.id),
                    "onlineUsers:",
                    onlineUsers
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3
                  className={`font-semibold text-gray-900 dark:text-gray-100 truncate ${
                    unreadCounts[conversation.id] ? "font-bold" : ""
                  }`}
                >
                  {displayName}
                </h3>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  {lastMessage && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(lastMessage.createdAt)}
                    </span>
                  )}
                  {/* Unread badge */}
                  {unreadCounts[conversation.id] > 0 && (
                    <div className="bg-cyan-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                      {unreadCounts[conversation.id]}
                    </div>
                  )}
                </div>
              </div>

              {lastMessage ? (
                <p
                  className={`text-sm text-gray-600 dark:text-gray-400 truncate ${
                    unreadCounts[conversation.id] ? "font-semibold" : ""
                  }`}
                >
                  {lastMessage.senderId === session?.user?.id && "You: "}
                  {truncate(lastMessage.content, 50)}
                </p>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                  No messages yet
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
