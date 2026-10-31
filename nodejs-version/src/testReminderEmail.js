import "dotenv/config";

import { getCurrentSeasonSchedule } from "./api/jolpica.js";
import { getUpcomingSessions } from "./services/nextSessionService.js";
import { findDueReminders } from "./services/reminderEngine.js";

console.log("Testing all F1 reminder intervals...\n");

const schedule = await getCurrentSeasonSchedule();

const races = schedule.MRData.RaceTable.Races;

const upcomingSessions = getUpcomingSessions(races);

const testSession = upcomingSessions[0];

if (!testSession) {
  throw new Error("No upcoming F1 sessions found.");
}

console.log("Test session:");
console.log(`${testSession.grandPrix} - ${testSession.session}`);
console.log(`Session time: ${testSession.dateTime}\n`);

const reminderIntervals = [
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

for (const interval of reminderIntervals) {
  const fakeCurrentTime = new Date(
    new Date(testSession.dateTime).getTime() -
    interval.milliseconds
  );

  const dueReminders = findDueReminders(
    [testSession],
    fakeCurrentTime
  );

  console.log(`Testing ${interval.name} before session...`);

  if (dueReminders.length === 0) {
    console.log("❌ FAILED - No reminder detected.\n");
    continue;
  }

  console.log(
    `✅ PASSED - Detected: ${dueReminders[0].reminder}`
  );

  console.log(
    `Simulated time: ${fakeCurrentTime.toISOString()}\n`
  );
}

console.log("Reminder interval test completed.");