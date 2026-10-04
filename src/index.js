import { getCurrentSeasonSchedule } from "./api/jolpica.js";
import { getUpcomingSessions } from "./services/nextSessionService.js";
import { findDueReminders } from "./services/reminderEngine.js";

console.log("F1 Email Bot is starting...\n");

const schedule = await getCurrentSeasonSchedule();

const races = schedule.MRData.RaceTable.Races;

const upcomingSessions = getUpcomingSessions(races);

console.log(`Found ${upcomingSessions.length} upcoming sessions.\n`);

const dueReminders = findDueReminders(
  upcomingSessions,
  new Date()
);

if (dueReminders.length === 0) {
  console.log("No reminders are due right now.");
} else {
  console.log("DUE REMINDERS:\n");

  for (const reminder of dueReminders) {
    console.log(
      `${reminder.reminder} - ${reminder.session} - ${reminder.grandPrix}`
    );
  }
}