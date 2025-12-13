"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ConversationList } from "@/components/chat/conversation-list";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { NewChatDialog } from "@/components/chat/new-chat-dialog";
import { MessageSkeleton } from "@/components/chat/message-skeleton";
import { RemindersPanel } from "@/components/chat/reminders-panel";
import { NotificationCenter } from "@/components/chat/notification-center";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConversationWithLastMessage, MessageWithSender } from "@/types";
import { getInitials } from "@/lib/utils";
import { MessageSquarePlus, LogOut, Sparkles, Menu, X } from "lucide-react";
import { getSocket } from "@/lib/socket";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<
    ConversationWithLastMessage[]
  >([]);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>();
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [chatSummary, setChatSummary] = useState<string>("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder="Search conversations..."]'
        );
        searchInput?.focus();
      }

      // Escape to close dialogs
      if (e.key === "Escape") {
        setIsNewChatOpen(false);
        setIsSummaryDialogOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const otherParticipants = conv.participants.filter(
      (p) => p.user.id !== session?.user?.id
    );
    const displayName = conv.isGroup
      ? conv.name || "Group Chat"
      : otherParticipants[0]?.user.name ||
        otherParticipants[0]?.user.email ||
        "Unknown User";

    const lastMessage = conv.messages[0]?.content || "";

    return (
      displayName.toLowerCase().includes(query) ||
      lastMessage.toLowerCase().includes(query)
    );
  });

  // Fetch conversations
  useEffect(() => {
    if (session?.user?.id) {
      fetchConversations();
    }
  }, [session]);

  // Set up Socket.io real-time subscriptions
  useEffect(() => {
    if (!session?.user?.id) return;

    const socket = getSocket();

    // Join user's room
    socket.emit("join", session.user.id);
    console.log("Socket connected, user joined:", session.user.id);

    // Listen for new conversations
    socket.on(
      "conversation-created",
      (conversation: ConversationWithLastMessage) => {
        setConversations((prev) => [conversation, ...prev]);
      }
    );

    // Listen for new messages
    socket.on("message", (message: MessageWithSender) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });

      // Update unread count if message is not in current conversation
      if (
        message.conversationId !== selectedConversationId &&
        message.senderId !== session.user.id
      ) {
        console.log(
          "Incrementing unread for conversation:",
          message.conversationId
        );
        setUnreadCounts((prev) => ({
          ...prev,
          [message.conversationId]: (prev[message.conversationId] || 0) + 1,
        }));
      }

      // Update conversation list
      fetchConversations();
    });

    // Listen for typing events
    socket.on(
      "user-typing",
      ({ conversationId, userId: _userId, userName }) => {
        setTypingUsers((prev) => {
          const current = prev[conversationId] || [];
          if (!current.includes(userName)) {
            return { ...prev, [conversationId]: [...current, userName] };
          }
          return prev;
        });
      }
    );

    socket.on(
      "user-stopped-typing",
      ({ conversationId, userId: _userId, userName }) => {
        setTypingUsers((prev) => {
          const current = prev[conversationId] || [];
          return {
            ...prev,
            [conversationId]: current.filter((u) => u !== userName),
          };
        });
      }
    );

    // Listen for online status
    socket.on("online-users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("user-online", (userId: string) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("user-offline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("conversation-created");
      socket.off("message");
      socket.off("user-typing");
      socket.off("user-stopped-typing");
      socket.off("online-users");
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, [session?.user?.id, selectedConversationId]);

  // Subscribe to selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;

    const socket = getSocket();

    // Join conversation room
    socket.emit("join-conversation", selectedConversationId);

    return () => {
      socket.emit("leave-conversation", selectedConversationId);
    };
  }, [selectedConversationId]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      const data = await response.json();
      if (response.ok) {
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data.conversation?.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setAiSuggestions([]);

    // Clear unread count for this conversation
    setUnreadCounts((prev) => {
      const newCounts = { ...prev };
      delete newCounts[id];
      return newCounts;
    });

    fetchMessages(id);
  };

  const handleTyping = () => {
    if (!selectedConversationId || !session?.user) return;

    const socket = getSocket();
    socket.emit("typing", {
      conversationId: selectedConversationId,
      userId: session.user.id,
      userName: session.user.name || session.user.email,
    });
  };

  const handleStopTyping = () => {
    if (!selectedConversationId || !session?.user) return;

    const socket = getSocket();
    socket.emit("stop-typing", {
      conversationId: selectedConversationId,
      userId: session.user.id,
      userName: session.user.name || session.user.email,
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;

    try {
      const response = await fetch(
        `/api/conversations/${selectedConversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const socket = getSocket();

        // Emit new message event for real-time delivery
        socket.emit("new-message", {
          conversationId: selectedConversationId,
          message: data.message,
        });

        // Add to local state immediately
        setMessages((prev) => [...prev, data.message]);
        setAiSuggestions([]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCreateChat = async (userId: string) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantIds: [userId],
          isGroup: false,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const socket = getSocket();

        // Notify other participants about new conversation
        socket.emit("new-conversation", {
          conversation: data.conversation,
          participantIds: [userId, session?.user?.id],
        });

        await fetchConversations();
        setSelectedConversationId(data.conversation.id);
        fetchMessages(data.conversation.id);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleRequestAISuggestions = async () => {
    if (!selectedConversationId) return;

    if (messages.length === 0) {
      alert(
        "Please send at least one message before requesting AI suggestions. The AI needs conversation context to generate relevant replies."
      );
      return;
    }

    setIsLoadingSuggestions(true);

    try {
      const recentMessages = messages.slice(-10).map((msg) => {
        const isOwnMessage = msg.senderId === session?.user?.id;
        return {
          sender: isOwnMessage ? "You" : msg.sender.name || msg.sender.email,
          content: msg.content,
          isOwnMessage,
        };
      });

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: recentMessages,
          type: "reply",
          currentUserName: session?.user?.name || "You",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiSuggestions(data.suggestions || []);
      } else {
        alert(
          data.error || "Failed to generate AI suggestions. Please try again."
        );
      }
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      alert(
        "Failed to generate AI suggestions. Please check your connection and try again."
      );
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSummarizeChat = async () => {
    if (!selectedConversationId || messages.length === 0) {
      alert("No messages to summarize yet.");
      return;
    }

    setIsLoadingSummary(true);

    try {
      const allMessages = messages.map((msg) => ({
        sender: msg.sender.name || msg.sender.email,
        content: msg.content,
      }));

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages,
          type: "summary",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setChatSummary(data.result || "");
        setIsSummaryDialogOpen(true);
      } else {
        alert(data.error || "Failed to generate summary. Please try again.");
      }
    } catch (error) {
      console.error("Error getting chat summary:", error);
      alert(
        "Failed to generate summary. Please check your connection and try again."
      );
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  const otherParticipants = selectedConversation?.participants.filter(
    (p) => p.user.id !== session?.user?.id
  );

  const displayName = selectedConversation?.isGroup
    ? selectedConversation.name || "Group Chat"
    : otherParticipants?.[0]?.user.name ||
      otherParticipants?.[0]?.user.email ||
      "Unknown User";

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-0"
        } border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col transition-all duration-300 overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-cyan-500">ConvoFlow</h1>
            <div className="flex items-center gap-1">
              <NotificationCenter
                unreadCount={Object.values(unreadCounts).reduce(
                  (sum, count) => sum + count,
                  0
                )}
              />
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || undefined} />
                <AvatarFallback>
                  {getInitials(
                    session?.user?.name || session?.user?.email || "U"
                  )}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            onClick={() => setIsNewChatOpen(true)}
            className="w-full mb-3"
            size="sm"
          >
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            New Chat
          </Button>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Reminders Panel */}
        <div className="px-4">
          <RemindersPanel />
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <ConversationList
            conversations={filteredConversations}
            selectedId={selectedConversationId}
            onSelect={handleSelectConversation}
            unreadCounts={unreadCounts}
            onlineUsers={onlineUsers}
          />
        </ScrollArea>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center px-4 gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              <Avatar className="h-10 w-10">
                {!selectedConversation?.isGroup && otherParticipants?.[0] && (
                  <AvatarImage
                    src={otherParticipants[0].user.image || undefined}
                  />
                )}
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  {displayName}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedConversation?.participants.length} participants
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSummarizeChat}
                disabled={isLoadingSummary || messages.length === 0}
                title="Summarize this chat using AI"
              >
                {isLoadingSummary ? (
                  <Sparkles className="h-4 w-4 animate-pulse" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Summarize
                  </>
                )}
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden bg-white dark:bg-gray-950">
              {isLoadingMessages ? (
                <MessageSkeleton />
              ) : (
                <MessageList messages={messages} />
              )}
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    AI Suggestions:
                  </span>
                </div>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {typingUsers[selectedConversationId]?.length > 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 italic">
                {typingUsers[selectedConversationId].join(", ")}{" "}
                {typingUsers[selectedConversationId].length === 1
                  ? "is"
                  : "are"}{" "}
                typing...
              </div>
            )}

            {/* Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              onRequestAISuggestions={handleRequestAISuggestions}
              isLoadingSuggestions={isLoadingSuggestions}
              onTyping={handleTyping}
              onStopTyping={handleStopTyping}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8">
            <MessageSquarePlus className="h-16 w-16 mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">Welcome to ConvoFlow</h2>
            <p className="text-center">
              Select a conversation or start a new chat to begin messaging
            </p>
          </div>
        )}
      </div>
      {/* New Chat Dialog */}
      <NewChatDialog
        open={isNewChatOpen}
        onOpenChange={setIsNewChatOpen}
        onCreateChat={handleCreateChat}
      />
      {/* Summary Dialog */}
      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-500" />
              Chat Summary
            </DialogTitle>
            <DialogDescription>
              AI-generated summary of your conversation
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {chatSummary}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>{" "}
    </div>
  );
}
