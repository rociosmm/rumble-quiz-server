const { createGameData, addPlayerToGame } = require("../models/game.model");
const checkRoomExists = (io, topic_id) => {
  const rooms = io.sockets.adapter.rooms;
  return rooms.has(topic_id);
};

const joinRoom = (io, topic_id, socket, ROOM_LIMIT, username, avatarUrl) => {
  const room = io.sockets.adapter.rooms.get(topic_id);
  const roomExists = checkRoomExists(io, topic_id);
  if (!roomExists) {
    socket.join(`${topic_id}`);
    createGameData(topic_id);
  } else if (roomExists & (room.size < ROOM_LIMIT)) {
    socket.join(`${topic_id}`);
  } else {
    //when there are already 10 people inside the room.
    socket.emit(addedToRoom, "full");
  }
  addPlayerToGame(username, avatarUrl, topic_id);
};

module.exports = { checkRoomExists, joinRoom };
