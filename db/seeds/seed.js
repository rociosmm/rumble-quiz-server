const db = require("../connection");
const format = require("pg-format");
const bcrypt = require("bcrypt");

function seed({
  avatars,
  colourThemes,
  users,
  sounds,
  friendship,
  notifications,
  logs,
}) {
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
      return db.query(`
        CREATE TABLE avatars(
        avatar_id SERIAL PRIMARY KEY,
        avatar_name VARCHAR(50) NOT NULL,
        avatar_url VARCHAR(50) NOT NULL
        );
        `);
    })
    .then(() => {
      return db.query(`
              CREATE TABLE colour_themes (
              colour_theme_id SERIAL PRIMARY KEY,
              colour_theme_name VARCHAR(20) NOT NULL
              );
              `);
    })
    .then(() => {
      return db.query(`
            CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR (20) NOT NULL UNIQUE,
            email VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(60),
            avatar_id INT REFERENCES avatars(avatar_id),
            is_child BOOLEAN,
            colour_theme_id INT REFERENCES colour_themes(colour_theme_id),
            online BOOLEAN
            );
            `);
    })
    .then(() => {
      return db.query(`
            CREATE TABLE sounds (
            sound_id SERIAL PRIMARY KEY,
            sound_url VARCHAR(100) NOT NULL,
            category VARCHAR(20) NOT NULL
            );
            `);
    })
    .then(() => {
      return db.query(`
            CREATE TABLE friendship (
            friendship_id SERIAL PRIMARY KEY,
            user1_id INT REFERENCES users(user_id),
            user2_id INT REFERENCES users(user_id)
            );
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
            );
            `);
    })
    .then(() => {
      return db.query(`
            CREATE TABLE logs(
            log_id SERIAL PRIMARY KEY,
            game_id VARCHAR,
            player_id INT REFERENCES users(user_id),
            won_game BOOLEAN,
            points_gained INT,
            topic_name VARCHAR(50)
            );
            `);
    })
    .then(() => {
      const insertAvatarsQueryStr = format(
        "INSERT INTO avatars (avatar_name, avatar_url) VALUES %L;",
        avatars.map(({ avatar_name, avatar_url }) => [avatar_name, avatar_url])
      );

      const avatarPromise = db.query(insertAvatarsQueryStr);

      const insertColourThemesQueryStr = format(
        "INSERT INTO colour_themes (colour_theme_name) VALUES %L;",
        colourThemes.map(({ theme_name }) => [theme_name])
      );

      const colourThemesPromise = db.query(insertColourThemesQueryStr);

      return Promise.all([avatarPromise, colourThemesPromise]);
    })

    .then(() => {
      return Promise.all(
        users.map(({ password }) => {
          return bcrypt.hash(password, 10);
        })
      );
    })
    .then((passwords) => {
      const usersQueryStr = format(
        `INSERT INTO users (username, email, password, avatar_id, is_child, colour_theme_id, online) VALUES %L;`,
        users.map(
          (
            { username, email, avatar_id, isChild, colour_theme_id, online },
            index
          ) => {
            return [
              username,
              email,
              passwords[index],
              avatar_id,
              isChild,
              colour_theme_id,
              online,
            ];
          }
        )
      );

      return db.query(usersQueryStr);
    })
    .then(() => {
      const soundsQueryStr = format(
        `INSERT INTO sounds (sound_url, category) VALUES %L;`,
        sounds.map(({ sound_url, category }) => [sound_url, category])
      );
      return db.query(soundsQueryStr);
    })
    .then(() => {
      const friendshipQueryStr = format(
        `INSERT INTO friendship (user1_id, user2_id) VALUES %L;`,
        friendship.map(({ user1_id, user2_id }) => [user1_id, user2_id])
      );

      return db.query(friendshipQueryStr);
    })
    .then(() => {
      const notificationQueryStr = format(
        `INSERT INTO notifications (notification_text, seen, user_id, sender_id) VALUES %L;`,
        notifications.map(({ notification_text, seen, user_id, sender_id }) => [
          notification_text,
          seen,
          user_id,
          sender_id,
        ])
      );

      return db.query(notificationQueryStr);
    })
    .then(() => {
      const logQuerystr = format(
        `INSERT INTO logs (game_id, player_id, won_game, points_gained, topic_name) VALUES %L;`,
        logs.map(
          ({ game_id, player_id, won_game, points_gained, topic_name }) => [
            game_id,
            player_id,
            won_game,
            points_gained,
            topic_name,
          ]
        )
      );

      return db.query(logQuerystr);
    });
}
module.exports = seed;
