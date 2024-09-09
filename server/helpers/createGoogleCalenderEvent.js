const axios = require("axios");

async function createGoogleCalendarEvent(accessToken, event) {
  try {
    if (event) {
    }
    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      event,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Google Calendar event created:", response.data);
  } catch (error) {
    console.error("Error creating Google Calendar event:", error.message);
    throw error;
  }
}

module.exports = { createGoogleCalendarEvent };
