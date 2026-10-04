import { getGmailClient } from "./services/gmailService.js";

console.log("Testing Gmail API...\n");

const gmail = await getGmailClient();

const profile = await gmail.users.getProfile({
  userId: "me"
});

console.log("Gmail API authentication successful.");
console.log("Authenticated Gmail:", profile.data.emailAddress);