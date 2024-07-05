// const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { server } = require("../app");
const { configureSockets } = require("../sockets/configure-sockets");
const { checkRoomExists } = require("../sockets/create-room");
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
    const topic_id = "new-room";
    serverSocket.join("new-room");

    const output = checkRoomExists(io, topic_id);

    expect(output).toBeTruthy();
  });
  test("checkRoomExists() should return false if room does not exist", () => {
    const output = checkRoomExists(io, "notARoom");

    expect(output).toBeFalsy();
  });
  
});
