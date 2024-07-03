const db = require("../db/connection");

exports.fetchSound = (sound_id) => {
  return db
    .query(`SELECT * FROM sounds WHERE sound_id = $1;`, [sound_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Sound Not Found" });
      } else {
        return rows[0];
      }
    });
};
