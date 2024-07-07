const { createGameData } = require("../models/game.model");
checkRoomExists = (io, topic_id) => {
  const rooms = io.sockets.adapter.rooms;
  return rooms.has(topic_id);
};

joinRoom = (io, topic_id, socket) => {
  const room = io.sockets.adapter.rooms.get(topic_id);
  const roomExists = checkRoomExists(io, topic_id);
  if (!roomExists) {
    socket.join(`${topic_id}`);
    createGameData(topic_id);
    
  } else if (roomExists & (room.size < 10)) {
    socket.join(`${topic_id}`);
  } else {
    //when there are already 10 people inside the room.
    socket.emit(addedToRoom, "full");
  }
};

module.exports = { checkRoomExists, joinRoom };
