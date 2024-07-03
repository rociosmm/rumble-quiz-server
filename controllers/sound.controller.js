const { fetchSound } = require("../models/sound.model");

exports.getSound = (req, res, next) => {
  const { sound_id } = req.params;

  fetchSound(sound_id)
    .then((sound) => {
      res.status(200).send({ sound });
    })
    .catch(next);
};
