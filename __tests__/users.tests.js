const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});
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
  test("PATCH: 200 responds with the modified user", () => {
    const newUsername = {
      username: "Janet52",
      email: "newemail@email.com",
    };

    return request(app)
      .patch("/api/users/Janet")
      .expect(200)
      .send(newUsername)
      .then(({ body }) => {
        expect(body.modifiedUser).toMatchObject({
          user_id: expect.any(Number),
          username: "Janet2",
          email: "newemail@email.com",
          avatar_id: expect.any(Number),
          is_child: expect.any(Boolean),
          colour_theme_id: expect.any(Number),
          online: expect.any(Boolean),
        });
      });
  });
  test("PATCH: 404 responds with Not Found", () => {
    const newUsername = {
      username: "Janet2",
      email: "newemail@email.com",
    };

    return request(app)
      .patch("/api/users/NotaUserName")
      .expect(404)
      .send(newUsername)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
  test("PATCH: 400 responds with Bad Request when request is malformed", () => {
    const badRequest = {};

    return request(app)
      .patch("/api/users/Janet")
      .expect(400)
      .send(badRequest)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH: 400 responds with Bad Request when username is taken", () => {
    const badRequest = { username: "George" };

    return request(app)
      .patch("/api/users/Janet")
      .expect(400)
      .send(badRequest)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Username/email exists in table");
      });
  });
  test("PATCH: 400 responds with Bad Request when email is taken", () => {
    const badRequest = { email: "george.bluth@reqres.in" };

    return request(app)
      .patch("/api/users/Janet")
      .expect(400)
      .send(badRequest)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Username/email exists in table");
      });
  });
  test("GET: 200 should respond with all friends ", () => {
    return request(app)
      .get("/api/users/George/friends")
      .expect(200)
      .then(({ body }) => {
        expect(body.friends).toHaveLength(3);
        body.friends.forEach((friend) => {
          expect(friend).toMatchObject({
            user1_username: "George",
            user2_username: expect.any(String),
          });
        });
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
  test("POST: 201 responds with a newly posted user", () => {
    const requestBody = {
      username: "Jo",
      email: "madeup@madeup.com",
      password: "password123",
      avatar_id: 1,
      is_child: false,
      colour_theme_id: 1,
      online: true,
    };
    return request(app)
      .post("/api/users")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        expect(body.newUser).toMatchObject({
          user_id: 12,
          username: "Jo",
          email: "madeup@madeup.com",
          password: expect.any(String),
          avatar_id: 1,
          is_child: false,
          colour_theme_id: 1,
          online: true,
        });
      });
  });
  test("POST: 201 responds with an encrypted password on password property", () => {
    const requestBody = {
      username: "Jo",
      email: "madeup@madeup.com",
      password: "password123",
      avatar_id: 1,
      is_child: false,
      colour_theme_id: 1,
      online: true,
    };
    return request(app)
      .post("/api/users")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        expect(body.newUser.password).not.toBe(requestBody.password);
        expect(body.newUser.password).toHaveLength(60);
      });
  });
  test("POST: 400 bad request when required fields are missing", () => {
    const requestBody = {
      password: "password123",
      avatar_id: 1,
      is_child: false,
      colour_theme_id: 1,
      online: true,
    };
    return request(app)
      .post("/api/users")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST: 400 bad request when the fields have invalid values", () => {
    const requestBody = {
      username: "Jo",
      email: "madeup@madeup.com",
      password: "password123",
      avatar_id: 999,
      is_child: false,
      colour_theme_id: 1,
      online: 5,
    };
    return request(app)
      .post("/api/users")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST: 400 responds with Bad Request: [username/ email] is already taken", () => {
    const requestBody = {
      username: "Janet",
      email: "madeup@madeup.com",
      password: "password123",
      avatar_id: 1,
      is_child: false,
      colour_theme_id: 1,
      online: true,
    };
    return request(app)
      .post("/api/users")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: username is already taken");
      });
  });
});
