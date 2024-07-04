const logsRouter = require("express").Router();

logsRouter.post("/:sound_id", postLogs);

module.exports = logsRouter;
