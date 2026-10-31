import "dotenv/config";
import nodemailer from "nodemailer";

export function getGmailClient() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  return transporter;
}

export async function sendEmail({
  gmail,
  to,
  subject,
  html
}) {
  const result = await gmail.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html
  });

  return result;
}