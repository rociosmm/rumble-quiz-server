const { getAvatars } = require("../controllers/avatars.controller")

const avatarsRouter = require("express").Router()

avatarsRouter.get("/", getAvatars)

module.exports = avatarsRouter