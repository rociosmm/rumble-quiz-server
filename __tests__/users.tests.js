const { app } = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("/api/users/:userRequested", () => {
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
  test("GET: 200 responds with a single user", () => {
    return request(app)
      .get("/api/users/1")
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
          avatar_name: expect.any(String),
          avatar_url: expect.any(String),
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
      username: "Janet2",
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
});

describe("/api/users/:username/friends", () => {
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
  test("GET: 404 responds with User Not Found if username not found", () => {
    return request(app)
      .get("/api/users/madeupname/friends")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
  test("POST: 200 responds with new friendship", () => {
    const newFriend = {
      newFriend: "Janet",
    };

    return request(app)
      .post("/api/users/Tobias/friends")
      .send(newFriend)
      .expect(200)
      .then(({ body }) => {
        expect(body.friendship).toEqual({
          user1_username: "Tobias",
          user2_username: "Janet",
        });
      });
  });
  test("POST: 404 responds with User Not Found if username isn't found", () => {
    const newFriend = {
      newFriend: "Janet",
    };

    return request(app)
      .post("/api/users/MrMan/friends")
      .send(newFriend)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
  test("POST: 404 responds with User Not Found if new friend username isn't found", () => {
    const newFriend = {
      newFriend: "MrMan",
    };

    return request(app)
      .post("/api/users/Janet/friends")
      .send(newFriend)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
  test("POST: 400 responds with Bad Request if request is malformed", () => {
    const newFriend = {};

    return request(app)
      .post("/api/users/Janet/friends")
      .send(newFriend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/users/:username/logs", () => {
  test("GET: 200 responds with game data for that user", () => {
    return request(app)
      .get("/api/users/George/logs")
      .expect(200)
      .then(({ body }) => {
        expect(body.log).toMatchObject({
          player_username: "George",
          games_played: 2,
          games_won: 1,
          total_points: 170,
          top_topic: "1",
        });
      });
  });
  test("GET: 404 responds with No Data Found is username is not in databse", () => {
    return request(app)
      .get("/api/users/MrMan/logs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No Data Found");
      });
  });
});

describe("/api/users", () => {
  test("GET: 200 responds with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBeGreaterThan(1)

        users.forEach((user) => {
          expect(user).toMatchObject({
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
  });
  test("GET: 200 responds with all online users", () => {
    return request(app)
      .get("/api/users?online=true")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(1);

        users.forEach((user) => {
          expect(user).toMatchObject({
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
  test("POST: 400 responds with Bad Request: [username/ email]", () => {
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
        expect(body.msg).toBe("Bad Request: username");
      });
  });
});

describe("/api/users/login", () => {
  test("POST: 200 returns user with json web token (jwt) on body", () => {
    const loginData = {
      username: "George",
      password: "123abc",
    };

    return request(app)
      .post("/api/users/login")
      .send(loginData)
      .expect(200)
      .then(({ body }) => {
        expect(body.successfulLogin).toMatchObject({
          token: expect.any(String),
          user: expect.any(Object),
        });
        expect(body.successfulLogin.user).toMatchObject({
          user_id: 1,
          username: "George",
          email: "george.bluth@reqres.in",
          avatar_id: 1,
          is_child: false,
          colour_theme_id: 1,
          online: true,
        });
      });
  });
  test("POST: 404 responds with User Not Found if username not in database", () => {
    const loginData = {
      username: "UserNotHere",
      password: "123abc",
    };
    return request(app)
      .post("/api/users/login")
      .send(loginData)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
  test("POST: 400 responds with Wrong Password if input password does not match stored password", () => {
    const loginData = {
      username: "George",
      password: "notthepassword",
    };
    return request(app)
      .post("/api/users/login")
      .send(loginData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Wrong password");
      });
  });
  test("POST: 400 responds with Bad Request if request body is missing fields", () => {
    const loginData = {
      username: "George",
    };
    return request(app)
      .post("/api/users/login")
      .send(loginData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Password Missing");
      });
  });
});
