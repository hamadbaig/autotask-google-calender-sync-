const dbConfig = require("./db.config.js");
const mongoose = require("mongoose");

// Set up Mongoose promises to use native ES6 promises
mongoose.Promise = global.Promise;

// Define a function to connect to MongoDB
async function connectToMongoDB() {
  try {
    // Connect to MongoDB using the URL from the configuration
    await mongoose.connect(dbConfig.url, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // If connection fails, exit the application or handle the error appropriately
    process.exit(1);
  }
}

// Export the connection function
module.exports = connectToMongoDB;
