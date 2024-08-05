const { fetchNotifByUser } = require("../models/notifications.model");

exports.getNotifications = (req, res, next) => {
  const { username } = req.params;
  fetchNotifByUser(username)
    .then((notifications) => {
      console.log("notifications :>> ", notifications);
      res.status(200).send({ notifications });
    })
    .catch((err) => {
      next(err);
    });
};
