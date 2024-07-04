const { addGameDataToLog, fetchUsersPoints } = require("../models/logs.models");

exports.postLogs = (req, res, next) => {
  const gameData = req.body;
  addGameDataToLog(gameData)
    .then((addedLogs) => {
      res.status(201).send({ addedLogs });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getLeaderboard = (req, res, next) => {
  fetchUsersPoints().then((leaderboard) => {
    res.status(200).send({ leaderboard });
  });
};
