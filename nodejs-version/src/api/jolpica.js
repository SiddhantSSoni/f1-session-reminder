import axios from "axios";

const BASE_URL = "https://api.jolpi.ca/ergast/f1";

export async function getCurrentSeasonSchedule() {
  const response = await axios.get(`${BASE_URL}/current.json`);

  return response.data;
}