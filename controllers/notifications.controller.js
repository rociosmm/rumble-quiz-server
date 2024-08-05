const {
  fetchNotifByUser,
  patchNotif,
} = require("../models/notifications.model");

exports.getNotifications = (req, res, next) => {
  const { username } = req.params;
  fetchNotifByUser(username)
    .then((notifications) => {
      res.status(200).send({ notifications });
    })
    .catch((err) => {
      next(err);
    });
};

exports.seeNotification = (req, res, next) => {
  const { notification_id } = req.params;
  patchNotif(notification_id)
    .then((notification) => {
      res.status(200).send({ notification });
    })
    .catch((err) => {
      next(err);
    });
};
