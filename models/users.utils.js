const db = require("../db/connection");
const format = require("pg-format");

exports.checkIfExists = (propertyName, value) => {
  const queryStr = format(
    `SELECT * FROM users
        WHERE %I = $1;`,
    propertyName
  );
  return db.query(queryStr, [value]).then(({ rows }) => {
    if (rows.length > 0) {
      return Promise.reject({
        status: 400,
        msg: `Bad Request: ${propertyName}`,
      });
    }
  });
};
