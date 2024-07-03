const db = require("../db/connection");
const format = require("pg-format");

exports.checkIfExists = (propertyName, value) => {
  console.log("utils");
  const queryStr = format(
    `SELECT * FROM users
        WHERE %I = $1;`,
    propertyName
  );
  return db.query(queryStr, [value]).then(({ rows }) => {
    console.log(rows);
    if (rows.length > 1) {
      return Promise.reject({
        status: 400,
        msg: `Bad Request: ${propertyName} is already taken`,
      });
    }
  });
};
