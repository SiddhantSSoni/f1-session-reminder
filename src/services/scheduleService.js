const SESSION_TYPES = [
  {
    apiName: "FirstPractice",
    displayName: "Practice 1"
  },
  {
    apiName: "SecondPractice",
    displayName: "Practice 2"
  },
  {
    apiName: "ThirdPractice",
    displayName: "Practice 3"
  },
  {
    apiName: "SprintQualifying",
    displayName: "Sprint Qualifying"
  },
  {
    apiName: "Sprint",
    displayName: "Sprint"
  },
  {
    apiName: "Qualifying",
    displayName: "Qualifying"
  }
];

export function extractRaceSchedule(race) {
  const sessions = [];

  for (const sessionType of SESSION_TYPES) {
    const session = race[sessionType.apiName];

    if (!session) {
      continue;
    }

    sessions.push({
      name: sessionType.displayName,
      date: session.date,
      time: session.time,
      dateTime: `${session.date}T${session.time}`
    });
  }

  // The Race is stored directly on the race object
  sessions.push({
    name: "Race",
    date: race.date,
    time: race.time,
    dateTime: `${race.date}T${race.time}`
  });

  return {
    season: race.season,
    round: race.round,
    name: race.raceName,
    circuit: race.Circuit.circuitName,
    locality: race.Circuit.Location.locality,
    country: race.Circuit.Location.country,
    sessions
  };
}

export function getNextGrandPrixSchedule(races) {
  const now = new Date();

  for (const race of races) {
    const raceSchedule = extractRaceSchedule(race);

    const hasUpcomingSession = raceSchedule.sessions.some(
      (session) => new Date(session.dateTime) > now
    );

    if (hasUpcomingSession) {
      return raceSchedule;
    }
  }

  return null;
}