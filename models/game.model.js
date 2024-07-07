const ongoingGames = {};

const createGameData = (topic_id) => {
  ongoingGames[topic_id] = {
    players_active: [],
    players_eliminated: [],
    round_counter: 1,
    avatar_urls: [],
    points: {},
  };
};


module.exports = { ongoingGames, createGameData };
