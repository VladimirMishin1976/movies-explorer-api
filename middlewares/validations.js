const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().message('email должен быть валидным'),
    password: Joi.string().required().min(8).message('Поле "password" должно быть заполнено'),
  }).unknown(true),
});

const validateUserBodyRegistration = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email().message('Поле email должен быть валидным'),
    password: Joi.string().required().min(8).message('Поле "password" не валидно'),
  }),
});

const validateUserBodyUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email().message('Поле email должен быть валидным'),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "image" должно быть валидным url-адресом');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "trailer" должно быть валидным url-адресом');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "thumbnail" должно быть валидным url-адресом');
    }),
    movieId: Joi.number().required(),
  }),
});

module.exports = {
  validateAuthentication,
  validateUserBodyRegistration,
  validateUserBodyUpdate,
  validateId,
  validateCardBody,
};
