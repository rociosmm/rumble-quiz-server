const {
  getUser,
  getOnlineUsers,
  postNewUser,
  patchUser,
  getFriends,
  postFriendship,
  getLogByUser,
} = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getOnlineUsers).post(postNewUser);

usersRouter.route("/:username").get(getUser).patch(patchUser);

usersRouter.route("/:username/friends").get(getFriends).post(postFriendship);
usersRouter.route("/:username/logs").get(getLogByUser);

module.exports = usersRouter;
