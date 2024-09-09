const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config(path.resolve(__dirname, "../.env"));

const PORT = process.env.PORT || 8001;
const app = express();
// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

require("./routes/googleCalender.routes")(app);
require("./routes/autotaskWebhook.routes")(app);
require("./routes/user.routes")(app);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
