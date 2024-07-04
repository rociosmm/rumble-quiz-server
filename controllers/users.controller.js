const { friendship } = require("../db/data/test-data");
const {
  fetchUser,
  fetchOnlineUsers,
  createUser,
  modifyUser,
  fetchFriends,
  addFriendship,
  fetchLog,
} = require("../models/users.model");
const { checkIfExists } = require("../models/users.utils");

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

exports.patchUser = (req, res, next) => {
  const newFields = req.body;
  const { username } = req.params;

  modifyUser(newFields, username)
    .then((modifiedUser) => {
      res.status(200).send({ modifiedUser });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getFriends = (req, res, next) => {
  const { username } = req.params;
  fetchFriends(username)
    .then((friends) => {
      res.status(200).send({ friends });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postFriendship = (req, res, next) => {
  const { username } = req.params;
  const { newFriend } = req.body;

  addFriendship(username, newFriend)
    .then((friendship) => {
      res.status(200).send({ friendship });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getLogByUser = (req, res, next) => {
  const { username } = req.params;
  fetchLog(username).then((log) => {
    res.status(200).send({ log });
  });
};
