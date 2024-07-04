const { addGameDataToLog } = require("../models/logs.models");

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
