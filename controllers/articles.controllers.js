const {
  readArticles,
  articlesById,
  readPatchedArticle,
} = require("../models/articles.models");

const getArticles = (req, res) => {
  const { sort_by, order, topic } = req.query;
  return readArticles(sort_by, order, topic).then((articles) => {
    res.status(200).send({ articles });
  });
};
const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return articlesById(parseInt(article_id)).then((article) => {
     console.log({article})
    res.status(200).send({ article });
  });
};
const patchArticleVotes = (req, res) => {
 
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return readPatchedArticle(article_id, inc_votes).then((article) => {
    res.status(201).send({ article });
  });
};
module.exports = {
  getArticles,
  getArticleById,
  patchArticleVotes,
};
