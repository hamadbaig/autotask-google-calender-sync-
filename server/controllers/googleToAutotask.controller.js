const { refreshAccessToken } = require("../helpers/createGoogleRefreshToken");
const { createAutotaskEvent } = require("../helpers/createAutotaskEvent");
const { getTriggeredEvent } = require("../helpers/getGoogleCalenderEvent");

exports.handleCalendarWebhook = async (req, res) => {
  try {
    const headers = req.headers;
    const resourceState = headers["x-goog-resource-state"];
    const resourceUri = headers["x-goog-resource-uri"];

    if (resourceState === "exists") {
      const accessToken = await refreshAccessToken();

      if (accessToken) {
        // Extract calendarId from the resourceUri
        const uriParts = resourceUri.split("/");
        const calendarId = uriParts[uriParts.length - 2];

        const event = await getTriggeredEvent(calendarId, accessToken);

        if (event) {
          const autotaskEvent = await createAutotaskEvent(event);
          res.status(200).json({
            message: "Specific event synced successfully",
            autotaskEvent,
          });
        } else {
          res.status(404).json({ message: "Specific event not found" });
        }
      } else {
        res.status(401).json({ message: "Failed to refresh access token" });
      }
    } else {
      res.status(200).json({ message: "No action required" });
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
