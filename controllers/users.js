const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthorizationErr = require('../errors/authorization-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const RegistrationError = require('../errors/registration-err');
const ServerError = require('../errors/server-err');
const { JWT_SECRET } = require('../utils/constants');

module.exports = {
  login(req, res, next) {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          { expiresIn: '7d' },
        );
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        }).status(200).send({ user: user.toJSON() });
      })
      .catch((err) => {
        if (err.statusCode === 401) {
          return next(new AuthorizationErr('Неправильный Email или пароль'));
        }
        return next(new ServerError('На сервере произошла ошибка'));
      });
  },

  logout(req, res, next) {
    const { email } = req.body;
    User.findOne({ email })
      .then((user) => res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: true,
      }).status(200).send(user))
      .catch(next);
  },

  createUser(req, res, next) {
    const {
      name, email, password,
    } = req.body;

    User.findOne({ email })
      .then((userData) => {
        if (userData) {
          return next(new RegistrationError('Пользователь уже существует'));
        }
        return bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            email,
            password: hash,
          }))
          .then((user) => res.status(201).send({ data: user.toJSON() }))
          .catch((error) => {
            if (error.name === 'ValidationError') {
              return next(new ValidationError('Переданы некорректные данные'));
            }
            if (error.name === 'MongoError' && error.code === 11000) {
              return next(new AuthorizationErr('Этот Email уже был зарегестрирован'));
            }
            return next(new ServerError('На сервере произошла ошибка'));
          });
      }).catch(next);
  },

  getCurrentUser(req, res, next) {
    User.findOne({ _id: req.user._id })
      .then((user) => {
        if (!user) {
          return next(new NotFoundError(`Пользователь с id=${req.params._id} не найден`));
        }
        return res.status(200).send(user);
      });
  },

  updateUser(req, res, next) {
    const { email, name } = req.body;
    User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      },
    )
      .then((user) => res.status(200).send(user))
      .catch((error) => {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
          return next(new ValidationError('Ошибка авторизации'));
        }
        if (error.code === 11000) {
          return next(new RegistrationError('Этот Email уже зарегестрирован'));
        }
        return next(new ServerError('На сервере произошла ошибка'));
      });
  },

  getUsers(req, res, next) {
    User.find({})
      .then((users) => res.send(users))
      .catch(next);
  },
};
