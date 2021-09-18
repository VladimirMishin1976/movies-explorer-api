const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const AuthorizationErr = require('../errors/authorization-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (string) => isEmail(string),
      message: 'Неправильный формат почты',
    },
  },

  password: {
    type: String,
    minlength: 8,
    required: true,
    // select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationErr('Неправильный Email или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationErr('Неправильный Email или пароль'));
          }
          return user;
        });
    });
};

// удаление пароля в ответе
function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}
userSchema.methods.toJSON = toJSON;

module.exports = mongoose.model('user', userSchema);
