const {app} = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("/api/logs", () => {
  test("POST: 201 responds with the logged information of the game just added", () => {
    const gameData = [
      {
        game_id: "a1b2c3",
        player_username: "George",
        won_game: true,
        points: 100,
        topic_name: "music",
      },
      {
        game_id: "a1b2c3",
        player_username: "Janet",
        won_game: false,
        points: 80,
        topic_name: "music",
      },
      {
        game_id: "a1b2c3",
        player_username: "Emma",
        won_game: false,
        points: 60,
        topic_name: "music",
      },
      {
        game_id: "a1b2c3",
        player_username: "Charles",
        won_game: false,
        points: 40,
        topic_name: "music",
      },
      {
        game_id: "a1b2c3",
        player_username: "Eve",
        won_game: false,
        points: 20,
        topic_name: "music",
      },
    ];

    return request(app)
      .post("/api/logs")
      .send(gameData)
      .expect(201)
      .then(({ body }) => {
        expect(body.addedLogs).toHaveLength(gameData.length);
        body.addedLogs.forEach((log) => {
          expect(log).toMatchObject({
            log_id: expect.any(Number),
            game_id: expect.any(String),
            player_username: expect.any(String),
            won_game: expect.any(Boolean),
            points: expect.any(Number),
            topic_name: expect.any(String),
          });
        });
      });
  });
  test("POST: 400 returns Bad Request if request body is empty", () => {
    const gameData = [];

    return request(app)
      .post("/api/logs")
      .send(gameData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST: 400 returns Bad Request if request body is malformed", () => {
    const gameData = [
      {
        game_id: "a1b2c3",
        won_game: true,
        points: 100,
        topic_name: "music",
      },
    ];
    return request(app)
      .post("/api/logs")
      .send(gameData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET: 200 responds with all the users ordered by points (desc)", () => {
    return request(app)
      .get("/api/logs")
      .expect(200)
      .then(({ body }) => {
        expect(body.leaderboard).toHaveLength(3);
        expect(body.leaderboard).toBeSorted("total_points", {
          descending: true,
        });
      });
  });
});
