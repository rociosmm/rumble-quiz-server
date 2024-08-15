const {
  postLogs,
  getLeaderboard,
  getGameData,
} = require("../controllers/logs.controllers");
const logsRouter = require("express").Router();

logsRouter.route("/").post(postLogs).get(getLeaderboard);

logsRouter.route("/:game_id").get(getGameData)

module.exports = logsRouter;
