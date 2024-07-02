const {
  getUser,
  getOnlineUsers,
  postNewUser,
} = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getOnlineUsers).post(postNewUser);

usersRouter.get("/:username", getUser);

module.exports = usersRouter;
