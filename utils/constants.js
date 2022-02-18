const {
  JWT_SECRET = 'secret',
  PORT = 3001,
  MONGO_URL = 'mongodb://localhost:27017/moviesdb',
} = process.env;

// const RegExpLink = /^https?:\/\/.+#?/;
// const RegExpLink = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

module.exports = {
  // RegExpLink,
  JWT_SECRET,
  PORT,
  MONGO_URL,
};
