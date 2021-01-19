const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');
const {
  getArticle,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

const validURL = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.message('Некорректная ссылка');
};

router.get('/', getArticle);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validURL),
    image: Joi.string().required().custom(validURL),
  }),
}), createArticle);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().length(24).hex(),
  }),
}), deleteArticle);

module.exports = router;
