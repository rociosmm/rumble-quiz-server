const { getNotifications } = require("../controllers/notifications.controller");
const notificationsRouter = require("express").Router();

notificationsRouter.route("/:username").get(getNotifications);

module.exports = notificationsRouter;
