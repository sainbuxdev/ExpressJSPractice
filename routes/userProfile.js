const express = require("express");
const router = express.Router();
const userProfileController = require("../controller/userProfileController");

// routes
router.post("/", userProfileController.getUserDetails);

module.exports = router;
