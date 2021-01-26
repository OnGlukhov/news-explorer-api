const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const { USER_REGISTERED, USER_NOT_FOUND, USER_IS_REGISTERED } = require('../utils/constant');
const { JWT_KEY } = require('../utils/config');

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
        .then((data) => {
          res.send({ message: `${USER_IS_REGISTERED} ${data.email}` });
        })
        .catch(next);
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
          JWT_KEY,
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
