# F1 Session Reminder Bot — Google Apps Script

An automated Formula 1 session reminder bot that monitors the current F1 season and sends email notifications before upcoming sessions.

Built using **Google Apps Script**, **Jolpica F1 API**, and Gmail's built-in email service.

## Features

- Automatically retrieves the current Formula 1 season schedule.
- Supports both regular and Sprint weekends.
- Tracks Practice, Sprint Qualifying, Sprint, Qualifying, and Race sessions.
- Sends email reminders at three intervals:
  - 24 hours before a session
  - 1 hour before a session
  - 30 minutes before a session
- Converts session times to Indian Standard Time (IST).
- Uses smart recovery to handle delayed executions.
- Prevents duplicate reminders using persistent state.
- Runs automatically every 15 minutes using a time-driven trigger.
- Sends formatted HTML emails with an F1-inspired design.

## Tech Stack

| Technology | Purpose |
|---|---|
| Google Apps Script | Automation and execution |
| JavaScript (V8) | Application logic |
| Jolpica F1 API | Formula 1 schedule data |
| MailApp | Email delivery |
| Script Properties | Configuration and persistent state |
| HTML/CSS | Email template |

## Project Structure

```text
app-script-version/
├── appsscript.json
├── Code.gs
├── Config.gs
├── DateUtils.gs
├── EmailService.gs
├── EmailTemplate.html
├── JolpicaService.gs
├── ReminderService.gs
├── SessionService.gs
└── StateService.gs
```

### File Responsibilities

| File | Responsibility |
|---|---|
| `Code.gs` | Main execution flow, orchestration, and initialization |
| `Config.gs` | Timezone, API configuration, reminder intervals, and grace periods |
| `JolpicaService.gs` | Retrieves and validates the F1 season schedule |
| `SessionService.gs` | Extracts and organizes upcoming F1 sessions |
| `ReminderService.gs` | Determines which reminders are eligible to be sent |
| `StateService.gs` | Tracks sent reminders and the last successful execution |
| `EmailService.gs` | Renders and sends reminder emails |
| `DateUtils.gs` | Formats dates and times |
| `EmailTemplate.html` | HTML email template and visual design |
| `appsscript.json` | Apps Script project configuration |

## How It Works

The bot follows this execution flow:

1. A time-driven trigger executes `checkReminders()`.
2. A script lock prevents overlapping executions.
3. The bot fetches the current season's schedule from the Jolpica API.
4. Upcoming sessions are extracted and their timestamps are processed.
5. The reminder engine checks whether any reminder deadlines fall within their allowed grace periods.
6. Previously sent reminders are skipped.
7. Eligible reminders are converted into formatted HTML emails.
8. Emails are sent using Google Apps Script's `MailApp`.
9. Successfully sent reminders are recorded in Script Properties.
10. The last successful execution time is updated.

## Smart Recovery

The bot uses individual grace periods to handle delayed executions.

For example, if an execution is delayed, the bot can still send a reminder provided the delay does not exceed the configured grace period.

| Reminder | Reminder deadline | Allowed grace period |
|---|---|---|
| 24 hours | 24 hours before session | 30 minutes |
| 1 hour | 1 hour before session | 15 minutes |
| 30 minutes | 30 minutes before session | 10 minutes |

### Recovery Behavior

- If a reminder deadline is still in the future, it is not sent.
- If the deadline has passed but remains within its grace period, it is eligible.
- If the deadline exceeds its grace period, it is skipped.
- If a reminder has already been sent, it is skipped to prevent duplication.

This approach avoids sending significantly delayed reminders while allowing the bot to recover from short execution delays.

## Configuration

The project uses Google Apps Script Script Properties.

Open:

**Apps Script → Project Settings → Script Properties**

Configure the following properties:

| Property | Description |
|---|---|
| `RECEIVER_EMAIL` | Gmail address that receives reminders |
| `TIMEZONE` | Timezone used by the application |

Example:

```text
RECEIVER_EMAIL = your_email@gmail.com
TIMEZONE = Asia/Kolkata
```

The sending Gmail account is the Google account that owns or authorizes the Apps Script project.

No Gmail App Password is required because the project uses Google's built-in `MailApp` service.

The application timezone should also be configured in:

**Apps Script → Project Settings → Time zone → (GMT+05:30) Kolkata**

## Setup Instructions

### 1. Create an Apps Script Project

1. Open [Google Apps Script](https://script.google.com/).
2. Create a new project.
3. Name it `F1 Session Reminder Bot`.
4. Enable the V8 runtime.

### 2. Add Project Files

Create the `.gs` and HTML files listed in the project structure.

Copy the corresponding source code from this directory into the Apps Script project.

### 3. Configure Script Properties

Add the following properties:

- `RECEIVER_EMAIL`
- `TIMEZONE`

Use your intended receiving email address and `Asia/Kolkata`.

### 4. Configure the Project Timezone

Set the Apps Script project timezone to Kolkata (GMT+05:30).

### 5. Authorize the Application

Run the initialization function and authorize the requested Google permissions.

### 6. Initialize the Bot

Select and execute:

```javascript
initializeBot();
```

This initializes the last successful execution checkpoint if it does not already exist.

### 7. Create the Automatic Trigger

Open **Triggers** in the Apps Script sidebar and create a time-driven trigger:

| Setting | Value |
|---|---|
| Function | `checkReminders` |
| Event source | Time-driven |
| Trigger type | Minutes timer |
| Interval | Every 15 minutes |
| Failure notifications | Daily |

The bot will now check for upcoming session reminders automatically.

## Testing

The project includes two main testing functions:

### `testReminderPipeline()`

Performs a dry run of the reminder pipeline.

It:
- Retrieves the latest F1 schedule.
- Identifies upcoming sessions.
- Evaluates eligible reminders.
- Logs the results.

It does not send emails or update reminder history.

### `checkReminders()`

Executes the actual reminder pipeline.

It:
- Retrieves the schedule.
- Identifies eligible reminders.
- Checks duplicate-prevention state.
- Sends eligible emails.
- Records successfully sent reminders.

Use this function carefully when testing because it can send real emails.

## Email Design

The email template uses a dark F1-inspired visual theme.

It includes:

- Grand Prix name and round number
- Country
- Session name
- Session date and start time in IST
- Countdown until the session starts
- Circuit name

## API Reference

The project uses the Jolpica F1 API, a community-maintained successor to the Ergast Developer API.

Schedule endpoint:

[https://api.jolpi.ca/ergast/f1/current.json](https://api.jolpi.ca/ergast/f1/current.json)

The API provides race-calendar information, including Grand Prix details and session dates.

## Limitations

- Requires an internet connection to retrieve the F1 schedule.
- Depends on the availability of the Jolpica API.
- Depends on Google Apps Script execution limits and email quotas.
- Reminder delivery depends on the configured trigger executing successfully.
- The project provides schedule-based reminders, not live race updates or telemetry.

## Future Improvements

Potential improvements include:

- Better execution and error monitoring.
- More detailed reminder delivery logs.
- Configurable reminder intervals.
- Support for additional timezones.
- Improved recovery and failure reporting.

## License

This project is intended as a personal learning and automation project.

Check the repository's root license file for applicable licensing terms.
