//https://github.com/BurakPetro/nc_group_project_ok_game/blob/main/server/src/sockets/socketManger.js

const socketIO = require("socket.io");
const { joinRoom } = require("./create-room");
const { ongoingGames } = require("../models/game.model");

ROOM_LIMIT = 1;
exports.configureSockets = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} connected to server`);

    socket.on("topic-selected", async (topic_id, player, callback) => {
      if (callback) callback();
      console.log(`${socket.id} selected a topic`);

      console.log(topic_id, player);
      await joinRoom(
        io,
        topic_id,
        socket,
        ROOM_LIMIT,
        player.username,
        player.avatar_url
      );

      const room = io.sockets.adapter.rooms.get(topic_id);

      console.log(room);

      // if (room.size && room.size === ROOM_LIMIT) {
      io.to(topic_id).emit("avatars", ongoingGames[topic_id].avatar_urls);
      // }
    });
    // socket.on("disconnect", disconnect);
  });

  return io;
};
