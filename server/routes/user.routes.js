const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
module.exports = (app) => {
  router.post("/create", userController.createUser);
  router.post("/update", userController.updateUser);
  app.use("/user", router);
};
