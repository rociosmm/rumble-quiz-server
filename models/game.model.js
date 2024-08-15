const ongoingGames = {};
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const createGameData = (topic_id) => {
  ongoingGames[topic_id] = {
    players_active: [],
    players_eliminated: [],
    round_counter: 0,
    avatar_urls: {},
    points: {},
  };
};

const addPlayerToGame = (username, avatarUrl, topic_id) => {
  const game = ongoingGames[topic_id];
  game.players_active.push(username);
  game.avatar_urls[username] = avatarUrl;
  game.points[username] = 0;
};

const updateGameData = (topic_id, answerData) => {
  const game = ongoingGames[topic_id];

  game.round_counter++;
  if (answerData.eliminated) {
    const index = game.players_active.indexOf(answerData.username);
    game.players_active.splice(index, 1);
    game.players_eliminated.push(answerData.username);
    game.avatar_urls[answerData.username] =
      "https://img.icons8.com/?size=100&id=7703&format=png&color=000000";
  }
  game.points[answerData.username] += answerData.points;
};

const logGameData = async (topic_id, topic_name) => {
  const game = ongoingGames[topic_id];
  const game_id = topic_id + uuidv4();

  const baseURL = axios.create({
    baseURL: "https://rumble-quiz-server-1m0p.onrender.com/api",
  });

  const postDat = [];

  game.players_active.forEach(async (player) => {
    postDat.push({
      game_id: game_id,
      player_username: player,
      won_game: true,
      points: game.points[player],
      topic_name: topic_name,
    });
  });

  game.players_eliminated.forEach(async (player) => {
    postDat.push({
      game_id: game_id,
      player_username: player,
      won_game: true,
      points: game.points[player],
      topic_name: topic_name,
    });
  });

  await baseURL.post("/logs", postDat).catch((err) => {
    console.log("Error posting log:", err);
  });
  console.log("Game log added:", postDat);
};

module.exports = {
  addPlayerToGame,
  ongoingGames,
  createGameData,
  updateGameData,
  logGameData,
};
