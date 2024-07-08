//https://github.com/BurakPetro/nc_group_project_ok_game/blob/main/server/src/sockets/socketManger.js

const socketIO = require("socket.io");
const { joinRoom } = require("./create-room");
const { ongoingGames } = require("../models/game.model");

exports.configureSockets = (server, ROOM_LIMIT = 10) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} connected to server`);
    socket.on("topic-selected", (topic_id, player, callback) => {
      joinRoom(
        io,
        topic_id,
        socket,
        ROOM_LIMIT,
        player.username,
        player.avatar_url
      );

      const room = io.sockets.adapter.rooms.get(topic_id);

      if (room.size === ROOM_LIMIT) {
        io.to(topic_id).emit("avatars", ongoingGames[topic_id].avatar_urls);
      }

      if (callback) callback();
    });
    // socket.on("disconnect", disconnect);
  });

  return io;
};
