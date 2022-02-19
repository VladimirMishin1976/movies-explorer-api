const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const RegistrationError = require('../errors/registration-err');
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
        }).send({ user: user.toJSON() });
      })
      .catch(next);
  },

  logout(req, res, next) {
    const { email } = req.body;
    User.findOne({ email })
      .then((user) => res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: true,
      }).send(user))
      .catch(next);
  },

  createUser(req, res, next) {
    const {
      name, email, password,
    } = req.body;

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
        if (error.code === 11000) {
          return next(new RegistrationError('Этот Email уже зарегестрирован'));
        }
        return next();
      });
  },

  getCurrentUser(req, res, next) {
    User.findOne({ _id: req.user._id })
      .then((user) => {
        if (!user) {
          return next(new NotFoundError('Пользователь с не найден'));
        }
        return res.send(user);
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
      .then((user) => res.send(user))
      .catch((error) => {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
          return next(new ValidationError('Ошибка авторизации'));
        }
        if (error.code === 11000) {
          return next(new RegistrationError('Этот Email уже зарегестрирован'));
        }
        return next();
      });
  },

  getUsers(req, res, next) {
    User.find({})
      .then((users) => res.send(users))
      .catch(next);
  },
};
