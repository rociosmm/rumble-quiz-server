exports.checkRoomExists = (io, topic_id) => {
  const rooms = io.sockets.adapter.rooms;
 return rooms.has(topic_id);
};


