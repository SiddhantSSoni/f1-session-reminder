
const REMINDER_INTERVALS = [
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
];

function getDueReminders(sessions, currentTime) {
  const dueReminders = [];

  for (const session of sessions) {
    const sessionTime = new Date(session.dateTime);

    for (const reminder of REMINDER_INTERVALS) {
      const reminderDeadline = new Date(
        sessionTime.getTime() - reminder.milliseconds
      );

      const lateByMilliseconds =
        currentTime.getTime() - reminderDeadline.getTime();

      if (lateByMilliseconds < 0) continue;

      if (lateByMilliseconds > reminder.gracePeriodMilliseconds) {
        continue;
      }

      dueReminders.push({
        ...session,
        reminder: reminder.name,
        lateByMilliseconds
      });
    }
  }

  return dueReminders;
}

// Simulated F1 session
const session = {
  dateTime: "2026-11-10T12:00:00Z",
  session: "Race",
  grandPrix: "Test Grand Prix"
};

const sessionTime = new Date(session.dateTime);

let passed = 0;
let failed = 0;

function runTest(name, reminder, delay, expected) {
  const deadline = new Date(
    sessionTime.getTime() - reminder.milliseconds
  );

  const currentTime = new Date(deadline.getTime() + delay);

  const results = getDueReminders([session], currentTime);

  const actual = results.some(
    item => item.reminder === reminder.name
  );

  if (actual === expected) {
    passed++;
    console.log(`PASS: ${name}`);
  } else {
    failed++;
    console.log(
      `FAIL: ${name} | Expected: ${expected}, Actual: ${actual}`
    );
  }
}

// Run five scenarios for each reminder interval
for (const reminder of REMINDER_INTERVALS) {
  const grace = reminder.gracePeriodMilliseconds;

  runTest(
    `${reminder.name} - Exactly on time`,
    reminder,
    0,
    true
  );

  runTest(
    `${reminder.name} - 5 minutes late`,
    reminder,
    5 * 60 * 1000,
    true
  );

  runTest(
    `${reminder.name} - At grace limit`,
    reminder,
    grace,
    true
  );

  runTest(
    `${reminder.name} - Beyond grace limit`,
    reminder,
    grace + 1,
    false
  );

  runTest(
    `${reminder.name} - Still in future`,
    reminder,
    -1,
    false
  );
}

console.log("\n========== TEST SUMMARY ==========");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exitCode = 1;
} else {
  console.log("All smart recovery tests passed!");
}
