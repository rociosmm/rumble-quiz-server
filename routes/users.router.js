const { getUser } = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.get("/:username", getUser);

module.exports = usersRouter;
