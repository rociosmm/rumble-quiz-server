const { app } = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("/api/notifications", () => {
  test("GET: 200 responds with all the notifications for a user ordered by date desc", () => {
    return request(app)
      .get("/api/notifications/George")
      .expect(200)
      .then(({ body }) => {
        const { notifications } = body;
        expect(notifications).toBeSortedBy("time", {
          descending: true,
        });
        expect(notifications[0]).toMatchObject({
          notification_id: 1,
          notification_text: "hello",
          seen: true,
          user_id: 1,
          sender_id: 2,
        });
        expect(notifications.length).toBeGreaterThan(0);
      });
  });
  test("GET: 404 responds with Not found when a user does not have any notificacion", () => {
    return request(app)
      .get("/api/notifications/Janet")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("/api/notifications/:notification_id", () => {
  test("PATCH: 200 responds with the modified notification", () => {
    return request(app)
      .patch("/api/notifications/3")
      .expect(200)
      .then(({ body }) => {
        const { notification } = body;
        expect(notification.notification_id).toBe(3);
        expect(notification.seen).toBe(true);
      });
  });
  test("PATCH: 404 responds with Not found if the id does not exists in the db", () => {
    return request(app)
      .patch("/api/notifications/5555")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("PATCH: 400 responds with Bad request if the parameter passed is not a number", () => {
    return request(app)
      .patch("/api/notifications/cat")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
