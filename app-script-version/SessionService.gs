
function getUpcomingSessions(races, currentTime) {
  currentTime = currentTime || new Date();

  const sessionTypes = [
    { apiName: "FirstPractice", displayName: "Practice 1" },
    { apiName: "SecondPractice", displayName: "Practice 2" },
    { apiName: "ThirdPractice", displayName: "Practice 3" },
    { apiName: "SprintQualifying", displayName: "Sprint Qualifying" },
    { apiName: "Sprint", displayName: "Sprint" },
    { apiName: "Qualifying", displayName: "Qualifying" }
  ];

  const upcomingSessions = [];

  for (const race of races) {

    const raceDetails = {
      roundNumber: race.round,
      grandPrix: race.raceName,
      circuit: race.Circuit.circuitName,
      locality: race.Circuit.Location.locality,
      country: race.Circuit.Location.country
    };

    // Process practice, sprint and qualifying sessions.
    for (const sessionType of sessionTypes) {
      const session = race[sessionType.apiName];

      if (!session || !session.date || !session.time) {
        continue;
      }

      // Jolpica provides session dates and times in UTC.
      const dateTime = `${session.date}T${session.time}`;

      const sessionDate = new Date(
        dateTime.endsWith("Z") ? dateTime : dateTime + "Z"
      );

      if (isNaN(sessionDate.getTime())) {
        Logger.log("Invalid session date: " + dateTime);
        continue;
      }

      if (sessionDate.getTime() > currentTime.getTime()) {
        upcomingSessions.push({
          ...raceDetails,
          session: sessionType.displayName,
          dateTime: sessionDate.toISOString()
        });
      }
    }

    // Process the race separately because its date and time
    // are stored directly on the race object.
    if (race.date && race.time) {
      const raceDateTime = `${race.date}T${race.time}`;

      const raceDate = new Date(
        raceDateTime.endsWith("Z")
          ? raceDateTime
          : raceDateTime + "Z"
      );

      if (
        !isNaN(raceDate.getTime()) &&
        raceDate.getTime() > currentTime.getTime()
      ) {
        upcomingSessions.push({
          ...raceDetails,
          session: "Race",
          dateTime: raceDate.toISOString()
        });
      }
    }
  }

  // Sort all upcoming sessions chronologically.
  upcomingSessions.sort(
    (a, b) =>
      new Date(a.dateTime).getTime() -
      new Date(b.dateTime).getTime()
  );

  Logger.log(
    "Found " + upcomingSessions.length + " upcoming sessions."
  );

  return upcomingSessions;
}
