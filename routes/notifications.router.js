const {
  getNotifications,
  seeNotification,
} = require("../controllers/notifications.controller");
const notificationsRouter = require("express").Router();

notificationsRouter.route("/:username").get(getNotifications);
notificationsRouter.route("/:notification_id").patch(seeNotification);

module.exports = notificationsRouter;
