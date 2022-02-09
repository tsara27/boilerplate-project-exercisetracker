const User = require("../models/users.js").User;

module.exports.create = function (req, res) {
  console.log(req);
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

