const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const { REQUIRED_AUTHORIZATION } = require('../utils/constant');

const auth = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть и начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError(REQUIRED_AUTHORIZATION);
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new AuthorizationError(REQUIRED_AUTHORIZATION);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = {
  auth,
};
