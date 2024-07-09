//https://github.com/BurakPetro/nc_group_project_ok_game/blob/main/server/src/sockets/socketManger.js

const socketIO = require("socket.io");
const { joinRoom } = require("./create-room");
const { ongoingGames } = require("../models/game.model");

const axios = require("axios");

const openTdb_url = axios.create({
  baseURL: "https://opentdb.com",
});

exports.configureSockets = (server, ROOM_LIMIT = 4) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log(`${socket.id} connected to server`);

    socket.on("topic-selected", async (topic_id, player, callback) => {
      if (callback) callback();

      console.log(`${socket.id} selected a topic`);

      await joinRoom(
        io,
        topic_id,
        socket,
        ROOM_LIMIT,
        player.username,
        player.avatar_url
      );

      const room = io.sockets.adapter.rooms.get(topic_id);

      if (room.size === ROOM_LIMIT) {
        io.to(topic_id).emit(
          "avatars",
          ongoingGames[topic_id].avatar_urls,
          () => {
            console.log(`Avatars emitted to room: ${topic_id}`);
          }
        );

        await openTdb_url
          .get(
            `/api.php?amount=10&category=${topic_id}&difficulty=medium&type=multiple`
          )
          .then(({ data }) => {
            const questions = data.results.map((response) => {
              const { question, correct_answer, incorrect_answers } = response;
              return { question, correct_answer, incorrect_answers };
            });
            io.to(topic_id).emit("question", questions[0]);
          })
          .catch((err) => {
            console.log("Error getting data from optentdb:", err);
          });
      }
    });
    // socket.on("disconnect", disconnect);
  });

  return io;
};
