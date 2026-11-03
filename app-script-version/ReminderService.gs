
function getDueReminders(sessions, currentTime) {
  currentTime = currentTime || new Date();

  const dueReminders = [];

  for (const session of sessions) {
    const sessionTime = new Date(session.dateTime);

    for (const reminder of CONFIG.REMINDER_INTERVALS) {
      const reminderDeadline = new Date(
        sessionTime.getTime() - reminder.milliseconds
      );

      const lateByMilliseconds =
        currentTime.getTime() - reminderDeadline.getTime();

      // The reminder deadline must have passed.
      if (lateByMilliseconds < 0) {
        continue;
      }

      // Skip reminders that exceed their allowed grace period.
      if (lateByMilliseconds > reminder.gracePeriodMilliseconds) {
        continue;
      }

      dueReminders.push({
        ...session,
        reminder: reminder.name,
        reminderDeadline: reminderDeadline.toISOString(),
        lateByMilliseconds: lateByMilliseconds
      });
    }
  }

  Logger.log("Found " + dueReminders.length + " due reminder(s).");

  return dueReminders;
}
