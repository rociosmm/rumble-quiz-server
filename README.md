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
