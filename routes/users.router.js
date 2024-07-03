const {
  getUser,
  getOnlineUsers,
  postNewUser,
  patchUser,
} = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getOnlineUsers).post(postNewUser);

usersRouter.route("/:username").get(getUser).patch(patchUser);

module.exports = usersRouter;
