const db = require("../db/connection");

exports.fetchUser = (username) => {
  return db
    .query(
      `SELECT user_id, username, email, avatar_id, is_child, colour_theme_id, online FROM users 
    WHERE username = $1;`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User Not Found" });
      }
      return rows[0];
    });
};
