<img src="https://github.com/nkytruong/rumble-quiz-app/blob/main/assets/Designer.jpeg?raw=true" alt="Rumble Quiz Logo" width="200"/>

Rumble Quiz is a multiplayer mobile trivia game. It was built by Alex Taylor, Nikki Truong, Rocio Sainz-Maza and Jo Watson as the final project of the Northcoders Software Development bootcamp.

The back-end of the project was built with **express** and **node-postgres** for the storage of user data and **socket-io** for managing web-socket data sharing. The full list of dependencies can be found in `package.json`.
The api is hosted at: [https://rumble-quiz-server-1m0p.onrender.com/api](https://rumble-quiz-server-1m0p.onrender.com)

The front-end can be found [here](https://github.com/JoWatson2011/rumble-quiz-app)!

## Configuration

To run the server locally:

1. Clone the repo

```
git clone https://github.com/JoWatson2011/rumble-quiz-sever.git
```

2. Install dependencies.

```
npm i
```

3. Set up .env files for environment variables.

   There are two .env files required: .env.test and .env .development. These
   should go in root directory

```
echo "PGDATABASE=rumble_quiz_test" > .env.test
echo "PGDATABASE=rumble_quiz" > .env.development
```

4. Setup and seed local databases

```
npm run setup-dbs
npm run seed
```

5. Run tests Test files are found in `__tests__/`

```
npm test users.test
npm test avatars.test
npm test sound.test
```
