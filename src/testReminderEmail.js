import "dotenv/config";

import { getCurrentSeasonSchedule } from "./api/jolpica.js";
import { getUpcomingSessions } from "./services/nextSessionService.js";
import { findDueReminders } from "./services/reminderEngine.js";
import { createReminderEmail } from "./templates/emailTemplate.js";
import {
  getGmailClient,
  sendEmail
} from "./services/gmailService.js";
import {
  createReminderId,
  hasReminderBeenSent,
  markReminderAsSent
} from "./services/reminderStateService.js";

console.log("Starting full reminder test...\n");

// Get current F1 schedule
const schedule = await getCurrentSeasonSchedule();

const races = schedule.MRData.RaceTable.Races;

const upcomingSessions = getUpcomingSessions(races);

// Find a session to test
const testSession = upcomingSessions[0];

if (!testSession) {
  throw new Error("No upcoming F1 sessions found.");
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

// Check for due reminder
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

// Create unique reminder ID
const reminderId = createReminderId({
  grandPrix: reminder.grandPrix,
  session: reminder.session,
  dateTime: reminder.dateTime,
  reminder: reminder.reminder
});

console.log("\nReminder ID:");
console.log(reminderId);

// Check state
if (hasReminderBeenSent(reminderId)) {
  console.log("\nThis reminder has already been sent.");
  console.log("Test stopped to prevent duplicate email.");
  process.exit(0);
}

// Create email
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

// Send email
console.log("\nSending email...");

const gmail = getGmailClient();

const result = await sendEmail({
  gmail,
  to: process.env.RECEIVER_EMAIL,
  subject: email.subject,
  html: email.html
});

console.log("\nEmail sent successfully!");
console.log("Message ID:", result.messageId);

// Mark as sent
markReminderAsSent(reminderId);

console.log("\nReminder marked as sent.");
console.log("Full reminder flow test completed successfully.");