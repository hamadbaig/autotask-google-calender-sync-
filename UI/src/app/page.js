"use client";

import { useState } from "react";

export default function HomePage() {
  const [clientId, setClientId] = useState(""); // Store clientId from user input
  const [clientSecret, setClientSecret] = useState(""); // Store clientSecret from user input
  const [resourceId, setResourceId] = useState("");
  const [email, setEmail] = useState("");

  const handleGoogleAuth = () => {
    const redirectUri = "http://localhost:3000/oauth2callback";
    const scope = "https://www.googleapis.com/auth/calendar";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${encodeURIComponent(
      scope
    )}&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&client_id=${clientId}`; // Use the clientId from the state

    window.location.href = authUrl;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clientId || !clientSecret || !resourceId || !email) {
      alert("Please fill in all fields");
      return;
    }

    // Store clientId, clientSecret, email, and resourceId in localStorage for later use
    localStorage.setItem("clientId", clientId);
    localStorage.setItem("clientSecret", clientSecret);
    localStorage.setItem("email", email);
    localStorage.setItem("resourceId", resourceId);

    handleGoogleAuth();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Google Calendar OAuth Integration
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4"
      >
        <input
          type="text"
          placeholder="Client ID"
          value={clientId} // Capture Client ID
          onChange={(e) => setClientId(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Client Secret"
          value={clientSecret} // Capture Client Secret
          onChange={(e) => setClientSecret(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Resource ID"
          value={resourceId} // Capture Resource ID
          onChange={(e) => setResourceId(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email} // Capture email
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Authorize Google Calendar
        </button>
      </form>
    </div>
  );
}
