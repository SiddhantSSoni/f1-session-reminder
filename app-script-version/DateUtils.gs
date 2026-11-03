
function formatDate(dateTime) {
  const date = new Date(dateTime);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided: " + dateTime);
  }

  return Utilities.formatDate(
    date,
    CONFIG.TIMEZONE,
    "dd-MMM, EEEE"
  );
}


function formatTime(dateTime) {
  const date = new Date(dateTime);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided: " + dateTime);
  }

  return Utilities.formatDate(
    date,
    CONFIG.TIMEZONE,
    "h:mm a"
  );
}
