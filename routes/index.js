const express = require("express");
const users = require("./users.js");
const router = express.Router();

router.post("/api/users", users.create); // Create user

module.exports = router;

