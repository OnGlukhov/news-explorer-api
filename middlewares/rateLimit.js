const rateLimit = require('express-rate-limit');
const { REQUEST_LIMIT } = require('../utils/constant');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: REQUEST_LIMIT,
});

module.exports = {
  limiter,
};
