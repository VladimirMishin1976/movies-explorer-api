const {
  JWT_SECRET = 'secret',
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
  NODE_ENV,
} = process.env;

// const RegExpLink = /^https?:\/\/.+#?/;
// const RegExpLink = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

module.exports = {
  // RegExpLink,
  JWT_SECRET,
  PORT,
  MONGO_URL,
  NODE_ENV,
};
