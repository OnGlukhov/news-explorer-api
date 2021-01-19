require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimit');
const routes = require('./routes/index');

const { centralizedErrorHandler } = require('./middlewares/centralizedErrorHandler');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({ origin: true }));
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandler);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Запущен порт ${PORT}`);
});
