const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const { USER_REGISTERED, USER_NOT_FOUND } = require('../utils/constant');

// Регистрация
const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(USER_REGISTERED);
      }
      bcrypt
        .hash(password, 10)
        .then((hash) => User.create({
          email,
          password: hash,
          name,
        }))
        // eslint-disable-next-line no-shadow
        .then((user) => res.send({ message: `Зарегистрирован пользователь ${user.email}` }));
    })
    .catch(next);
};

// Login
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch(next);
};
// Возвращает пользователя по Id
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  login,
};
