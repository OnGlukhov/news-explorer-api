const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const { ARTICLE_NOT_FOUND, OWNER_ERROR, ARTICLE_REMOVE } = require('../utils/constant');

// Получение всех карточек
const getArticle = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};
// Создание карточки
const createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.send({
      _id: article._id,
      keyword: article.keyword,
      title: article.title,
      text: article.text,
      date: article.date,
      source: article.source,
      link: article.link,
      image: article.image,
    }))
    .catch((err) => {
      if (err.name === 'BadRequestError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};
// Удаление карточки
const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError(ARTICLE_NOT_FOUND);
      } else if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError(OWNER_ERROR);
      } else {
        Article.findByIdAndDelete(req.params.articleId)
          .then(() => res.send({ message: ARTICLE_REMOVE }));
      }
    })
    .catch(next);
};

module.exports = {
  getArticle,
  createArticle,
  deleteArticle,
};
