
function getCurrentSeasonSchedule() {
  const url = CONFIG.API_BASE_URL + CONFIG.API_ENDPOINT;

  try {
    const response = UrlFetchApp.fetch(url, {
      method: "get",
      headers: {
        Accept: "application/json"
      },
      muteHttpExceptions: true
    });

    const statusCode = response.getResponseCode();

    if (statusCode !== 200) {
      throw new Error(
        "Jolpica API request failed. HTTP status: " + statusCode
      );
    }

    const schedule = JSON.parse(response.getContentText());

    if (
      !schedule ||
      !schedule.MRData ||
      !schedule.MRData.RaceTable ||
      !Array.isArray(schedule.MRData.RaceTable.Races)
    ) {
      throw new Error("Invalid schedule data received from Jolpica API.");
    }

    Logger.log(
      "Successfully retrieved the " +
      schedule.MRData.RaceTable.season +
      " F1 season schedule."
    );

    Logger.log(
      "Total Grands Prix: " +
      schedule.MRData.RaceTable.Races.length
    );

    return schedule;

  } catch (error) {
    Logger.log("Jolpica API Error: " + error.message);
    throw error;
  }
}
