const express = require("express");
const users = require("./users.js");
const exercises = require("./exercises.js");
const router = express.Router();
const Exercise = require("../models/exercises.js").Exercise;
const User = require("../models/users.js").User;

// Users
router.post("/api/users", users.create); // Create user
router.get("/api/users", users.loadUsers, users.list); // list all users

// Exercises
router.post("/api/users/:id/exercises", exercises.findUser, exercises.create); // Log exercise of a user

// Logs
router.get("/api/users/:id/logs", exercises.findUserByQuery, exercises.logs);

module.exports = router;

