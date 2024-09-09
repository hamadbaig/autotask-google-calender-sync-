const express = require("express");
const router = express.Router();
const autotaskToGoogle = require("../controllers/autotaskToGoogle");
module.exports = (app) => {
  router.post("/", autotaskToGoogle.handleAutotaskEvent);
  app.use("/autotaskWebhook", router);
};
