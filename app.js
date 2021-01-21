const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimit');
const routes = require('./routes/index');
const { ENV_PORT, MONGO_DB, MONGO_OPTIONS } = require('./utils/config');

const { centralizedErrorHandler } = require('./middlewares/centralizedErrorHandler');

// Слушаем 3000 порт
const app = express();
// подключаемся к серверу mongo
mongoose.connect(MONGO_DB, MONGO_OPTIONS);

app.use(cors({ origin: true }));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandler);
app.listen(ENV_PORT);
