import "dotenv/config";

import {
  getGmailClient,
  sendEmail
} from "./services/gmailService.js";

console.log("Starting Gmail email test...\n");

const gmail = await getGmailClient();

const result = await sendEmail({
  gmail,
  to: process.env.RECEIVER_EMAIL,
  subject: "F1 Email Bot - Test Email",
  html: `
    <h1>🏁 F1 Email Bot</h1>

    <h2>Gmail test successful</h2>

    <p>This is a test email from your F1 Email Bot.</p>

    <p>Gmail API is working correctly.</p>
  `
});

console.log("Email sent successfully.");
console.log("Message ID:", result.id);