"use client";

import { Calendar, Bell, X, Clock } from "lucide-react";
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
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [customTime, setCustomTime] = useState("");

  const handleAddToCalendar = () => {
    // Create a simple calendar event
    const title = encodeURIComponent("Meeting from ConvoFlow");
    const details = encodeURIComponent(messageContent);

    // Google Calendar URL
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;

    window.open(calendarUrl, "_blank");
    handleDismiss();
  };

  const saveReminder = (reminderDate: Date) => {
    const reminders = JSON.parse(
      localStorage.getItem("convoflow-reminders") || "[]"
    );
    const newReminder = {
      id: Date.now().toString(),
      message: messageContent,
      reminderTime: reminderDate.toISOString(),
      createdAt: new Date().toISOString(),
    };
    reminders.push(newReminder);
    localStorage.setItem("convoflow-reminders", JSON.stringify(reminders));

    if ("Notification" in window) {
      Notification.requestPermission();
    }

    setShowReminderModal(false);
    setCustomTime("");
    handleDismiss();
  };

  const handleQuickReminder = (type: string) => {
    const reminderDate = new Date();

    switch (type) {
      case "15min":
        reminderDate.setMinutes(reminderDate.getMinutes() + 15);
        break;
      case "1hour":
        reminderDate.setHours(reminderDate.getHours() + 1);
        break;
      case "2hours":
        reminderDate.setHours(reminderDate.getHours() + 2);
        break;
      case "1day":
        reminderDate.setDate(reminderDate.getDate() + 1);
        break;
    }

    saveReminder(reminderDate);
  };

  const handleCustomReminder = () => {
    if (!customTime) return;

    const reminderDate = new Date();
    const input = customTime.toLowerCase().trim();

    if (input.includes(":")) {
      const timeMatch = input.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const meridiem = timeMatch[3]?.toLowerCase();

        if (meridiem === "pm" && hours !== 12) hours += 12;
        if (meridiem === "am" && hours === 12) hours = 0;

        reminderDate.setHours(hours, minutes, 0, 0);

        if (reminderDate <= new Date()) {
          reminderDate.setDate(reminderDate.getDate() + 1);
        }
      }
    }

    saveReminder(reminderDate);
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss();
  };

  if (dismissed) return null;

  return (
    <>
      <div className="mt-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                Meeting Detected!
              </p>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Would you like to add this to your calendar or set a reminder?
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={handleAddToCalendar}
                className="h-8 text-xs bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/40 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 shadow-sm"
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Add to Calendar
              </Button>
              <Button
                size="sm"
                onClick={() => setShowReminderModal(true)}
                className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              >
                <Bell className="h-3.5 w-3.5 mr-1.5" />
                Set Reminder
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-purple-400 hover:text-purple-600 dark:text-purple-500 dark:hover:text-purple-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in"
            onClick={() => setShowReminderModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in fade-in zoom-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Set Reminder
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowReminderModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  When would you like to be reminded about this meeting?
                </p>

                {/* Quick Options */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => handleQuickReminder("15min")}
                    className="p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                  >
                    <Clock className="h-5 w-5 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      15 minutes
                    </p>
                  </button>
                  <button
                    onClick={() => handleQuickReminder("1hour")}
                    className="p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                  >
                    <Clock className="h-5 w-5 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      1 hour
                    </p>
                  </button>
                  <button
                    onClick={() => handleQuickReminder("2hours")}
                    className="p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                  >
                    <Clock className="h-5 w-5 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      2 hours
                    </p>
                  </button>
                  <button
                    onClick={() => handleQuickReminder("1day")}
                    className="p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                  >
                    <Clock className="h-5 w-5 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      1 day
                    </p>
                  </button>
                </div>

                {/* Custom Time */}
                <div className="relative">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Or enter custom time:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      placeholder="e.g., 3:00 PM"
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    />
                    <Button
                      onClick={handleCustomReminder}
                      disabled={!customTime}
                      className="px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Set
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
