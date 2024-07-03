const {
  getUser,
  getOnlineUsers,
  postNewUser,
  patchUser,
  getFriends
} = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getOnlineUsers).post(postNewUser);

usersRouter.route("/:username").get(getUser).patch(patchUser);

usersRouter.route("/:username/friends").get(getFriends);
module.exports = usersRouter;
