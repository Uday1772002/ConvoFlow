"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Reminder {
  id: string;
  message: string;
  reminderTime: string;
  createdAt: string;
}

export function RemindersPanel() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    // Load reminders from localStorage
    loadReminders();

    // Check reminders every minute
    const interval = setInterval(() => {
      checkReminders();
    }, 60000); // Check every 60 seconds

    // Check immediately on mount
    checkReminders();

    return () => clearInterval(interval);
  }, []);

  const loadReminders = () => {
    const stored = localStorage.getItem("convoflow-reminders");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Filter out past reminders
      const active = parsed.filter((r: Reminder) => new Date(r.reminderTime) > new Date());
      setReminders(active);
      
      // Update localStorage to remove past reminders
      if (active.length !== parsed.length) {
        localStorage.setItem("convoflow-reminders", JSON.stringify(active));
      }
    }
  };

  const checkReminders = () => {
    const stored = localStorage.getItem("convoflow-reminders");
    if (!stored) return;

    const allReminders: Reminder[] = JSON.parse(stored);
    const now = new Date();
    const triggered: Reminder[] = [];
    const remaining: Reminder[] = [];

    allReminders.forEach((reminder) => {
      const reminderTime = new Date(reminder.reminderTime);
      if (reminderTime <= now) {
        triggered.push(reminder);
        
        // Show notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Meeting Reminder", {
            body: reminder.message,
            icon: "/favicon.ico",
            tag: reminder.id,
          });
        }
      } else {
        remaining.push(reminder);
      }
    });

    if (triggered.length > 0) {
      // Update localStorage and state
      localStorage.setItem("convoflow-reminders", JSON.stringify(remaining));
      setReminders(remaining);
    }
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    localStorage.setItem("convoflow-reminders", JSON.stringify(updated));
  };

  if (reminders.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        <h3 className="font-semibold text-sm text-purple-900 dark:text-purple-100">
          Upcoming Reminders ({reminders.length})
        </h3>
      </div>
      
      <ScrollArea className="max-h-48">
        <div className="space-y-2">
          {reminders.map((reminder) => {
            const reminderDate = new Date(reminder.reminderTime);
            const timeUntil = reminderDate.getTime() - Date.now();
            const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
            const minutesUntil = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
            
            let timeText = "";
            if (hoursUntil > 24) {
              const daysUntil = Math.floor(hoursUntil / 24);
              timeText = `in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`;
            } else if (hoursUntil > 0) {
              timeText = `in ${hoursUntil}h ${minutesUntil}m`;
            } else {
              timeText = `in ${minutesUntil} minute${minutesUntil !== 1 ? "s" : ""}`;
            }

            return (
              <div
                key={reminder.id}
                className="flex items-start justify-between gap-2 p-2 bg-white dark:bg-gray-800 rounded border border-purple-200 dark:border-purple-700"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 dark:text-gray-100 line-clamp-2">
                    {reminder.message}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    {reminderDate.toLocaleString()} ({timeText})
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteReminder(reminder.id)}
                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
