const router = require('express').Router();

const { getMovies, deleteMovie, createMovie } = require('../controllers/movies');

const { validateId, validateCardBody } = require('../middlewares/validations');

router.get('/', getMovies);

router.delete('/:movieId', validateId, deleteMovie);

router.post('/', validateCardBody, createMovie);

module.exports = router;
