"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, X, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Reminder {
  id: string;
  message: string;
  reminderTime: string;
  createdAt: string;
}

interface NotificationCenterProps {
  unreadCount?: number;
}

export function NotificationCenter({
  unreadCount = 0,
}: NotificationCenterProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadReminders();

    // Refresh reminders every minute
    const interval = setInterval(() => {
      loadReminders();
    }, 60000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadCount]);

  const loadReminders = () => {
    const stored = localStorage.getItem("convoflow-reminders");
    if (stored) {
      const parsed = JSON.parse(stored);
      const active = parsed.filter(
        (r: Reminder) => new Date(r.reminderTime) > new Date()
      );
      setReminders(active);
      setTotalCount(active.length + unreadCount);
    } else {
      setTotalCount(unreadCount);
    }
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    localStorage.setItem("convoflow-reminders", JSON.stringify(updated));
    setTotalCount(updated.length + unreadCount);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    router.push("/notifications");
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Notification Panel */}
          <div className="fixed left-0 mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl z-50 max-h-[500px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Notifications
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {totalCount} notification{totalCount !== 1 ? "s" : ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 overflow-auto">
              <div className="p-2">
                {totalCount === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                    <Bell className="h-12 w-12 mb-2 opacity-30" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  <>
                    {/* Unread Messages Section */}
                    {unreadCount > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 px-2 py-1">
                          <MessageCircle className="h-4 w-4 text-cyan-500" />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Unread Messages ({unreadCount})
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 mt-2">
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            You have {unreadCount} unread message
                            {unreadCount !== 1 ? "s" : ""}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Check your conversations to view them
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Reminders Section */}
                    {reminders.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 px-2 py-1">
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Upcoming Reminders ({reminders.length})
                          </span>
                        </div>
                        <div className="space-y-2 mt-2">
                          {reminders.map((reminder) => {
                            const reminderDate = new Date(
                              reminder.reminderTime
                            );
                            const timeUntil =
                              reminderDate.getTime() - Date.now();
                            const hoursUntil = Math.floor(
                              timeUntil / (1000 * 60 * 60)
                            );
                            const minutesUntil = Math.floor(
                              (timeUntil % (1000 * 60 * 60)) / (1000 * 60)
                            );

                            let timeText = "";
                            if (hoursUntil > 24) {
                              const daysUntil = Math.floor(hoursUntil / 24);
                              timeText = `in ${daysUntil} day${
                                daysUntil !== 1 ? "s" : ""
                              }`;
                            } else if (hoursUntil > 0) {
                              timeText = `in ${hoursUntil}h ${minutesUntil}m`;
                            } else {
                              timeText = `in ${minutesUntil} min${
                                minutesUntil !== 1 ? "s" : ""
                              }`;
                            }

                            return (
                              <div
                                key={reminder.id}
                                className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 relative group"
                              >
                                <div className="pr-6">
                                  <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                                    {reminder.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Clock className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                    <p className="text-xs text-purple-600 dark:text-purple-400">
                                      {reminderDate.toLocaleString()}
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {timeText}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteReminder(reminder.id);
                                  }}
                                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            {totalCount > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleViewAll}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  See All Notifications
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
