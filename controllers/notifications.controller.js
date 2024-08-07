const {
  fetchNotifByUser,
  patchNotif,
  postNotification,
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

exports.newNotification = (req, res, next) => {
  const newNotification = req.body;
  postNotification(newNotification)
    .then((notification) => {
      console.log("notification controller :>> ", notification);
      res.status(201).send({ notification });
    })
    .catch((err) => {
      next(err);
    });
};
