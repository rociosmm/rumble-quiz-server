const { getSound } = require("../controllers/sound.controller");

const soundRouter = require("express").Router();

soundRouter.get("/:sound_id", getSound);

module.exports = soundRouter;
