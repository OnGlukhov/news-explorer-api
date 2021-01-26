require('dotenv').config();

const {
  PORT, NODE_ENV, JWT_SECRET, MONGO_URL,
} = process.env;

const JWT_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
const ENV_PORT = PORT || 3000;
const MONGO_DB = MONGO_URL || 'mongodb://localhost:27017/mestodb';
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

module.exports = {
  ENV_PORT,
  JWT_KEY,
  MONGO_DB,
  MONGO_OPTIONS,
};
