import "dotenv/config";

import { getCurrentSeasonSchedule } from "./api/jolpica.js";
import { getUpcomingSessions } from "./services/nextSessionService.js";
import { findDueReminders } from "./services/reminderEngine.js";
import {
  createReminderId,
  hasReminderBeenSent,
  markReminderAsSent
} from "./services/reminderStateService.js";
import { createReminderEmail } from "./templates/emailTemplate.js";
import {
  getGmailClient,
  sendEmail
} from "./services/gmailService.js";

console.log("F1 Email Bot is starting...\n");

// 1. Get the current F1 schedule
const schedule = await getCurrentSeasonSchedule();

const races = schedule.MRData.RaceTable.Races;

// 2. Find all upcoming sessions
const upcomingSessions = getUpcomingSessions(races);

console.log(`Found ${upcomingSessions.length} upcoming sessions.\n`);

// 3. Find reminders that are due right now
const dueReminders = findDueReminders(
  upcomingSessions,
  new Date()
);

if (dueReminders.length === 0) {
  console.log("No reminders are due right now.");
  process.exit(0);
}

console.log(`Found ${dueReminders.length} due reminder(s).\n`);

// 4. Create Gmail connection only when we actually need to send something
const gmail = getGmailClient();

for (const reminder of dueReminders) {
  const reminderId = createReminderId({
    grandPrix: reminder.grandPrix,
    session: reminder.session,
    dateTime: reminder.dateTime,
    reminder: reminder.reminder
  });

  console.log(
    `Checking: ${reminder.reminder} - ${reminder.session} - ${reminder.grandPrix}`
  );

  // 5. Prevent duplicate emails
  if (hasReminderBeenSent(reminderId)) {
    console.log("Already sent. Skipping.\n");
    continue;
  }

  // 6. Create the email
  const email = createReminderEmail({
  grandPrix: reminder.grandPrix,
  country: reminder.country,
  session: {
    name: reminder.session,
    dateTime: reminder.dateTime
  },
  circuit: reminder.circuit,
  reminderText: reminder.reminder
});

  // 7. Send the email
  const result = await sendEmail({
    gmail,
    to: process.env.RECEIVER_EMAIL,
    subject: email.subject,
    html: email.html
  });

  console.log(`Email sent successfully. Message ID: ${result.messageId}`);

  // 8. Record that this reminder has been sent
  markReminderAsSent(reminderId);

  console.log("Reminder marked as sent.\n");
}

console.log("F1 Email Bot finished.");