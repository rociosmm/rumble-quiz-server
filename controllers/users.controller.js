const { fetchUser } = require("../models/users.model");

exports.getUser = (req, res, next) => {
  console.log("controller");
  const { user_id } = req.params;
  console.log(user_id);
  fetchUser(user_id).then((user) => {
    res.status(200).send({ user });
  });
};
