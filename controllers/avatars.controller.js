const { fetchAvatars, fetchAvatarById } = require("../models/avatars.model");

exports.getAvatars = (req, res, next) => {
  fetchAvatars()
    .then((avatars) => {
      res.status(200).send({ avatars });
    })
    .catch(next);
};

exports.getAvatarById = (req, res, next) => {
  const { avatar_id } = req.params;
  fetchAvatarById(avatar_id)
    .then((avatar) => {
      res.status(200).send({ avatar });
    })
    .catch(next);
};
