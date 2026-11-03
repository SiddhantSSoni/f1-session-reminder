
const CONFIG = {
  TIMEZONE: "Asia/Kolkata",

  REMINDER_INTERVALS: [
    {
      name: "24 hours",
      milliseconds: 24 * 60 * 60 * 1000,
      gracePeriodMilliseconds: 30 * 60 * 1000
    },
    {
      name: "1 hour",
      milliseconds: 60 * 60 * 1000,
      gracePeriodMilliseconds: 15 * 60 * 1000
    },
    {
      name: "30 minutes",
      milliseconds: 30 * 60 * 1000,
      gracePeriodMilliseconds: 10 * 60 * 1000
    }
  ],

  API_BASE_URL: "https://api.jolpi.ca/ergast/f1",
  API_ENDPOINT: "/current.json"
};
