const socketIO = require("socket.io");
const { joinRoom } = require("./create-room");
const {
  ongoingGames,
  updateGameData,
  logGameData,
} = require("../models/game.model");
const decodeHTMLEntities = require("../utils/decode-html-entities");
const axios = require("axios");

const openTdb_url = axios.create({
  baseURL: "https://opentdb.com",
});

exports.configureSockets = (server, ROOM_LIMIT = 3) => {
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

      console.log(`${player.username} selected a topic`);

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
            `/api.php?amount=20&category=${topic_id}&difficulty=medium&type=multiple`
          )
          .then(({ data }) => {
            const topicName = data.results[0].category;
            const questions = data.results.map((response) => {
              const question = decodeHTMLEntities(response.question);
              const correct_answer = decodeHTMLEntities(
                response.correct_answer
              );
              const incorrect_answers = response.incorrect_answers.map(
                (answer) => decodeHTMLEntities(answer)
              );

              return {
                question,
                correct_answer,
                incorrect_answers
              };
            });

            const sendNextQuestion = async () => {
              questions[round].avatars = ongoingGames[topic_id].avatar_urls
              questions[round].remainingPlayers = ongoingGames[topic_id].players_active.length

              const round = ongoingGames[topic_id].round_counter;

              if (ongoingGames[topic_id].players_active.length > 1) {
                io.to(topic_id).emit("question", questions[round], () => {
                  console.log(`Question ${round + 1} sent to room ${topic_id}`);
                });
              } else {
                console.log(`${topic_id}: game ended`);
                io.to(topic_id).emit("end-of-game");
                await logGameData(topic_id, topicName);
              }
            };

            if (ongoingGames[topic_id].round_counter === 0) sendNextQuestion();

            let answersReceived = 0;

            socket.on("answer", (answerData) => {
              console.log(answerData);
              console.log(
                `Answer ${
                  ongoingGames[topic_id].round_counter + 1
                } received from user ${player.username} in room ${topic_id}`
              );
              updateGameData(topic_id, answerData);
              answersReceived++;

              setTimeout(() => {
                io.to(topic_id).emit("playersReady");
                ongoingGames[topic_id].round_counter++;

                sendNextQuestion();
              }, 10000);
            });
          })
          .catch((err) => {
            console.log("Error getting data from opentdb!");
          });
      }
    });

    socket.on("leave-game", (username) => {
      console.log(`${socket.id} has left their game`);

      for (let i = 0; i < Object.keys(ongoingGames).length; i++) {
        const key = Object.keys(ongoingGames)[i];
        const playerIndex = ongoingGames[key].players_active.indexOf(username);
        ongoingGames[key].players_active.splice(playerIndex, 1);
        ongoingGames[key].players_eliminated.push(username);
      }

      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });

      console.log(`${socket.id} has left their game`);
    });

    // socket.on("disconnect", disconnect);
  });

  return io;
};
