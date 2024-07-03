const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("/api/sounds/:sound_id", () => {
  test("GET 200: responds with a sound using sound ID", () => {
    return request(app)
      .get("/api/sounds/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.sound).toMatchObject({
          sound_id: expect.any(Number),
          sound_url: expect.any(String),
          category: expect.any(String),
        });
      });
  });
  test("GET 404: responds with Sound Not Found error message when passed a sound ID that doesn't exist ", () => {
    return request(app)
    .get("/api/sounds/9999")
    .expect(404)
    .then(({body}) => {
        expect(body.msg).toBe("Sound Not Found")
    })
  });
  test("GET 400: responds with Bad Request error message when passed an invalid sound ID", () => {
    return request(app)
    .get("/api/sounds/hello")
    .expect(400)
    .then(({body}) => {
        expect(body.msg).toBe("Bad Request")
    })
  })
});
