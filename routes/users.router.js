const {
  getUser,
  getOnlineUsers,
  postNewUser,
  patchUser,
  getFriends,
  postFriendship,
  getLogByUser,
  postLogin
} = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getOnlineUsers).post(postNewUser);

usersRouter.route("/login").post(postLogin);

usersRouter.route("/:userRequested").get(getUser);
usersRouter.route("/:username").patch(patchUser);

usersRouter.route("/:username/friends").get(getFriends).post(postFriendship);
usersRouter.route("/:username/logs").get(getLogByUser);

module.exports = usersRouter;
