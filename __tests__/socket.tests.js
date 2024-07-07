// const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { server } = require("../app");
const { configureSockets } = require("../sockets/configure-sockets");
const { checkRoomExists, joinRoom } = require("../sockets/create-room");
const { createGameData, ongoingGames } = require("../models/game.model");
const ioc = require("socket.io-client");
const { config } = require("dotenv");

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

let io, serverSocket, clientSocket;

beforeAll((done) => {
  io = configureSockets(server);
  server.listen(() => {
    const port = server.address().port;
    clientSocket = ioc(`http://localhost:${port}`);
    io.on("connection", (socket) => {
      serverSocket = socket;
    });
    clientSocket.on("connect", done);
  });
});

beforeEach(() => {
  for (const game in ongoingGames) delete ongoingGames[game];
});

afterAll(() => {
  io.close();
  clientSocket.disconnect();
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
  test("joinRoom() invokes createGameData() if checkRoomExists() is falsy", () => {
    const topic_id = "16";
    expect(ongoingGames).toEqual({});

    joinRoom(io, topic_id, serverSocket);
    expect(ongoingGames[topic_id]).toMatchObject({
      players_active: [],
      players_eliminated: [],
      round_counter: 1,
      avatar_urls: [],
      points: {},
    });
    serverSocket.leave(topic_id);
  });
  test.todo(
    "joinRoom invokes addPlayerToGame(), thereby updating ongoingGames with player data"
  );
  test("createGameData() creates initial data for a room that has just been created", () => {
    const topic_id = "14";
    createGameData(topic_id);

    expect(ongoingGames).toHaveProperty(topic_id);
    expect(ongoingGames[topic_id]).toMatchObject({
      players_active: [],
      players_eliminated: [],
      round_counter: 1,
      avatar_urls: [],
      points: {},
    });
    serverSocket.leave(topic_id);
  });
  test.todo(
    "addPlayerToGame() adds player details to correct game room in ongoingGames object"
  );
});
