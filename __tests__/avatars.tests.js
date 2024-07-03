const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("/api/avatars", () => {
  test("GET 200: responds with a list of avatars", () => {
    return request(app)
      .get("/api/avatars")
      .expect(200)
      .then(({ body }) => {
        body.avatars.forEach((avatar) => {
          expect(avatar).toMatchObject({
            avatar_id: expect.any(Number),
            avatar_name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/avatars/:avatar_id", () => {
  test("GET 200: responds with a single avatar using avatar ID", () => {
    return request(app)
      .get("/api/avatars/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.avatar).toMatchObject({
          avatar_id: expect.any(Number),
          avatar_name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  test("GET 404: responds with Avatar Not Found error message when passed avatar ID that does not exist", () => {
    return request(app)
      .get("/api/avatars/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Avatar Not Found");
      });
  });
  test("GET 400: responds with Bad Request error message when passed an invalid avatar ID", () => {
    return request(app)
      .get("/api/avatars/hola")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
