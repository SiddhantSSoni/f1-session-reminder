
const STATE_KEYS = {
  LAST_CHECK: "LAST_SUCCESSFUL_CHECK",
  REMINDER_PREFIX: "SENT_REMINDER_"
};


// Creates a unique ID for each reminder.
function createReminderId({
  grandPrix,
  session,
  dateTime,
  reminder
}) {
  return `${grandPrix}|${session}|${dateTime}|${reminder}`;
}


// Checks whether a reminder has already been sent.
function hasReminderBeenSent(reminderId) {
  const properties =
    PropertiesService.getScriptProperties();

  const key = STATE_KEYS.REMINDER_PREFIX + reminderId;

  return properties.getProperty(key) !== null;
}


// Records a reminder after its email is successfully sent.
function markReminderAsSent(reminderId) {
  const properties =
    PropertiesService.getScriptProperties();

  const key = STATE_KEYS.REMINDER_PREFIX + reminderId;

  properties.setProperty(
    key,
    new Date().toISOString()
  );
}


// Retrieves the previous successful execution time.
function getPreviousCheckTime() {
  const properties =
    PropertiesService.getScriptProperties();

  const savedTime = properties.getProperty(
    STATE_KEYS.LAST_CHECK
  );

  if (!savedTime) {
    return null;
  }

  const date = new Date(savedTime);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid previous check timestamp.");
  }

  return date;
}


// Updates the previous successful execution time.
function setPreviousCheckTime(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("A valid Date object is required.");
  }

  const properties =
    PropertiesService.getScriptProperties();

  properties.setProperty(
    STATE_KEYS.LAST_CHECK,
    date.toISOString()
  );
}
