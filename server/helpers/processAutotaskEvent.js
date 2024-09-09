// A mockup function to process individual Autotask event data
const processAutotaskEvent = (autotaskEvent) => {
  // This function should convert the Autotask event to the format required for Google Calendar
  // Implement this function based on your event structure
  return {
    summary: autotaskEvent.title, // Example field mappings
    description: autotaskEvent.description,
    start: {
      dateTime: autotaskEvent.startDateTime,
      timeZone: "UTC", // Adjust time zone as needed
    },
    end: {
      dateTime: autotaskEvent.endDateTime,
      timeZone: "UTC", // Adjust time zone as needed
    },
  };
};
module.exports = { processAutotaskEvent };
