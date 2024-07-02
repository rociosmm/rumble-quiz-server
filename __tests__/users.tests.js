const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/users/:username", () => {
  test("GET: 200 responds with a single user", () => {
    return request(app)
      .get("/api/users/George")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          user_id: expect.any(Number),
          username: expect.any(String),
          email: expect.any(String),
          avatar_id: expect.any(Number),
          is_child: expect.any(Boolean),
          colour_theme_id: expect.any(Number),
          online: expect.any(Boolean),
        });
      });
  });
  test("GET: 404 responds with a message User Not Found", () => {
    return request(app)
      .get("/api/users/123")
      .expect(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
});

describe("/api/users/", () => {
  test("GET: 200 responds with all online users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(1);

        body.users.forEach((user) => {
          expect(user).toMatchObject({
            user_id: expect.any(Number),
            username: expect.any(String),
            email: expect.any(String),
            avatar_id: expect.any(Number),
            is_child: expect.any(Boolean),
            colour_theme_id: expect.any(Number),
            online: true,
          });
        });
      });
  });
});
