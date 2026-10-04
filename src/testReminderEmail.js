import "dotenv/config";

import { getCurrentSeasonSchedule } from "./api/jolpica.js";
import { getUpcomingSessions } from "./services/nextSessionService.js";
import { findDueReminders } from "./services/reminderEngine.js";
import { createReminderEmail } from "./templates/emailTemplate.js";
import {
  getGmailClient,
  sendEmail
} from "./services/gmailService.js";

console.log("Starting F1 reminder test...\n");

const schedule = await getCurrentSeasonSchedule();

const races = schedule.MRData.RaceTable.Races;

const upcomingSessions = getUpcomingSessions(races);

// Find Singapore Practice 1
const testSession = upcomingSessions.find(
  (session) =>
    session.grandPrix === "Singapore Grand Prix" &&
    session.session === "Practice 1"
);

if (!testSession) {
  throw new Error("Singapore Practice 1 could not be found.");
}

console.log("Test session:");
console.log(testSession);

// Simulate exactly 24 hours before the session
const fakeCurrentTime = new Date(
  new Date(testSession.dateTime).getTime() -
  24 * 60 * 60 * 1000
);

console.log("\nSimulated current time:");
console.log(fakeCurrentTime.toISOString());

const dueReminders = findDueReminders(
  [testSession],
  fakeCurrentTime
);

if (dueReminders.length === 0) {
  console.log("\nNo reminder detected.");
  process.exit(0);
}

const reminder = dueReminders[0];

console.log("\nReminder detected:");
console.log(reminder.reminder);

const email = createReminderEmail({
  grandPrix: reminder.grandPrix,
  session: {
    name: reminder.session,
    dateTime: reminder.dateTime
  },
  circuit: reminder.circuit,
  reminderText: reminder.reminder
});

console.log("\nSubject:");
console.log(email.subject);

console.log("\nSending email...");

const gmail = await getGmailClient();

const result = await sendEmail({
  gmail,
  to: process.env.RECEIVER_EMAIL,
  subject: email.subject,
  html: email.html
});

console.log("\nEmail sent successfully!");
console.log("Message ID:", result.id);