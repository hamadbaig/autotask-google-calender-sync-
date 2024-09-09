const axios = require("axios");

// Function to create an event in the Autotask calendar
async function createAutotaskEvent(event) {
  try {
    // Make the API call to create an event in the Autotask calendar
    const autotaskResponse = await axios.post(
      "https://webservices15.autotask.net/ATservicesRest/V1.0/Appointments",
      {
        // Transform the Google Calendar event data to Autotask format
        title: event.summary,
        description: event.description,
        startDateTime: event.start.dateTime,
        endDateTime: event.end.dateTime,
        resourceID: process.env.RESOURCE_ID, // Ensure this field is correctly populated
        // Add more fields as necessary to match Autotask API requirements
      },
      {
        headers: {
          "Content-Type": "application/json",
          ApiIntegrationCode: process.env.AUTOTASK_API_INTEGRATION_CODE,
          Username: process.env.AUTOTASK_USERNAME,
          Secret: process.env.AUTOTASK_SECRET,
        },
      }
    );

    // Return the data from the Autotask response
    return autotaskResponse.data;
  } catch (error) {
    console.error(
      "Error creating Autotask event:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
module.exports = { createAutotaskEvent };
