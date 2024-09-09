const express = require("express");
const router = express.Router();
const googleToAutotask = require("../controllers/googleToAutotask.controller");
module.exports = (app) => {
  router.post("/", googleToAutotask.handleCalendarWebhook);
  app.use("/googleWebhook", router);
};
