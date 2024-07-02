const db = require("../db/connection");

exports.fetchAvatars = () => {
  return db.query("SELECT * FROM avatars;").then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No avatars found" });
    } else {
      return rows;
    }
  });
};
