const db = require("../db/connection");

exports.fetchUser = (username) => {
  return db
    .query(
      `SELECT user_id, username, email, avatar_id, is_child, colour_theme_id, online FROM users 
    WHERE username = $1;`,
      [username]
    )
    .then(({ rows }) => {
      console.log("model");
      return rows[0];
    });
};
