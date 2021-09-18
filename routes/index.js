const router = require('express').Router();

const userRoutes = require('./users');
const movieRoutes = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { login, createUser, logout } = require('../controllers/users');
const { validateAuthentication, validateUserBodyRegistration } = require('../middlewares/validations');

router.post('/signin', validateAuthentication, login);

router.post('/signout', logout);

router.post('/signup', validateUserBodyRegistration, createUser);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use('/', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

module.exports = router;
