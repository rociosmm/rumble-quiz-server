const format = require("pg-format");
const db = require("../db/connection");

exports.fetchNotifByUser = (username) => {
  const queryString = `SELECT * FROM notifications WHERE user_id = (SELECT user_id FROM users WHERE username = $1) ORDER BY time DESC`;

  return db.query(queryString, [username]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows;
  });
};

exports.patchNotif = (id) => {
  const queryString = `UPDATE notifications SET seen = true WHERE notification_id = $1 RETURNING *`;
  return db.query(queryString, [id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0];
  });
};
