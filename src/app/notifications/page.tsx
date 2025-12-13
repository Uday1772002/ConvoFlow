"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, X, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Reminder {
  id: string;
  message: string;
  reminderTime: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = () => {
    const stored = localStorage.getItem("convoflow-reminders");
    if (stored) {
      const parsed = JSON.parse(stored);
      const active = parsed.filter(
        (r: Reminder) => new Date(r.reminderTime) > new Date()
      );
      setReminders(active);
    }
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    localStorage.setItem("convoflow-reminders", JSON.stringify(updated));
  };

  const clearAllReminders = () => {
    localStorage.setItem("convoflow-reminders", JSON.stringify([]));
    setReminders([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Notifications
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your reminders and notifications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {reminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
            <Bell className="h-16 w-16 mb-4 opacity-30" />
            <h2 className="text-xl font-semibold mb-2">No notifications</h2>
            <p className="text-sm">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reminders Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Upcoming Reminders ({reminders.length})
                  </h2>
                </div>
                {reminders.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllReminders}
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {reminders.map((reminder) => {
                  const reminderDate = new Date(reminder.reminderTime);
                  const timeUntil = reminderDate.getTime() - Date.now();
                  const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
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
                      className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors relative group"
                    >
                      <div className="pr-10">
                        <p className="text-base text-gray-900 dark:text-gray-100 mb-2">
                          {reminder.message}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                            <Clock className="h-4 w-4" />
                            <span>{reminderDate.toLocaleString()}</span>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400">
                            {timeText}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteReminder(reminder.id)}
                        className="absolute top-4 right-4 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
