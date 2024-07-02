const { getUser } = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.get("/:user_id", getUser);

module.exports = usersRouter;
