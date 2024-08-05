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
  test.only("GET: 404 responds with Not found when a user does not have any notificacion", () => {
    return request(app)
      .get("/api/notifications/Janet")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

