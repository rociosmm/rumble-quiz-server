const db = require("../db/connection");
const bcrypt = require("bcrypt");
const { checkIfExists } = require("./users.utils");

exports.fetchOnlineUsers = () => {
  return db
    .query(
      `SELECT user_id, username, email, avatar_id, is_child, colour_theme_id, online FROM users
    WHERE online = true;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

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

exports.createUser = (newUser) => {
  const {
    username,
    email,
    password,
    avatar_id,
    is_child,
    colour_theme_id,
    online,
  } = newUser;

  return checkIfExists("username", username)
    .then(() => {
      return checkIfExists("email", email);
    })
    .then(() => {
      return bcrypt.hash(password, 10);
    })

    .then((password) => {
      return db.query(
        `INSERT INTO users (username, email, password, avatar_id, is_child, colour_theme_id, online)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
        [
          username,
          email,
          password,
          avatar_id,
          is_child,
          colour_theme_id,
          online,
        ]
      );
    })

    .then(({ rows }) => {
      return rows[0];
    });
};
