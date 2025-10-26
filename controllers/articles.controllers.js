const articles = require("../db/data/test-data/articles");
const { readArticles, articlesById } = require("../models/articles.models");

const getArticles = (req, res) => {
  const queries = req.query;
  return readArticles().then((articles) => {
    console.log(articles);
    res.status(200).send({ articles });
  });
};
const getArticleById = (req, res) => {
  const { article_id } = req.params;
  return articlesById(parseInt(article_id)).then(({ articles }) => {
    console.log({ article_id, articles });

    res.status(200).send({ articles });
  });
};

module.exports = {
  getArticles,
  getArticleById,
};
