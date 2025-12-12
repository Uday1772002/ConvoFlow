"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { User } from "@/types";
import { Search, Loader2 } from "lucide-react";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateChat: (userId: string) => void;
}

export function NewChatDialog({
  open,
  onOpenChange,
  onCreateChat,
}: NewChatDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const response = await fetch(
        `/api/users?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUserSelect = (userId: string) => {
    onCreateChat(userId);
    onOpenChange(false);
    setSearchQuery("");
    setUsers([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Chat</DialogTitle>
          <DialogDescription>
            Search for users to start a conversation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              size="icon"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {users.length === 0 ? (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                {searchQuery
                  ? "No users found"
                  : "Search for users to start chatting"}
              </p>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className="w-full p-3 flex gap-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>
                      {getInitials(user.name || user.email)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
