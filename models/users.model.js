const db = require("../db/connection");

exports.fetchUser = (user_id) => {
  console.log(user_id);
  return db
    .query(
      `SELECT user_id, username, email, avatar_id, is_child, colour_theme_id, online FROM users 
    WHERE user_id = $1;`,
      [user_id]
    )
    .then(({ rows }) => {
      console.log("model");
      return rows[0];
    });
};
