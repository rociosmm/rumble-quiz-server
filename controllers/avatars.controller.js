const { fetchAvatars } = require("../models/avatars.model");

exports.getAvatars = (req, res, next) => {
  fetchAvatars().then((avatars) => {
    res.status(200).send({ avatars });
  })
  .catch(next)
};
