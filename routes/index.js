const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const users = require('./users');
const articles = require('./articles');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');
const { NOT_FOND_ERROR } = require('../utils/constant');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use(auth);
router.use('/users', users);
router.use('/articles', articles);
router.use((req, res, next) => {
  next(new NotFoundError(NOT_FOND_ERROR));
});

module.exports = router;
