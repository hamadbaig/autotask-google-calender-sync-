const { refreshAccessToken } = require("../helpers/createGoogleRefreshToken");
const {
  createGoogleCalendarEvent,
} = require("../helpers/createGoogleCalenderEvent");
const { processAutotaskEvent } = require("../helpers/processAutotaskEvent");
const connectToMongoDB = require("../config/db.connecter");
connectToMongoDB();
const User = require("../models/users.model"); // Assuming you have a User model

exports.handleAutotaskEvent = async (req, res) => {
  try {
    const autotaskEvents = req.body; // Expecting an array of events

    console.log("Received Autotask Events:", req.body);

    // Check if there are any events to process
    if (Array.isArray(autotaskEvents) && autotaskEvents.length > 0) {
      // Iterate over each event
      for (const autotaskEvent of autotaskEvents) {
        try {
          const resourceID = autotaskEvent.resourceID;

          // Find the user with matching resourceID
          const user = await User.findOne({ resource_id: resourceID });

          if (!user) {
            console.log(
              `No user found for resourceID: ${resourceID}, skipping event.`
            );
            continue; // Skip this iteration if no user is found
          }

          // Extract user credentials
          const { client_id, client_secret, refresh_token } = user;

          // Refresh access token for Google Calendar API with user's credentials
          const accessToken = await refreshAccessToken(
            client_id,
            client_secret,
            refresh_token
          );

          // Process the Autotask event to convert it into Google Calendar format
          const googleCalendarEvent = processAutotaskEvent(autotaskEvent);

          // Create the event on Google Calendar
          await createGoogleCalendarEvent(accessToken, googleCalendarEvent);
          console.log(
            `Event created successfully: ${googleCalendarEvent.summary}`
          );
        } catch (eventError) {
          console.error(
            `Error processing event for resourceID ${autotaskEvent.resourceID}:`,
            eventError
          );
        }
      }

      // All events processed
      res.status(200).json({ message: "All events processed successfully" });
    } else {
      res
        .status(400)
        .json({ message: "No events found in the webhook payload" });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
