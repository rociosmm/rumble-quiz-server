//https://github.com/BurakPetro/nc_group_project_ok_game/blob/main/server/src/sockets/socketManger.js

const socketIO = require("socket.io");
const { joinRoom } = require("./create-room");
const { ongoingGames, updateGameData } = require("../models/game.model");

const axios = require("axios");

const openTdb_url = axios.create({
  baseURL: "https://opentdb.com",
});

exports.configureSockets = (server, ROOM_LIMIT = 1) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log("Rooms open:", io.of("/").adapter.rooms);
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
            `/api.php?amount=${ROOM_LIMIT}&category=${topic_id}&difficulty=medium&type=multiple`
          )
          .then(({ data }) => {
            const topicName = data.results[0].category;
            const questions = data.results.map((response) => {
              const { question, correct_answer, incorrect_answers } = response;
              return { question, correct_answer, incorrect_answers };
            });

            while (ongoingGames[topic_id].players_active.length > 1) {
              const round = ongoingGames[topic_id].round_counter;
              io.to(topic_id).emit("question", questions[round], () => {
                console.log(`Question ${round + 1} sent to room ${topic_id}`);
                console.log(questions[round]);
              });

              let answersReceived = 0;

              socket.on("answer", (answerData) => {
                console.log(
                  `Answer ${round + 1} received from user ${
                    socket.id
                  } in room ${topic_id}`
                );
                updateGameData(topic_id, answerData);
                answersReceived++;
              });

              const remainingPlayersInGame =
                ROOM_LIMIT - ongoingGames[topic_id].players_eliminated.length;
              if (answersReceived === remainingPlayersInGame) {
                ongoingGames[topic_id].round_counter++;
              }
            }
          })
          .catch((err) => {
            console.log("Error getting data from optentdb!");
          });
      }
    });
    // socket.on("leave-game", (topic_id) => {
    //   console.log(`${socket.id} has left their game`);
    //   const index = game.players_active.indexOf(answerData.username);
    //   game.players_active.splice(index, 1);
    //   game.players_eliminated.push(answerData.username);
    //   socket.leave(topic_id);
    // });
    // socket.on("disconnect", disconnect);
  });

  return io;
};
