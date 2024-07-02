const db = require("../db/connection");

exports.fetchAvatars = () => {
  return db.query("SELECT * FROM avatars;").then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No Avatars Found" });
    } else {
      return rows;
    }
  });
};

exports.fetchAvatarById = (avatar_id) => {
  return db
    .query(`SELECT * FROM avatars WHERE avatar_id = $1;`, [avatar_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Avatar Not Found" });
      } else {
        return rows[0];
      }
    });
};
