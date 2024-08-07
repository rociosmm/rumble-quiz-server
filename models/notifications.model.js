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

exports.postNotification = ({
  notification_text = "added you as a friend",
  seen = false,
  user_id,
  sender_id,
}) => {
  if (!user_id || !sender_id) {
    return Promise.reject({ status: 400, msg: "Not enough data" });
  }

  if (typeof user_id !== "number" || typeof sender_id !== "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryUserExists = `SELECT * FROM users WHERE user_id = $1`;
  const querySenderExists = `SELECT * FROM users WHERE user_id = $1`;
  return Promise.all([
    db.query(queryUserExists, [user_id]),
    db.query(querySenderExists, [sender_id]),
  ]).then((values) => {
    if (!values[0].rows.length || !values[1].rows.length) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request: user or users don't exist",
      });
    } else {
      const postQueryString = format(
        `INSERT INTO notifications (notification_text, seen, user_id, sender_id) VALUES (%L) RETURNING *`,
        [notification_text, seen, user_id, sender_id]
      );

      return db.query(postQueryString).then(({ rows }) => {
        console.log("rows[0] :>> ", rows[0]);
        return rows[0];
      });
    }
  });
};
