//https://github.com/BurakPetro/nc_group_project_ok_game/blob/main/server/src/sockets/socketManger.js

const socketIO = require("socket.io");
const { joinRoom } = require("./create-room");

exports.configureSockets = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} connected to server`);
    socket.on("topic-selected", (topic_id, player, callback) => {
      joinRoom(io, topic_id, socket, player.username, player.avatar_url);
      if (callback) callback();
    });
    // socket.on("disconnect", disconnect);
  });

  return io;
};
