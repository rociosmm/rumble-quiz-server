const format = require("pg-format");
const db = require("../db/connection");

exports.addGameDataToLog = (gameData) => {
  if (gameData.length === 0)
    return Promise.reject({ status: 400, msg: "Bad Request" });
  const insertQueryStr = format(
    `INSERT INTO 
    logs (game_id, player_username, won_game, points, topic_name)
     VALUES %L
     RETURNING *;`,
    gameData.map(
      ({ game_id, player_username, won_game, points, topic_name }) => [
        game_id,
        player_username,
        won_game,
        points,
        topic_name,
      ]
    )
  );

  return db.query(insertQueryStr).then(({ rows }) => {
    if (rows.length === 0)
      return Promise.reject({ status: 400, msg: "Bad Request" });
    return rows;
  });
};

exports.fetchUsersPoints = () => {
  return db
    .query(
      `
    SELECT 
    player_username,
    CAST(SUM(points) AS INTEGER) AS total_points 
    FROM logs
    GROUP BY player_username
    ORDER BY total_points DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchGameData = (game_id, player_username) => {
  const argumentsArr = [game_id];
  let queryString = `SELECT * FROM logs WHERE game_id = $1`;

  if (player_username !== undefined && isNaN(Number(player_username))) {
    queryString += ` AND player_username = $2`;
    argumentsArr.push(player_username);
  }

  if (!isNaN(Number(player_username))) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db.query(queryString, argumentsArr).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else if (rows.length === 1) {
      return rows[0];
    } else {
      return rows;
    }
  });
};
