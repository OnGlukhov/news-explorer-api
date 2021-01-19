/* eslint-disable linebreak-style */
const { SERVER_ERROR } = require('../utils/constant');

const centralizedErrorHandler = ((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? SERVER_ERROR : message });
  next();
});

module.exports = { centralizedErrorHandler };
