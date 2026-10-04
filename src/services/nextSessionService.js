export function getUpcomingSessions(races) {
  const now = new Date();

  const sessionTypes = [
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

  const upcomingSessions = [];

  for (const race of races) {
    for (const sessionType of sessionTypes) {
      const session = race[sessionType.apiName];

      if (!session) {
        continue;
      }

      const dateTime = `${session.date}T${session.time}`;
      const sessionDate = new Date(dateTime);

      if (sessionDate > now) {
        upcomingSessions.push({
          grandPrix: race.raceName,
          circuit: race.Circuit.circuitName,
          locality: race.Circuit.Location.locality,
          country: race.Circuit.Location.country,
          session: sessionType.displayName,
          dateTime
        });
      }
    }

    // Add the Race
    const raceDateTime = `${race.date}T${race.time}`;
    const raceDate = new Date(raceDateTime);

    if (raceDate > now) {
      upcomingSessions.push({
        grandPrix: race.raceName,
        circuit: race.Circuit.circuitName,
        locality: race.Circuit.Location.locality,
        country: race.Circuit.Location.country,
        session: "Race",
        dateTime: raceDateTime
      });
    }
  }

  upcomingSessions.sort(
    (a, b) =>
      new Date(a.dateTime) - new Date(b.dateTime)
  );

  return upcomingSessions;
}