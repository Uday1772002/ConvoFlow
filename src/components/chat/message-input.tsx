"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Loader2 } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onRequestAISuggestions?: () => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  disabled?: boolean;
  isLoadingSuggestions?: boolean;
}

export function MessageInput({
  onSendMessage,
  onRequestAISuggestions,
  onTyping,
  onStopTyping,
  disabled = false,
  isLoadingSuggestions = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || disabled) return;

    onSendMessage(message);
    setMessage("");

    // Stop typing indicator
    if (onStopTyping) {
      onStopTyping();
    }

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // Emit typing event
    if (onTyping && e.target.value) {
      onTyping();

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
        if (onStopTyping) {
          onStopTyping();
        }
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-gray-200 dark:border-gray-800"
    >
      <div className="flex gap-2 items-center">
        {onRequestAISuggestions && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRequestAISuggestions}
            disabled={disabled || isLoadingSuggestions}
            title={
              isLoadingSuggestions
                ? "Generating suggestions..."
                : "Get AI reply suggestions (requires at least 1 message)"
            }
          >
            {isLoadingSuggestions ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </Button>
        )}

        <Input
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1"
        />

        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
