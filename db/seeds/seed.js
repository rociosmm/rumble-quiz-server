const db = require("../connection");

function seed() {
  return db
    .query(`DROP TABLE IF EXISTS sounds;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS logs;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS notifications;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS friendship;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS colour_themes;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS avatars;`);
    })
    .then(() => {
      const avatarsTablePromise = db.query(`
        CREATE TABLE avatars(
        avatar_id SERIAL PRIMARY KEY,
        avatar_url VARCHAR(50) NOT NULL
        )
        `);

      const colourThemesTablePromise = db.query(`
            CREATE TABLE colour_themes (
            colour_theme_id SERIAL PRIMARY KEY,
            colour_theme_name VARCHAR(20) NOT NULL
            )
            `);

      return Promise.all([avatarsTablePromise, colourThemesTablePromise]);
    })
    .then(() => {
      return db.query(`
            CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR (20) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50),
            avatar_id INT REFERENCES avatars(avatar_id),
            is_child BOOLEAN,
            colour_theme_id INT REFERENCES colour_themes(colour_theme_id),
            online BOOLEAN
            )
            `);
    })
    .then(() => {
      return db.query(`
            CREATE TABLE sounds (
            sound_id SERIAL PRIMARY KEY,
            sound_url VARCHAR(50) NOT NULL,
            category VARCHAR(20) NOT NULL
            )
            `);
    })
    .then(() => {
      return db.query(`
            CREATE TABLE friendship (
            user1_id INT REFERENCES users(user_id),
            user2_id INT REFERENCES users(user_id)
            )
            `);
    })
    .then(() => {
      return db.query(`
            CREATE TABLE notifications(
            notification_id SERIAL PRIMARY KEY,
            notification_text VARCHAR(240),
            time TIMESTAMP DEFAULT NOW(),
            seen BOOLEAN,
            user_id INT REFERENCES users(user_id),
            sender_id INT REFERENCES users(user_id)
            )
            `);
    })
    .then(() => {
      return db.query(`
            CREATE TABLE logs(
            log_id SERIAL PRIMARY KEY,
            game_id INT,
            player_id INT REFERENCES users(user_id),
            won_game BOOLEAN,
            points_gained INT,
            topic_name VARCHAR(50)
            )
            `);
    });
}
module.exports = seed;
