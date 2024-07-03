const {
  getAvatars,
  getAvatarById,
} = require("../controllers/avatars.controller");

const avatarsRouter = require("express").Router();

avatarsRouter.get("/", getAvatars);

avatarsRouter.get("/:avatar_id", getAvatarById);

module.exports = avatarsRouter;
