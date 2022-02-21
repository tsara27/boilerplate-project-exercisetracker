const Exercise = require("../models/exercises.js").Exercise;
const User = require("../models/users.js").User;
const mongoose = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;

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

module.exports.findUserByQuery = function (req, res, next) {
  User.findById(req.params["id"]).select(["_id", "username"]).exec(function (err, user) {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    req.existingUser = user;
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
    date: date
  });

  newExercise.save(function(err, data) {
    if (err) {
      return res.json(err);
    }

    const exerciseString = JSON.stringify(data, ["_id", "duration", "description", "date"]);
    let exerciseJson = JSON.parse(exerciseString);
    exerciseJson["username"] = req.existingUsername;
    exerciseJson["date"] = data.date.toDateString();

    res.json(exerciseJson);
  });
}

module.exports.logs = function (req, res) {
  Exercise.find({ user: (new ObjectId(req.existingUser["_id"])) }, function(err, documents) {
    if (err) {
      return res.json(err);
    }

    const exerciseString = JSON.stringify(documents, ["duration", "description", "date"]);
    let exerciseJson = JSON.parse(exerciseString).map(function(data) {
      let date = new Date(data["date"]);
      return {
        description: data["description"],
        duration: data["duration"],
        date: date.toDateString()
      }
    });

    let userJson = JSON.parse(JSON.stringify(req.existingUser));
    userJson.count = exerciseJson.length;
    userJson.log = exerciseJson;
    res.json(userJson);
  });
};
