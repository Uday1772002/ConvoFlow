"use client";

import { Calendar, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MeetingSuggestionProps {
  messageContent: string;
  onDismiss: () => void;
}

export function MeetingSuggestion({
  messageContent,
  onDismiss,
}: MeetingSuggestionProps) {
  const [dismissed, setDismissed] = useState(false);

  const handleAddToCalendar = () => {
    // Create a simple calendar event
    const title = encodeURIComponent("Meeting from ConvoFlow");
    const details = encodeURIComponent(messageContent);

    // Google Calendar URL
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;

    window.open(calendarUrl, "_blank");
    handleDismiss();
  };

  const handleSetReminder = () => {
    // Prompt user to select reminder time
    const reminderTime = prompt(
      "When should we remind you? (Examples: '15 minutes', '1 hour', '2 hours', '1 day', or enter time like '3:00 PM')"
    );

    if (!reminderTime) return;

    // Calculate reminder date
    let reminderDate = new Date();
    const input = reminderTime.toLowerCase().trim();

    if (input.includes("minute")) {
      const minutes = parseInt(input);
      reminderDate.setMinutes(reminderDate.getMinutes() + minutes);
    } else if (input.includes("hour")) {
      const hours = parseInt(input);
      reminderDate.setHours(reminderDate.getHours() + hours);
    } else if (input.includes("day")) {
      const days = parseInt(input);
      reminderDate.setDate(reminderDate.getDate() + days);
    } else if (input.includes(":")) {
      // Try to parse time like "3:00 PM"
      const timeMatch = input.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const meridiem = timeMatch[3]?.toLowerCase();

        if (meridiem === "pm" && hours !== 12) hours += 12;
        if (meridiem === "am" && hours === 12) hours = 0;

        reminderDate.setHours(hours, minutes, 0, 0);

        // If the time is in the past today, set it for tomorrow
        if (reminderDate <= new Date()) {
          reminderDate.setDate(reminderDate.getDate() + 1);
        }
      }
    } else {
      alert("Invalid time format. Try '15 minutes', '2 hours', '1 day', or '3:00 PM'");
      return;
    }

    // Save to localStorage
    const reminders = JSON.parse(localStorage.getItem("convoflow-reminders") || "[]");
    const newReminder = {
      id: Date.now().toString(),
      message: messageContent,
      reminderTime: reminderDate.toISOString(),
      createdAt: new Date().toISOString(),
    };
    reminders.push(newReminder);
    localStorage.setItem("convoflow-reminders", JSON.stringify(reminders));

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    alert(`✅ Reminder set for ${reminderDate.toLocaleString()}`);
    handleDismiss();
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss();
  };

  if (dismissed) return null;

  return (
    <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-xs font-medium text-purple-900 dark:text-purple-100 mb-2">
            💡 Looks like you're planning a meeting!
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddToCalendar}
              className="h-7 text-xs bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 border-purple-300 dark:border-purple-700"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Add to Calendar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSetReminder}
              className="h-7 text-xs bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 border-purple-300 dark:border-purple-700"
            >
              <Bell className="h-3 w-3 mr-1" />
              Set Reminder
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
