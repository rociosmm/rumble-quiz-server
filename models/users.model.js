const db = require("../db/connection");
const bcrypt = require("bcrypt");
const { checkIfExists } = require("./users.utils");
const jwt = require("jwt-simple");

exports.fetchAllUsers = (online) => {
  let queryStr = `SELECT user_id, username, email, avatar_id, is_child, colour_theme_id, online FROM users`;

  const arrToQueryString = [];
  if (online !== undefined) {
    queryStr += ` WHERE online = $1`;
    arrToQueryString.push(online);
  }

  return db.query(queryStr, arrToQueryString).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUser = (userRequested) => {
  let queryStr = `SELECT users.user_id, users.username, users.email, users.is_child, users.colour_theme_id, users.online, avatars.* FROM users 
  LEFT JOIN avatars ON users.avatar_id = avatars.avatar_id`;

  if (!isNaN(userRequested)) {
    queryStr += ` WHERE user_id = $1;`;
  } else {
    queryStr += ` WHERE username = $1;`;
  }
  return db.query(queryStr, [userRequested]).then(({ rows }) => {
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

exports.modifyUser = (modifiedUser, username) => {
  const properties = Object.keys(modifiedUser);

  if (properties.length === 0)
    return Promise.reject({ status: 400, msg: "Bad Request" });

  return db
    .query(`SELECT user_id FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "User Not Found" });
      user_id = rows[0].user_id;

      const setColumnStatemnts = properties.map((property) => {
        const newValue = modifiedUser[property];
        return `${property}='${newValue}'`;
      });

      const queryStr = `
        UPDATE users
        SET ${setColumnStatemnts.join(",")}
        WHERE user_id = $1;
        `;
      return db.query(queryStr, [user_id]).catch((err) => {
        return Promise.reject({
          status: 400,
          msg: "Bad Request: Username/email exists in table",
        });
      });
    })
    .then(() => {
      return db.query(
        `SELECT user_id, username, email, avatar_id, is_child, colour_theme_id, online FROM users WHERE user_id = $1;`,
        [user_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchFriends = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "User Not Found" });
      return db
        .query(`SELECT * FROM friendship WHERE user1_username = $1`, [username])
        .then(({ rows }) => {
          return rows;
        });
    });
};

exports.addFriendship = (username, newFriend) => {
  if (!newFriend) return Promise.reject({ status: 400, msg: "Bad Request" });

  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "User Not Found" });
      return db.query(`SELECT * FROM users WHERE username = $1;`, [newFriend]);
    })
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "User Not Found" });
      return db.query(
        `
    INSERT INTO friendship (user1_username, user2_username)
    VALUES ($1,$2)
    RETURNING *
    `,
        [username, newFriend]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchLog = (username) => {
  return db
    .query(
      `
  WITH topic_count AS (
    SELECT topic_name, COUNT(*) as category_count
    FROM logs
    WHERE player_username = $1
    GROUP BY topic_name
    ORDER BY category_count DESC
    LIMIT 1
)
    SELECT 
      player_username,
      CAST(COUNT(game_id) AS INTEGER) AS games_played,
      CAST((COUNT(won_game) filter(where won_game)) AS INTEGER) AS games_won,
      CAST(SUM(points) AS INTEGER) AS total_points,
      (SELECT topic_name FROM topic_count) AS top_topic
      FROM logs
      WHERE player_username = $1
      GROUP BY player_username;
      `,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "No Data Found" });
      return rows[0];
    });
};

var secret = Buffer.from("fe1a1915a379f3be5394b64d14794932", "hex");

exports.handleLogin = (user) => {
  if (!user.username)
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Username Missing",
    });
  if (!user.password)
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Password Missing",
    });
  // if (!userKeys.includes("username") & !userKeys.includes("password"))
  //   return Promise.all({ status: 400, msg: "Bad Request" });

  return db
    .query(
      `
    SELECT * FROM users WHERE username = $1
    `,
      [user.username]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "User Not Found" });
      const userData = rows[0];
      const storedPassword = rows[0].password;

      return Promise.all([
        bcrypt.compare(user.password, storedPassword),
        userData,
      ]);
    })
    .then((arr) => {
      const passwordMatched = arr[0];

      if (!passwordMatched)
        return Promise.reject({ status: 400, msg: "Wrong password" });

      const payload = arr[1];
      delete payload.password;
      const res = {
        token: jwt.encode(payload, secret),
        user: payload,
      };
      return res;
    });
};
