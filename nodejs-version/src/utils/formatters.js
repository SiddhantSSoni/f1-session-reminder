const INDIA_TIMEZONE = "Asia/Kolkata";

export function formatDate(dateTime) {
  const date = new Date(dateTime);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: INDIA_TIMEZONE,
    day: "2-digit",
    month: "short",
    weekday: "long"
  }).formatToParts(date);

  const day = parts.find(part => part.type === "day").value;
  const month = parts.find(part => part.type === "month").value;
  const weekday = parts.find(part => part.type === "weekday").value;

  return `${day}-${month}, ${weekday}`;
}

export function formatTime(dateTime) {
  const date = new Date(dateTime);

  return new Intl.DateTimeFormat("en-US", {
    timeZone: INDIA_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(date);
}