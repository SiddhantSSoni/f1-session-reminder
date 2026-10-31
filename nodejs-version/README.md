# 🏎️ F1 Session Reminder Bot

An automated, email-based reminder bot that keeps you updated about upcoming Formula 1 sessions. It fetches the F1 calendar, identifies upcoming sessions, and sends email notifications before each session begins — so you never miss a race weekend.

The project is built with **Node.js, the Jolpica F1 API, Nodemailer, GitHub Actions, and cron-job.org**, with a focus on automation and zero operating cost.

## ✨ Features

- **Automated F1 schedule retrieval:** Fetches the current season's calendar using the Jolpica F1 API.
- **Multiple reminder intervals:** Sends reminders 24 hours, 1 hour, and 30 minutes before a session.
- **Complete session coverage:** Supports Practice 1, Practice 2, Practice 3, Sprint Qualifying, Sprint, Qualifying, and Race.
- **Sprint weekend support:** Handles optional Sprint and Sprint Qualifying sessions when they appear in the schedule.
- **IST time formatting:** Displays session dates and times in Indian Standard Time (IST).
- **Email notifications:** Sends formatted HTML emails through Gmail using Nodemailer.
- **Duplicate prevention:** Records sent reminders to avoid sending the same reminder repeatedly.
- **Scheduled execution:** Uses cron-job.org to trigger GitHub Actions automatically every 10 minutes.
- **Zero-cost setup:** Uses free services and GitHub Actions' available free usage, subject to their applicable limits.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Application runtime |
| JavaScript (ES Modules) | Application logic |
| Jolpica F1 API | Retrieves the F1 season schedule |
| Axios | Makes HTTP requests to the API |
| Nodemailer | Sends email notifications |
| Gmail SMTP | Email delivery |
| GitHub Actions | Runs the bot |
| cron-job.org | Triggers scheduled workflow executions |
| dotenv | Loads environment variables locally |

## 🏗️ Architecture

```text
cron-job.org
     |
     | Every 10 minutes
     v
GitHub Actions Workflow
     |
     v
Node.js Application
     |
     +----> Jolpica F1 API
     |           |
     |           v
     |     Retrieve F1 Schedule
     |
     +----> Identify Upcoming Sessions
     |
     +----> Check Reminder Windows
     |
     +----> Check Previously Sent Reminders
     |
     +----> Generate HTML Email
     |           |
     |           v
     |       Gmail SMTP
     |           |
     |           v
     |      Email Inbox
     |
     +----> Update Reminder State
```

### How it works

1. cron-job.org sends a request to the GitHub API to trigger the workflow.
2. GitHub Actions checks out the repository and installs the project dependencies.
3. The Node.js application retrieves the F1 calendar from the Jolpica API.
4. The application identifies upcoming sessions and checks whether a reminder is due.
5. Before sending an email, the application checks its saved reminder state to prevent duplicates.
6. If a reminder is due and has not already been sent, the bot generates the email and sends it through Gmail SMTP.
7. The workflow saves any changes to the reminder state in the repository.

## 📧 Reminder Schedule

The bot supports three reminders for every scheduled session.

| Reminder | Notification timing |
|---|---|
| 24-hour reminder | Approximately one day before the session |
| 1-hour reminder | Approximately one hour before the session |
| 30-minute reminder | Approximately 30 minutes before the session |

The application checks for reminders within a five-minute tolerance of each target time. Because the workflow runs every 10 minutes, actual delivery may vary depending on the scheduler and GitHub Actions startup time.

### Supported sessions

- Practice 1
- Practice 2
- Practice 3
- Sprint Qualifying
- Sprint
- Qualifying
- Race

Sessions that are not scheduled for a particular Grand Prix are skipped.

### Email format

**Subject:**

`F1 Reminder - Practice 1, Singapore Grand Prix`

**Email body includes:**

- Grand Prix name and country flag
- Session name
- Session date and day
- Starting time in IST
- Time remaining until the session
- Circuit name

## 📁 Project Structure

```text
f1-email-bot/
├── .github/
│   └── workflows/
│       └── f1-reminder.yml
├── src/
│   ├── api/
│   │   └── jolpica.js
│   ├── data/
│   │   └── reminderState.json
│   ├── services/
│   │   ├── gmailService.js
│   │   ├── nextSessionService.js
│   │   ├── reminderEngine.js
│   │   ├── reminderService.js
│   │   ├── reminderStateService.js
│   │   └── scheduleService.js
│   ├── templates/
│   │   └── emailTemplate.js
│   ├── utils/
│   │   ├── formatters.js
│   │   └── timezone.js
│   ├── index.js
│   ├── testEmail.js
│   └── testReminderEmail.js
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

### Key modules

| File | Responsibility |
|---|---|
| `src/index.js` | Main entry point that coordinates the reminder workflow |
| `src/api/jolpica.js` | Fetches the F1 calendar |
| `src/services/nextSessionService.js` | Identifies upcoming sessions |
| `src/services/scheduleService.js` | Schedule-related processing |
| `src/services/reminderService.js` | Determines whether a reminder is due |
| `src/services/reminderEngine.js` | Finds sessions with due reminders |
| `src/services/reminderStateService.js` | Tracks previously sent reminders |
| `src/services/gmailService.js` | Configures Gmail SMTP and sends emails |
| `src/templates/emailTemplate.js` | Generates the HTML email template |
| `src/utils/formatters.js` | Formats dates and times in IST |
| `src/utils/timezone.js` | Timezone-related utilities |
| `src/data/reminderState.json` | Stores the identifiers of sent reminders |
| `.github/workflows/f1-reminder.yml` | Defines the GitHub Actions workflow |

## ⚙️ Prerequisites

Before running the project locally, ensure you have:

- [Node.js](https://nodejs.org/) installed.
- npm, which is included with Node.js.
- A Gmail account for sending notifications.
- A Gmail App Password for SMTP authentication.
- A GitHub account for automated execution.
- A cron-job.org account for scheduling workflow triggers.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SiddhantSSoni/f1-session-reminder.git
cd f1-session-reminder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create your local `.env` file from the example:

```powershell
Copy-Item .env.example .env
```

Add your own values to `.env`:

```env
SENDER_EMAIL=your_sender_email@gmail.com
RECEIVER_EMAIL=your_receiver_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

Replace the placeholder values with your own credentials.

**Important:** Never commit your `.env` file or expose your Gmail App Password. Ensure `.env` is excluded by `.gitignore`.

### 4. Configure Gmail SMTP

1. Enable two-step verification on the sending Google account.
2. Generate a Google App Password, if your account is eligible.
3. Store the App Password in the `GMAIL_APP_PASSWORD` environment variable.
4. Use the sending Gmail address as `SENDER_EMAIL`.
5. Set `RECEIVER_EMAIL` to the address where you want reminders delivered.

An App Password is used instead of your normal Gmail account password.

### 5. Run the bot locally

```bash
npm start
```

If the `start` script is not configured in `package.json`, run:

```bash
node src/index.js
```

The application fetches the schedule, checks for due reminders, and sends emails when appropriate.

If no reminder is due, the application exits without sending an email.

## ☁️ Automated Deployment

The bot uses GitHub Actions for execution and cron-job.org for scheduling. No continuously running personal computer or server is required.

### 1. Configure GitHub repository secrets

In your repository, navigate to:

**Settings → Secrets and variables → Actions → New repository secret**

Add the following secrets:

| Secret name | Value |
|---|---|
| `SENDER_EMAIL` | Gmail address used to send emails |
| `RECEIVER_EMAIL` | Email address receiving reminders |
| `GMAIL_APP_PASSWORD` | Gmail App Password |

Do not place credentials directly in the workflow YAML file.

### 2. Configure GitHub Actions

The workflow file is located at:

`.github/workflows/f1-reminder.yml`

It checks out the repository, sets up Node.js, installs dependencies, runs `src/index.js`, and saves changes to the reminder state.

The workflow supports manual execution through GitHub's **Actions** tab using the `workflow_dispatch` trigger.

### 3. Configure cron-job.org

Create a scheduled job on [cron-job.org](https://cron-job.org/) with the following configuration:

- **Method:** POST
- **Schedule:** Every 10 minutes
- **URL:**

```text
https://api.github.com/repos/SiddhantSSoni/f1-session-reminder/actions/workflows/f1-reminder.yml/dispatches
```

- **Authorization header:**

```text
Authorization: Bearer YOUR_GITHUB_TOKEN
```

- **Content-Type header:**

```text
Content-Type: application/json
```

- **Request body:**

```json
{
  "ref": "main"
}
```

Replace `YOUR_GITHUB_TOKEN` with an appropriately scoped GitHub fine-grained personal access token. Grant the token the repository's required **Actions: Read and write** permission, and restrict access to the intended repository.

Keep the token private and store it securely in cron-job.org.

### 4. Verify the workflow

1. Enable the scheduled job on cron-job.org.
2. Confirm that the request succeeds.
3. Open the repository's **Actions** tab.
4. Check that the `F1 Email Reminder` workflow starts.
5. Review the logs to confirm whether reminders are due and whether emails are sent successfully.

A successful run with no reminder due is normal.

## 🔒 Duplicate Prevention

The application creates a unique identifier for each reminder using the Grand Prix, session name, session date/time, and reminder interval.

For example:

```text
Singapore Grand Prix|Practice 1|2026-10-09T08:30:00Z|24 hours
```

Before sending an email, the bot checks whether this identifier exists in `reminderState.json`.

After a successful email send, the identifier is recorded. The GitHub Actions workflow then commits and pushes state changes to the repository.

This helps prevent repeated emails when the workflow runs multiple times during the same reminder window.

## 🧪 Testing

The project includes scripts for testing email delivery and reminder detection.

Email delivery test:

```bash
node src/testEmail.js
```

Reminder timing test:

```bash
node src/testReminderEmail.js
```

These tests help verify email connectivity and reminder timing logic. They should be run deliberately because an email test may send an actual message.

## 🌐 API Reference

The application uses the Jolpica F1 API, an API compatible with the former Ergast Developer API.

**Endpoint:**

[https://api.jolpi.ca/ergast/f1/current.json](https://api.jolpi.ca/ergast/f1/current.json)

The response contains information about the current season's Grands Prix, circuits, and scheduled sessions.

The application processes this data to identify upcoming sessions and determine which reminders should be sent.

## 💰 Cost

The project is designed to run at zero monetary cost using free service tiers.

| Service | Usage |
|---|---|
| Jolpica F1 API | Retrieve the race calendar |
| Gmail SMTP | Deliver reminder emails |
| GitHub Actions | Execute the application |
| cron-job.org | Schedule workflow triggers |
| GitHub | Host the source code |

Free-service availability, usage quotas, and service policies may change. GitHub Actions usage is subject to the limits of the account and repository.

## ⚠️ Limitations

- Email delivery depends on Gmail SMTP availability and authentication.
- Reminder delivery depends on cron-job.org and GitHub Actions being available.
- GitHub-hosted runner delays can cause reminders to arrive late.
- The application relies on the accuracy and availability of the Jolpica F1 schedule.
- Reminder state is stored in the repository, so concurrent workflow runs should be avoided.
- The bot provides schedule reminders only; it does not provide live timing, telemetry, race results, or live race feeds.
- Notifications are sent by email only; there is no WhatsApp integration or interactive command system.

## 🔮 Future Improvements

Potential improvements include:

- More robust handling of schedule changes and session rescheduling.
- Better recovery from temporary API or email failures.
- Automated tests for session parsing, reminder detection, and duplicate prevention.
- Improved handling of concurrent workflow executions.
- Monitoring and reporting of failed reminder deliveries.

## 📄 License

No license has been specified yet. Unless a license is added to the repository, the project should not be assumed to be open source or freely reusable by others.

---

**Built as a personal automation project to make following Formula 1 weekends easier, one reminder at a time.** 🏁
