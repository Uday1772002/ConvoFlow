"use client";

import { useEffect, useRef } from "react";
import { MessageWithSender } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatTime } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface MessageListProps {
  messages: MessageWithSender[];
}

export function MessageList({ messages }: MessageListProps) {
  const { data: session } = useSession();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.senderId === session?.user?.id;

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
            >
              {!isOwnMessage && (
                <Avatar className="h-8 w-8">
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

                <span
                  className="text-xs text-gray-500 dark:text-gray-400 px-2"
                  title={new Date(message.createdAt).toLocaleString()}
                >
                  {formatTime(message.createdAt)}
                </span>
              </div>

              {isOwnMessage && (
                <Avatar className="h-8 w-8">
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
