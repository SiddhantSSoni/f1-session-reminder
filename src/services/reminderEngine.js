import { getDueReminder } from "./reminderService.js";

export function findDueReminders(sessions, currentTime = new Date()) {
  const dueReminders = [];

  for (const session of sessions) {
    const reminder = getDueReminder(
      session.dateTime,
      currentTime
    );

    if (!reminder) {
      continue;
    }

    dueReminders.push({
      ...session,
      reminder
    });
  }

  return dueReminders;
}