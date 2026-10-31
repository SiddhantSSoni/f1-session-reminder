# F1 Session Reminder Bot 🏎️

An automated Formula 1 session reminder system that sends email notifications before upcoming F1 sessions.

The project currently has two implementations: an original Node.js version and a newer Google Apps Script version.

## Features

- Fetches the current Formula 1 calendar using the Jolpica API.
- Supports regular and Sprint race weekends.
- Sends reminders 24 hours, 1 hour, and 30 minutes before sessions.
- Automatically converts session timings to Indian Standard Time (IST).
- Uses custom HTML email templates.
- Prevents duplicate reminders through persistent state tracking.
- Runs automatically without requiring a continuously running local computer.

## Project Structure

```text
f1-email-bot/
│
├── nodejs-version/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   └── README.md
│
├── app-script-version/
│   ├── appsscript.json
│   ├── Code.gs
│   ├── Config.gs
│   ├── DateUtils.gs
│   ├── EmailService.gs
│   ├── EmailTemplate.html
│   ├── JolpicaService.gs
│   ├── ReminderService.gs
│   ├── SessionService.gs
│   └── StateService.gs
│
├── archive/
│   └── old-reminder-state/
│       └── reminderState.json
│
├── .github/
├── .gitignore
└── README.md
```

## Implementations

### 1. Node.js Version

The original implementation uses Node.js, Nodemailer, Gmail SMTP, GitHub Actions, and cron-job.org.

See [Node.js Documentation](nodejs-version/README.md).

### 2. Google Apps Script Version

The newer implementation uses Google Apps Script, the Jolpica API, and Google's native MailApp service.

It uses a time-driven trigger configured to execute every 15 minutes.

See [Apps Script Documentation](app-script-version/README.md).

## Technology Stack

| Component | Technology |
|---|---|
| Language | JavaScript |
| F1 Schedule API | Jolpica F1 API |
| Email Delivery | Google MailApp |
| Email Design | HTML and CSS |
| Automation | Google Apps Script |
| Timezone | Asia/Kolkata (IST) |

## Project Status

The project has migrated from its original Node.js implementation to Google Apps Script.

The Apps Script implementation has successfully completed its initial automated execution. Live reminder delivery is still undergoing verification.

The original Node.js implementation is retained for reference and backup.

## Configuration and Security

- Email recipient configuration is stored in Google Apps Script Properties.
- The Apps Script sender account authorizes email delivery.
- Credentials, passwords, and access tokens must never be committed to GitHub.
- The `.env.example` file contains placeholders only.

## License

Add your chosen license here.
