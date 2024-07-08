const ongoingGames = {};

const createGameData = (topic_id) => {
  ongoingGames[topic_id] = {
    players_active: [],
    players_eliminated: [],
    round_counter: 1,
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

module.exports = { addPlayerToGame, ongoingGames, createGameData };
