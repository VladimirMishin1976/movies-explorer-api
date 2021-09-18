const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const AccessError = require('../errors/access-error');
const ServerError = require('../errors/server-err');

module.exports = {
  getMovies(req, res, next) {
    Movie.find({})
      .then((movies) => res.status(200).send(movies))
      .catch(next);
  },

  createMovie(req, res, next) {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    })
      .then((movie) => res.status(201).send(movie))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          return next(new ValidationError(error.message));
        }
        return next(new ServerError('На сервере произошла ошибка'));
      });
  },

  deleteMovie(req, res, next) {
    Movie.findById(req.params.movieId)
      .then((movie) => {
        if (!movie) {
          return next(new NotFoundError('Видео не найдено'));
        }
        if (String(movie.owner) !== req.user._id) {
          return next(new AccessError('Попытка удалить чужое видео'));
        }

        return Movie.findByIdAndRemove(req.params.movieId)
          .then(() => res.status(200).send(movie))
          .catch(next);
      });
  },
};
