"use client";

import { useEffect, useRef, useState } from "react";
import { MessageWithSender } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatTime } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { MeetingSuggestion } from "@/components/chat/meeting-suggestion";

interface MessageListProps {
  messages: MessageWithSender[];
}

export function MessageList({ messages }: MessageListProps) {
  const { data: session } = useSession();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Detect meeting-related keywords
  const detectMeeting = (content: string): boolean => {
    const meetingKeywords = [
      /\b(meet|meeting|meetup)\b/i,
      /\b(schedule|appointment|call)\b/i,
      /\b(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
      /\b(\d{1,2}:\d{2}|am|pm)\b/i,
    ];

    return meetingKeywords.some((pattern) => pattern.test(content));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.senderId === session?.user?.id;
          const hasMeetingKeyword = detectMeeting(message.content);
          const showSuggestion =
            hasMeetingKeyword && !dismissedSuggestions.has(message.id);

          return (
            <div
              key={message.id}
              className={`flex gap-3 items-start ${
                isOwnMessage ? "flex-row-reverse" : ""
              }`}
            >
              {!isOwnMessage && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.sender.image || undefined} />
                  <AvatarFallback>
                    {getInitials(message.sender.name || message.sender.email)}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex flex-col gap-1 max-w-[70%] ${
                  isOwnMessage ? "items-end" : "items-start"
                }`}
              >
                {!isOwnMessage && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2">
                    {message.sender.name || message.sender.email}
                  </span>
                )}

                <div
                  className={`rounded-2xl px-4 py-2 transition-all hover:shadow-md ${
                    isOwnMessage
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>

                {showSuggestion && (
                  <MeetingSuggestion
                    messageContent={message.content}
                    onDismiss={() => {
                      setDismissedSuggestions(
                        (prev) => new Set([...prev, message.id])
                      );
                    }}
                  />
                )}

                <span
                  className="text-xs text-gray-500 dark:text-gray-400 px-2"
                  title={new Date(message.createdAt).toLocaleString()}
                >
                  {formatTime(message.createdAt)}
                </span>
              </div>

              {isOwnMessage && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={session?.user?.image || undefined} />
                  <AvatarFallback>
                    {getInitials(
                      session?.user?.name || session?.user?.email || "U"
                    )}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
}
