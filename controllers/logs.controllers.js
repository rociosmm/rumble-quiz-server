const {
  addGameDataToLog,
  fetchUsersPoints,
  fetchGameData,
} = require("../models/logs.models");

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

exports.getGameData = (req, res, next) => {
  const { game_id } = req.params;
  const { player_username } = req.query;
  fetchGameData(game_id, player_username)
    .then((logs) => {
      res.status(200).send({ logs });
    })
    .catch((err) => {
      next(err);
    });
};
