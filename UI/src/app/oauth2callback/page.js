"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OAuth2Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const exchangeToken = async (
      code,
      clientId,
      clientSecret,
      email,
      resourceId
    ) => {
      const redirectUri = "http://localhost:3000/oauth2callback";
      const tokenEndpoint = "https://oauth2.googleapis.com/token";

      const params = new URLSearchParams();
      params.append("code", code);
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);
      params.append("redirect_uri", redirectUri);
      params.append("grant_type", "authorization_code");

      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      const data = await response.json();
      const { refresh_token, access_token } = data;

      if (refresh_token) {
        await signupUser(
          refresh_token,
          clientId,
          clientSecret,
          email,
          resourceId
        );
      }

      if (access_token) {
        await watchCalendarEvents(access_token, email); // Call calendar watch function here
      }
    };

    // Function to handle user signup (same as before)
    const signupUser = async (
      refresh_token,
      client_id,
      client_secret,
      email,
      resource_id
    ) => {
      const signupResponse = await fetch("http://localhost:3000/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          client_id,
          client_secret,
          resource_id,
          refresh_token,
        }),
      });

      const signupData = await signupResponse.json();
      console.log("User signed up:", signupData);
    };

    // Function to call Google Calendar API to watch events
    const watchCalendarEvents = async (accessToken, email) => {
      const calendarId = email || localStorage.getItem("email");

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/watch`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: "unique-channel-id-123", // A unique channel ID for push notifications
            type: "web_hook",
            address: "https://googlecalender.free.beeceptor.com", // The webhook URL
          }),
        }
      );

      const data = await response.json();
      console.log("Calendar Watch Response:", data);
    };

    const code = searchParams.get("code");
    if (code) {
      const clientId = localStorage.getItem("clientId");
      const clientSecret = localStorage.getItem("clientSecret");
      const email = localStorage.getItem("email");
      const resourceId = localStorage.getItem("resourceId");

      if (clientId && clientSecret && email && resourceId) {
        exchangeToken(code, clientId, clientSecret, email, resourceId);
      } else {
        console.error("Required data missing");
        router.push("/error");
      }
    } else {
      router.push("/error");
    }
  }, [searchParams, router]);

  return <div>OAuth Callback Page - Processing...</div>;
}
