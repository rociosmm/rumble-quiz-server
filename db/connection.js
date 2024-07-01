const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

const pathToCorrectEnvFile = `${__dirname}/../.env.${ENV}`;

require("dotenv").config({
  path: pathToCorrectEnvFile,
});

module.exports = new Pool();
