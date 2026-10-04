const REMINDERS = [
  {
    name: "24 hours",
    milliseconds: 24 * 60 * 60 * 1000
  },
  {
    name: "1 hour",
    milliseconds: 60 * 60 * 1000
  },
  {
    name: "30 minutes",
    milliseconds: 30 * 60 * 1000
  }
];

export function getDueReminder(sessionDateTime, currentTime = new Date()) {
  const sessionTime = new Date(sessionDateTime);

  const timeUntilSession = sessionTime.getTime() - currentTime.getTime();

  for (const reminder of REMINDERS) {
    const difference = Math.abs(
      timeUntilSession - reminder.milliseconds
    );

    // Allow a 5-minute window around the reminder time
    const fiveMinutes = 5 * 60 * 1000;

    if (difference <= fiveMinutes) {
      return reminder.name;
    }
  }

  return null;
}