const Exercise = require("../models/exercises.js").Exercise;
const User = require("../models/users.js").User;
const mongoose = require("mongoose");

module.exports.findUser = function (req, res, next) {
  User.findById(req.body[":_id"]).exec(function (err, user) {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    req.existingUser = user;
    req.existingUsername = user.username;
    next();
  });

};

module.exports.create = function (req, res) {
  let { description, duration } = req.body;
  let date = (req.body.date == "") ? (new Date) : new Date(req.body.date);

  const newExercise = new Exercise({
    user: req.existingUser._id,
    description: description,
    duration: duration,
    date: date.toDateString
  });

  newExercise.save(function(err, data) {
    if (err) {
      return res.json(err);
    }

    const exerciseString = JSON.stringify(data, ["_id", "duration", "description", "date"]);
    let exerciseJson = JSON.parse(exerciseString);
    exerciseJson["username"] = req.existingUsername;

    res.json(exerciseJson);
  });
}
