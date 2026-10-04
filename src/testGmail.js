import { getGmailClient } from "./services/gmailService.js";

console.log("Starting Gmail authentication...");

const gmail = await getGmailClient();

console.log("Gmail authentication successful.");
console.log("Gmail API client created.");