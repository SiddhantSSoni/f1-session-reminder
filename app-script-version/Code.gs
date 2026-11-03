
function checkReminders() {

  // Prevent overlapping executions
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(10000)) {
    Logger.log("Another execution is already running. Skipping.");
    return;
  }

  try {
    const currentTime = new Date();

    Logger.log("=================================");
    Logger.log("F1 REMINDER CHECK STARTED");
    Logger.log("Current time: " + currentTime.toISOString());
    Logger.log("=================================");

    // 1. Fetch the current F1 season schedule
    const schedule = getCurrentSeasonSchedule();

    const races = schedule.MRData.RaceTable.Races;

    // 2. Identify upcoming sessions
    const upcomingSessions = getUpcomingSessions(
      races,
      currentTime
    );

  
    // 3. Find reminders that are due or eligible for smart recovery
    const dueReminders = getDueReminders(
      upcomingSessions,
      currentTime
    );

    if (dueReminders.length === 0) {
      Logger.log("No reminders are due right now.");
    }

    // 4. Process each due reminder
    for (const reminder of dueReminders) {

      const reminderId = createReminderId(reminder);

      // Skip reminders that have already been sent
      if (hasReminderBeenSent(reminderId)) {
        Logger.log(
          "Already sent. Skipping: " +
          reminder.session +
          " - " +
          reminder.grandPrix
        );
        continue;
      }

      // Convert reminder interval into countdown text
      const countdownLabels = {
        "24 hours": "24:00:00",
        "1 hour": "01:00:00",
        "30 minutes": "00:30:00"
      };

      const countdown = countdownLabels[reminder.reminder];

      if (!countdown) {
        throw new Error(
          "Unknown reminder interval: " + reminder.reminder
        );
      }

      // 5. Prepare dynamic email information
      const emailData = {
        roundNumber: reminder.roundNumber,
        country: reminder.country.toUpperCase(),
        grandPrix: reminder.grandPrix.toUpperCase(),
        sessionName: reminder.session.toUpperCase(),
        date: formatDate(reminder.dateTime),
        startTime: formatTime(reminder.dateTime),
        countdown: countdown,
        circuit: reminder.circuit
      };

      // 6. Generate the HTML email
      const htmlBody = renderEmailTemplate(emailData);

      const subject =
        "F1 Reminder - " +
        reminder.session +
        ", " +
        reminder.grandPrix;

      // 7. Send the email
      sendEmail(subject, htmlBody);

      // 8. Mark the reminder as sent only after successful sending
      markReminderAsSent(reminderId);

      Logger.log(
        "Reminder successfully processed: " +
        reminder.reminder +
        " - " +
        reminder.session +
        " - " +
        reminder.grandPrix +
        " | Delay: " +
        Math.round(reminder.lateByMilliseconds / 60000) +
        " minute(s)"
      );  
    }

    // Update the check time only after all reminders are processed
    setPreviousCheckTime(currentTime);

    Logger.log("F1 REMINDER CHECK COMPLETED SUCCESSFULLY.");

  } catch (error) {

    Logger.log("F1 REMINDER ERROR: " + error.message);

    // Re-throw so Apps Script records the failed execution
    throw error;

  } finally {

    // Always release the execution lock
    lock.releaseLock();
  }
}





function testReminderPipeline() {

  Logger.log("========== DRY RUN STARTED ==========");

  const currentTime = new Date();

  // 1. Fetch the live F1 schedule
  const schedule = getCurrentSeasonSchedule();
  const races = schedule.MRData.RaceTable.Races;

  // 2. Find upcoming sessions
  const upcomingSessions = getUpcomingSessions(
    races,
    currentTime
  );

  Logger.log(
    "Upcoming sessions found: " + upcomingSessions.length
  );

  // 3. Detect due reminders using smart recovery
const dueReminders = getDueReminders(
  upcomingSessions,
  currentTime
);

  Logger.log("Due reminders: " + dueReminders.length);

  // 5. Generate email previews without sending
  for (const reminder of dueReminders) {

    const countdownLabels = {
      "24 hours": "24:00:00",
      "1 hour": "01:00:00",
      "30 minutes": "00:30:00"
    };

    const emailData = {
      roundNumber: reminder.roundNumber,
      country: reminder.country.toUpperCase(),
      grandPrix: reminder.grandPrix.toUpperCase(),
      sessionName: reminder.session.toUpperCase(),
      date: formatDate(reminder.dateTime),
      startTime: formatTime(reminder.dateTime),
      countdown: countdownLabels[reminder.reminder],
      circuit: reminder.circuit
    };

    const htmlBody = renderEmailTemplate(emailData);

    Logger.log(
      "PREVIEW: " +
      reminder.reminder +
      " - " +
      reminder.session +
      " - " +
      reminder.grandPrix
    );

    Logger.log("Generated HTML length: " + htmlBody.length);
  }

  Logger.log("========== DRY RUN COMPLETED ==========");
}





function initializeBot() {

  const previousCheckTime = getPreviousCheckTime();

  if (previousCheckTime) {
    Logger.log(
      "Bot already initialized. Existing checkpoint: " +
      previousCheckTime.toISOString()
    );
    return;
  }

  const now = new Date();

  setPreviousCheckTime(now);

  Logger.log(
    "F1 Reminder Bot initialized successfully."
  );

  Logger.log(
    "Initial checkpoint: " + now.toISOString()
  );
}



function testSmartRecoveryLogic() {
  Logger.log("========== SMART RECOVERY TESTS ==========");

  const sessionTime = new Date("2026-11-10T12:00:00Z");

  const testSession = {
    dateTime: sessionTime.toISOString(),
    session: "Race",
    grandPrix: "Test Grand Prix",
    roundNumber: "1",
    country: "Test Country",
    circuit: "Test Circuit"
  };

  let passed = 0;
  let failed = 0;

  function runTest(name, reminderConfig, delay, expected) {
    const deadline = new Date(
      sessionTime.getTime() - reminderConfig.milliseconds
    );

    const simulatedTime = new Date(
      deadline.getTime() + delay
    );

    const results = getDueReminders(
      [testSession],
      simulatedTime
    );

    const found = results.some(
      reminder => reminder.reminder === reminderConfig.name
    );

    const success = found === expected;

    if (success) {
      passed++;
      Logger.log("PASS: " + name);
    } else {
      failed++;
      Logger.log(
        "FAIL: " + name +
        " | Expected: " + expected +
        " | Actual: " + found
      );
    }
  }

  for (const reminder of CONFIG.REMINDER_INTERVALS) {
    const grace = reminder.gracePeriodMilliseconds;

    runTest(
      reminder.name + " - Exactly on time",
      reminder,
      0,
      true
    );

    runTest(
      reminder.name + " - 5 minutes late",
      reminder,
      5 * 60 * 1000,
      true
    );

    runTest(
      reminder.name + " - At grace limit",
      reminder,
      grace,
      true
    );

    runTest(
      reminder.name + " - Beyond grace limit",
      reminder,
      grace + 1,
      false
    );

    runTest(
      reminder.name + " - Deadline still in future",
      reminder,
      -1,
      false
    );
  }

  Logger.log("----------------------------------");
  Logger.log("PASSED: " + passed);
  Logger.log("FAILED: " + failed);
  Logger.log("==================================");

  if (failed > 0) {
    throw new Error("Smart recovery tests failed.");
  }

  Logger.log("ALL SMART RECOVERY TESTS PASSED.");
}

