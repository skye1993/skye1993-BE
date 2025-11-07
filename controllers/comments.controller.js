const {
  addCommentsToArticleId,
  readCommentsPost,
  commentByIdDelete,
} = require("../models/comments.models.js");

const getCommentForArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return addCommentsToArticleId(article_id).then((comments) => {
    res.status(200).send({ comments });
  });
};

const postComments = (req, res) => {
  const { article_id } = req.params;
  const { body, username } = req.body;
  readCommentsPost(article_id, username, body).then((comments) => {
    res.status(201).send({ comments });
  });
};

const deleteCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  
  return commentByIdDelete(comment_id).then(() => {
   
    res.sendStatus(204)
  });
};

module.exports = { getCommentForArticleId, postComments, deleteCommentsById };
