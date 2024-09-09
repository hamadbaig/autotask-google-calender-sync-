const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");
require("dotenv").config(path.resolve(__dirname, ".env"));
const axios = require("axios");

// Define the path for the text file to store the last execution time
const lastExecutionFilePath = path.resolve(
  __dirname,
  "last_execution_time.txt"
);

// Define your preferred time zone (e.g., JST, CT, or UTC)
const TIME_ZONE = "Asia/Tokyo"; // For example, JST

// Function to read the last execution time from the text file
const readLastExecutionTime = () => {
  try {
    if (fs.existsSync(lastExecutionFilePath)) {
      const lastExecutionTime = fs.readFileSync(lastExecutionFilePath, "utf8");
      if (lastExecutionTime) {
        return moment.tz(lastExecutionTime, TIME_ZONE).toISOString();
      }
    }
    return null;
  } catch (err) {
    console.error("Error reading last execution time:", err);
    return null;
  }
};

// Function to write the current time to the text file in the correct time zone
const writeCurrentExecutionTime = () => {
  const currentTime = moment.tz(TIME_ZONE).toISOString();
  fs.writeFileSync(lastExecutionFilePath, currentTime);
  return currentTime;
};

// The main job function
(async () => {
  try {
    // Step 1: Read the last execution time from the text file
    let lastExecutionTime = readLastExecutionTime();

    // Fallback to a default date if no last execution time is found
    if (!lastExecutionTime) {
      lastExecutionTime = moment
        .tz("2024-01-01T00:00:00", TIME_ZONE)
        .toISOString();
    }

    // Step 2: Make the API call to get appointments forward from the last execution time
    const apiResponse = await axios.post(
      "https://webservices15.autotask.net/ATservicesRest/V1.0/Appointments/query",
      {
        MaxRecords: 20,
        IncludeFields: [],
        Filter: [
          {
            op: "gt",
            field: "createDateTime", // Use the correct field here
            value: lastExecutionTime,
            udf: false,
            items: [],
          },
        ],
      },
      {
        headers: {
          UserName: process.env.AUTOTASK_USERNAME,
          Secret: process.env.AUTOTASK_SECRET,
          ApiIntegrationCode: process.env.AUTOTASK_API_INTEGRATION_CODE,
          "Content-Type": "application/json",
        },
      }
    );
    // Step 3: If the API call was successful, post the data to your webhook
    if (
      apiResponse.data &&
      apiResponse.data.items &&
      apiResponse.data.items.length > 0
    ) {
      await await axios.post(
        "http://localhost:3000/autotaskWebhook",
        JSON.stringify(apiResponse.data.items),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Posted data to webhook successfully.");
    } else {
      console.log("No new appointments found.");
    }

    // Step 4: Save the current execution time to the text file in the correct time zone
    writeCurrentExecutionTime();
  } catch (error) {
    console.error("Error occurred during cron job execution:", error);
  }
})();
