const {
  fetchUser,
  fetchOnlineUsers,
  createUser,
} = require("../models/users.model");

exports.getOnlineUsers = (req, res, next) => {
  fetchOnlineUsers().then((users) => {
    res.status(200).send({ users });
  });
};

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
exports.postNewUser = (req, res, next) => {
  const newUser = req.body;

  createUser(newUser)
    .then((newUser) => {
      res.status(201).send({ newUser });
    })
    .catch((err) => {
      next(err);
    });
};
