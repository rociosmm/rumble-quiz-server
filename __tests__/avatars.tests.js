const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/avatars", () => {
    test('GET 200: responds with a list of avatars', () => {
        return request(app)
        .get("/api/avatars")
        .expect(200)
        .then(({body}) => {
            body.avatars.forEach((avatar) => {
                expect(avatar).toMatchObject({
                    avatar_id: expect.any(Number),
                    avatar_name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    });
});
