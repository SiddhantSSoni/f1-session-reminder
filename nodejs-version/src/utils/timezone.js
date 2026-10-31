const INDIA_TIMEZONE = "Asia/Kolkata";

export function convertToIST(dateTime) {
  const date = new Date(dateTime);

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: INDIA_TIMEZONE,
    day: "2-digit",
    month: "short",
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(date);
}