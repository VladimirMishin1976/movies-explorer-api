const router = require('express').Router();

const {
  updateUser, getCurrentUser, getUsers,
} = require('../controllers/users');
const { validateAuthentication } = require('../middlewares/validations');

router.get('/me', getCurrentUser);

router.patch('/me', validateAuthentication, updateUser);

router.get('/', getUsers);

module.exports = router;
