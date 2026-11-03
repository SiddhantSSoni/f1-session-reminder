
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Simulate Google Apps Script Script Properties
const storage = new Map();

global.PropertiesService = {
  getScriptProperties() {
    return {
      getProperty(key) {
        return storage.has(key) ? storage.get(key) : null;
      },

      setProperty(key, value) {
        storage.set(key, value);
      }
    };
  }
};

// Load the actual local Apps Script StateService.gs
const stateServicePath = path.join(
  __dirname,
  "../../app-script-version/StateService.gs"
);

const stateServiceCode = fs.readFileSync(
  stateServicePath,
  "utf8"
);

vm.runInThisContext(stateServiceCode);

let passed = 0;
let failed = 0;

function test(name, callback) {
  try {
    callback();
    passed++;
    console.log("PASS: " + name);
  } catch (error) {
    failed++;
    console.log("FAIL: " + name);
    console.log(error.message);
  }
}

function assertEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `Expected ${expected}, received ${actual}`
    );
  }
}

function assertThrows(callback) {
  let errorOccurred = false;

  try {
    callback();
  } catch (error) {
    errorOccurred = true;
  }

  if (!errorOccurred) {
    throw new Error("Expected an error, but no error was thrown.");
  }
}

// Create a simulated reminder
const reminder = {
  grandPrix: "Test Grand Prix",
  session: "Race",
  dateTime: "2026-11-10T12:00:00.000Z",
  reminder: "1 hour"
};

const reminderId = createReminderId(reminder);

// Test 1: New reminder has not been sent
test("New reminder is not marked as sent", () => {
  assertEqual(hasReminderBeenSent(reminderId), false);
});

// Test 2: Mark reminder as sent
test("Marking reminder as sent records it", () => {
  markReminderAsSent(reminderId);
  assertEqual(hasReminderBeenSent(reminderId), true);
});

// Test 3: Reminder remains marked as sent
test("Previously sent reminder stays recorded", () => {
  assertEqual(hasReminderBeenSent(reminderId), true);
});

// Test 4: Different reminder gets a different ID
test("Different reminder has a unique ID", () => {
  const anotherReminder = {
    ...reminder,
    reminder: "30 minutes"
  };

  const anotherId = createReminderId(anotherReminder);

  assertEqual(reminderId === anotherId, false);
});

// Test 5: Simulate two consecutive bot executions
test("Second execution skips an already sent reminder", () => {
  let emailCount = 0;

  const freshReminder = {
    ...reminder,
    reminder: "24 hours"
  };

  const freshReminderId = createReminderId(freshReminder);

  function simulateExecution() {
    if (hasReminderBeenSent(freshReminderId)) {
      return;
    }

    // Simulate successful email delivery
    emailCount++;

    markReminderAsSent(freshReminderId);
  }

  simulateExecution();
  simulateExecution();

  assertEqual(emailCount, 1);
});

// Test 6: Save and retrieve the last successful execution time
test("Checkpoint can be saved and retrieved", () => {
  const expectedDate = new Date("2026-11-03T12:00:00.000Z");

  setPreviousCheckTime(expectedDate);

  const retrievedDate = getPreviousCheckTime();

  assertEqual(
    retrievedDate.toISOString(),
    expectedDate.toISOString()
  );
});

// Test 7: Invalid saved timestamp should throw an error
test("Invalid saved checkpoint timestamp is rejected", () => {
  storage.set(
    "LAST_SUCCESSFUL_CHECK",
    "this-is-not-a-valid-date"
  );

  assertThrows(() => {
    getPreviousCheckTime();
  });
});

// Test 8: Invalid date should not be saved
test("Invalid Date object is rejected when saving checkpoint", () => {
  const invalidDate = new Date("invalid-date");

  assertThrows(() => {
    setPreviousCheckTime(invalidDate);
  });
});

console.log("\n========== TEST SUMMARY ==========");
console.log("Passed: " + passed);
console.log("Failed: " + failed);

if (failed > 0) {
  process.exitCode = 1;
} else {
  console.log("ALL STATE TESTS PASSED!");
}
