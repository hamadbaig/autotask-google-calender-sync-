const axios = require("axios");
require("dotenv").config();

// Function to refresh the access token using the refresh token
async function refreshAccessToken(client_id, client_secret, refresh_token) {
  const response = await axios.post(
    "https://oauth2.googleapis.com/token",
    null,
    {
      params: {
        client_id,
        client_secret,
        refresh_token,
        grant_type: "refresh_token",
      },
    }
  );
  return response.data.access_token;
}

module.exports = { refreshAccessToken };
