const format = require("pg-format");
const db = require("../db/connection")

exports.addGameDataToLog = (gameData) => {
  const insertQueryStr = format(
    `INSERT INTO 
    logs (game_id, player_id, won_game, points_gained, topic_name)
     VALUES %L
     RETURNING *;`,
    gameData.map(
      ({ game_id, player_id, won_game, points_gained, topic_name }) => [
        game_id,
        player_id,
        won_game,
        points_gained,
        topic_name,
      ]
    )
  );
  return db
    .query(insertQueryStr)
    .then(({ rows }) => {
      return rows;
    })
};
