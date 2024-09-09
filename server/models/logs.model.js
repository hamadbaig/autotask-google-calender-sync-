const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logsData = new Schema({
  event: {
    type: String,
    required: true,
  },
});

const Logs = mongoose.model("User", logsData);

module.exports = Logs;
