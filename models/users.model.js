const db = require("../db/connection");
const format = require("pg-format");
const bcrypt = require("bcrypt");

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

  return bcrypt
    .hash(password, 10)
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

exports.modifyUser = (modifiedUser, username) => {
  const properties = Object.keys(modifiedUser);

  return db
    .query(`SELECT user_id FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      user_id = rows[0].user_id;

      return Promise.all([
        properties.map((property) => {
          const newValue = modifiedUser[property];

          const queryStr = format(
            `
        UPDATE users
        SET %I = $1
        WHERE user_id = $2
        RETURNING *;
        `,
            property
          );

          return db.query(queryStr, [newValue, user_id]);
        }),
      ]);
    })
    .then((promiseArr) => {
      console.log(promiseArr[0]);
      return db.query(
        `SELECT user_id, username, email, avatar_id, is_child, colour_theme_id, online FROM users WHERE user_id = $1;`,
        [user_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
