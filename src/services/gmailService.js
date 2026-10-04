import path from "node:path";
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send"
];

const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "credentials",
  "client_secret.json"
);

export async function getGmailClient() {
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH
  });

  // Make sure we actually have a valid access token
  const accessToken = await auth.getAccessToken();

  if (!accessToken.token) {
    throw new Error("Failed to obtain Gmail access token.");
  }

  console.log("Gmail access token obtained.");

  return google.gmail({
    version: "v1",
    auth
  });
}

export async function sendEmail({
  gmail,
  to,
  subject,
  html
}) {
  const message = [
    `To: ${to}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    `Subject: ${subject}`,
    "",
    html
  ].join("\r\n");

  const encodedMessage = Buffer
    .from(message)
    .toString("base64url");

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage
    }
  });

  return response.data;
}