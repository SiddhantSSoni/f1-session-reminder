import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATE_FILE = path.join(
  __dirname,
  "../data/reminderState.json"
);

function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    return {
      sentReminders: []
    };
  }

  const data = fs.readFileSync(STATE_FILE, "utf-8");

  return JSON.parse(data);
}

function saveState(state) {
  fs.writeFileSync(
    STATE_FILE,
    JSON.stringify(state, null, 2)
  );
}

export function createReminderId({
  grandPrix,
  session,
  reminder
}) {
  return `${grandPrix}|${session}|${reminder}`;
}

export function hasReminderBeenSent(reminderId) {
  const state = loadState();

  return state.sentReminders.includes(reminderId);
}

export function markReminderAsSent(reminderId) {
  const state = loadState();

  if (!state.sentReminders.includes(reminderId)) {
    state.sentReminders.push(reminderId);
    saveState(state);
  }
}