const { fetchUser } = require("../models/users.model");

exports.getUser = (req, res, next) => {
  const { username } = req.params;

  fetchUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
