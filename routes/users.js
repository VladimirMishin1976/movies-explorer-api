const router = require('express').Router();

const {
  updateUser, getCurrentUser, getUsers,
} = require('../controllers/users');
const { validateUserBodyUpdate } = require('../middlewares/validations');

router.get('/me', getCurrentUser);

router.patch('/me', validateUserBodyUpdate, updateUser);

router.get('/', getUsers);

module.exports = router;
