import { formatDate, formatTime } from "../utils/formatters.js";

const COUNTRY_FLAGS = {
  Australia: "🇦🇺",
  Austria: "🇦🇹",
  Azerbaijan: "🇦🇿",
  Bahrain: "🇧🇭",
  Belgium: "🇧🇪",
  Brazil: "🇧🇷",
  Canada: "🇨🇦",
  China: "🇨🇳",
  Hungary: "🇭🇺",
  Italy: "🇮🇹",
  Japan: "🇯🇵",
  Mexico: "🇲🇽",
  Monaco: "🇲🇨",
  Netherlands: "🇳🇱",
  Qatar: "🇶🇦",
  "Saudi Arabia": "🇸🇦",
  Singapore: "🇸🇬",
  Spain: "🇪🇸",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸"
};

export function createReminderEmail({
  grandPrix,
  country,
  session,
  circuit,
  reminderText
}) {
  const date = formatDate(session.dateTime);
  const time = formatTime(session.dateTime);

  const flag = COUNTRY_FLAGS[country] || "🏁";

  const subject = `F1 Reminder - ${session.name}, ${grandPrix}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>F1 Reminder</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
  font-family: Arial, Helvetica, sans-serif;
">

  <div style="
    max-width: 600px;
    margin: 30px auto;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 10px;
  ">

    <h1 style="
      margin: 0 0 25px 0;
      font-size: 26px;
    ">
      ${flag} ${grandPrix}
    </h1>

    <h2 style="
      margin: 0 0 20px 0;
      font-size: 20px;
    ">
      🏁 ${session.name}
    </h2>

    <p style="font-size: 16px;">
      📅 <strong>${date}</strong>
    </p>

    <p style="font-size: 16px;">
      🕐 <strong>Start:</strong> ${time} IST
    </p>

    <p style="font-size: 16px;">
      ⏳ <strong>Starts in:</strong> ${reminderText}
    </p>

    <p style="font-size: 16px;">
      📍 ${circuit}
    </p>

  </div>

</body>
</html>
`;

  return {
    subject,
    html
  };
}