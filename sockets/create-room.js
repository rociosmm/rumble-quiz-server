const { createGameData, addPlayerToGame } = require("../models/game.model");
const checkRoomExists = (io, topic_id) => {
  const rooms = io.sockets.adapter.rooms;
  return rooms.has(topic_id);
};

const joinRoom = async (
  io,
  topic_id,
  socket,
  ROOM_LIMIT,
  username,
  avatarUrl
) => {
  const room = io.sockets.adapter.rooms.get(topic_id);
  const roomExists = checkRoomExists(io, topic_id);
  console.log('room - create room file :>> ', room);
  console.log('roomExists - create room file :>> ', roomExists);
  if (!roomExists) {
    await socket.join(`${topic_id}`);
    createGameData(topic_id);
  } else if (roomExists & (room.size < ROOM_LIMIT)) {
    await socket.join(`${topic_id}`);
  } else {
    //when there are already x people inside the room.
    await socket.emit("avatars", "room-full");
  }
  addPlayerToGame(username, avatarUrl, topic_id);
};

module.exports = { checkRoomExists, joinRoom };
