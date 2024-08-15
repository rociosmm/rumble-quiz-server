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
  console.log(
    "insertQueryStr in logsModel addGameDataToLog() :>> ",
    insertQueryStr
  );
  return db.query(insertQueryStr).then(({ rows }) => {
    console.log("rows :>> ", rows);
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
