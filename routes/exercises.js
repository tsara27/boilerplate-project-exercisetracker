const Exercise = require("../models/exercises.js").Exercise;
const User = require("../models/users.js").User;
const mongoose = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.findUser = function (req, res, next) {
  User.findById(req.params["id"]).exec(function (err, user) {
    if (err) {
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
      return res.json(err);
    }

    req.existingUser = user;
    next();
  });
};

module.exports.create = function (req, res) {
  let { description, duration } = req.body;
  let date = (req.body.date == "" || req.body.date == undefined) ? (new Date) : new Date(req.body.date);

  if (date == "Invalid Date") {
    return res.json({
      error: "Invalid Date"
    })
  }

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

    const exerciseString = JSON.stringify(data, ["duration", "description", "date"]);
    let exerciseJson = JSON.parse(exerciseString);
    exerciseJson["username"] = req.existingUsername;
    exerciseJson["date"] = data.date.toDateString();
    exerciseJson["_id"] = req.existingUser._id;

    res.json(exerciseJson);
  });
}

module.exports.logs = function (req, res) {
  let { from, to, limit } = req.query;
  let exercises = Exercise.find({ user: req.existingUser["_id"] });

  if (from != undefined && to != undefined) {
    exercises = Exercise.find({ user: req.existingUser["_id"], date: { $gte: new Date(from), $lte: new Date(to) }});
  }

  exercises = (limit == undefined) ? exercises : exercises.limit(limit);

  exercises.exec(function(err, documents) {
    if (err) {
      return res.json(err);
    }

    const exerciseString = JSON.stringify(documents, ["duration", "description", "date"]);
    let exerciseJson = JSON.parse(exerciseString).map(function(data) {
      let date = new Date(data["date"]);
      return {
        id: data["_id"],
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
