const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'secret' } = process.env;
const AuthorizationErr = require('../errors/authorization-err');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AuthorizationErr('Неверный email или пароль'));
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthorizationErr('Неверный email или пароль'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
