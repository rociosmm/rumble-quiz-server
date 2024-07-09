// const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { server } = require("../app");
const { configureSockets } = require("../sockets/configure-sockets");
const { checkRoomExists, joinRoom } = require("../sockets/create-room");
const {
  addPlayerToGame,
  createGameData,
  ongoingGames,
} = require("../models/game.model");
const ioc = require("socket.io-client");
const db = require("../db/connection");

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

let io, serverSocket, clientSocket;

beforeAll((done) => {
  io = configureSockets(server, 1);
  server.listen(() => {
    const port = server.address().port;
    clientSocket = ioc(`http://localhost:${port}`);
    io.on("connection", (socket) => {
      serverSocket = socket;
    });
    clientSocket.on("connect", done);
  });
});

beforeEach((done) => {
  for (const game in ongoingGames) delete ongoingGames[game];
  done();
});

afterAll((done) => {
  io.close();
  clientSocket.disconnect();
  db.end();
  done();
});

describe("RumbleQuiz", () => {
  test("should work", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("should work with an acknowledgement", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      expect(arg).toBe("hola");
      done();
    });
  });

  test("should work with emitWithAck()", async () => {
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });
    const result = await clientSocket.emitWithAck("foo");
    expect(result).toBe("bar");
  });

  test("should work with waitFor()", () => {
    clientSocket.emit("baz");

    return waitFor(serverSocket, "baz");
  });
});

describe("Creating and joining rooms", () => {
  test("checkRoomExists() should return true if room exists", () => {
    const topic_id = "13";
    serverSocket.join(topic_id);

    const output = checkRoomExists(io, topic_id);

    expect(output).toBeTruthy();
    serverSocket.leave(topic_id);
  });
  test("checkRoomExists() should return false if room does not exist", () => {
    const output = checkRoomExists(io, "notARoom");

    expect(output).toBeFalsy();
  });
  test("joinRoom() puts socket in room of the topic_id", () => {
    const topic_id = "12";

    expect(io.sockets.adapter.rooms.size).toBe(1);

    joinRoom(io, topic_id, serverSocket);

    expect(io.sockets.adapter.rooms.size).toBe(2);
    expect(io.sockets.adapter.rooms.get(topic_id)).toBeTruthy();
    serverSocket.leave(topic_id);
  });
  test("joinRoom() invokes createGameData() if checkRoomExists() is falsy", async () => {
    const topic_id = "16";
    expect(ongoingGames).toEqual({});

    await joinRoom(io, topic_id, serverSocket);
    expect(ongoingGames[topic_id]).toMatchObject({
      players_active: [],
      players_eliminated: [],
      round_counter: 1,
      avatar_urls: {},
      points: {},
    });
    serverSocket.leave(topic_id);
  });
  test("joinRoom invokes addPlayerToGame(), thereby updating ongoingGames with player data", async () => {
    const topic_id = "43";
    const examplePlayer = {
      username: "SparkleUnicorn",
      avatar_url: "wwww.example.com/image.png",
    };

    await joinRoom(
      io,
      topic_id,
      serverSocket,
      1,
      examplePlayer.username,
      examplePlayer.avatar_url
    );

    expect(ongoingGames[topic_id]).toMatchObject({
      players_active: ["SparkleUnicorn"],
      players_eliminated: [],
      round_counter: 1,
      avatar_urls: {
        SparkleUnicorn: "wwww.example.com/image.png",
      },
      points: { SparkleUnicorn: 0 },
    });
    serverSocket.leave(topic_id);
  });
  test("createGameData() creates initial data for a room that has just been created", () => {
    const topic_id = "14";
    createGameData(topic_id);

    expect(ongoingGames).toHaveProperty(topic_id);
    expect(ongoingGames[topic_id]).toMatchObject({
      players_active: [],
      players_eliminated: [],
      round_counter: 1,
      avatar_urls: {},
      points: {},
    });
    serverSocket.leave(topic_id);
  });
  test("addPlayerToGame() adds player details to correct game room in ongoingGames object", () => {
    const topic_id = "72";
    const examplePlayer = {
      username: "SparkleUnicorn",
      avatar_url: "wwww.example.com/image.png",
    };

    createGameData(topic_id);
    addPlayerToGame(examplePlayer.username, examplePlayer.avatar_url, topic_id);
    expect(ongoingGames[topic_id]).toMatchObject({
      players_active: ["SparkleUnicorn"],
      players_eliminated: [],
      round_counter: 1,
      avatar_urls: {
        SparkleUnicorn: "wwww.example.com/image.png",
      },
      points: { SparkleUnicorn: 0 },
    });
    serverSocket.leave(topic_id);
  });
  test("On topic-selected event from client, server invokes joinRoom() function", async () => {
    const topic_id = "25";

    const examplePlayer = {
      username: "SparkleUnicorn",
      avatar_url: "wwww.example.com/image.png",
    };

    await new Promise((resolve) => {
      clientSocket.emit("topic-selected", topic_id, examplePlayer, () => {
        resolve();
      });
    });

    expect(ongoingGames[topic_id]).toMatchObject({
      players_active: ["SparkleUnicorn"],
      players_eliminated: [],
      round_counter: 1,
      avatar_urls: {
        SparkleUnicorn: "wwww.example.com/image.png",
      },
      points: { SparkleUnicorn: 0 },
    });

    serverSocket.leave(topic_id);
  });
  test("When room reaches predefined limit, the server emits game-start event to client with game avatars.", async () => {
    const topic_id = "64";
    const examplePlayer = {
      username: "MrMan",
      avatar_url: "wwww.example.com/image.png",
    };

    clientSocket.on("avatars", (avatars) => {
      console.log(avatars, "<<avatars", topic_id);
      expect(avatars).toEqual({
        MrMan: "wwww.example.com/image.png",
      });
    });

    await new Promise((resolve) => {
      clientSocket.emit("topic-selected", topic_id, examplePlayer, () => {
        resolve();
      });
    });
    serverSocket.leave(topic_id);

    return waitFor(clientSocket, "avatars");
  });
});

describe.only("Game play", () => {
  test("Requests questions for specified topic_id", async () => {
    const topic_id = "13";
    const examplePlayer = {
      username: "ReadyPlayerOne",
      avatar_url: "wwww.example.com/image.png",
    };

    clientSocket.on("question", (question) => {
      console.log(question);

      expect(question).toMatchObject({
        question: expect.any(String),
        correct_answer: expect.any(String),
        incorrect_answers: [
          expect.any(String),
          expect.any(String),
          expect.any(String),
        ],
      });
    });

    await new Promise((resolve) => {
      clientSocket.emit("topic-selected", topic_id, examplePlayer, () => {
        resolve();
      });
    });

    return waitFor(clientSocket, "question");
  });
});

//describe("Game end")
