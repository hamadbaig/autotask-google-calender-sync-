const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  client_id: {
    type: String,
    required: true,
  },
  client_secret: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  resource_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
