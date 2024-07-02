const { getUser, getOnlineUsers } = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.get("/", getOnlineUsers);

usersRouter.get("/:username", getUser);

module.exports = usersRouter;
