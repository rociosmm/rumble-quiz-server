const {postLogs} = require("../controllers/logs.controllers")
const logsRouter = require("express").Router();

logsRouter.post("/", postLogs);

module.exports = logsRouter;
