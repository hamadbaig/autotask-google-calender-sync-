const axios = require("axios");

async function getTriggeredEvent(calendarId, accessToken) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[response.data.items.length - 1]; // Return the specific event
    } else {
      console.log("Event not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching event:", error.message);
    throw error;
  }
}

module.exports = { getTriggeredEvent };
