const { postLogs, getLeaderboard } = require("../controllers/logs.controllers");
const logsRouter = require("express").Router();

logsRouter.route("/").post(postLogs).get(getLeaderboard);

module.exports = logsRouter;
