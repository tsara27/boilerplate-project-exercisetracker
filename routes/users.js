const User = require("../models/users.js").User;

module.exports.create = function (req, res) {
  const { username } = req.body;
  const newUser = new User({
    username: username
  });

  newUser.save(function(err, data) {
    if (err) {
      return res.json(err);
    }

    const user = JSON.stringify(data, ["_id", "username"]);

    res.json(JSON.parse(user));
  });
}

module.exports.loadUsers = function (req, res, next) {
  User.find()
    .select(["_id", "username", "exercises"])
    .exec(function(err, documents) {
      if (err) {
        return console.error("ERROR");
      }

      req.listUsers = documents;
      next();
    });
}

module.exports.list = function (req, res) {
  User.populate(req.listUsers, { path: "exercises" }, function(err, documents) {
    if (err) {
      return console.error("ERROR");
    }

    res.json(documents);
  });
}
