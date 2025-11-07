const db = require("../db/connection");

function addCommentsToArticleId(article_id) {
  return db
    .query(
      `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at ASC `,
      [article_id]
    )

    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Path not Found" });
      }
      return rows;
    });
}

function readCommentsPost(article_id, author, body) {
  return db
    .query(
      `INSERT INTO comments (author, article_id, body) VALUES ($1,$2,$3) RETURNING *`,
      [author, article_id, body]
    )
    .then(({ rows }) => {
     if (rows.length === undefined) {
        return Promise.reject({ status: 404, msg: "Path not Found" });
      }
      return rows[0];
   
    });
}

function commentByIdDelete(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1; `, [comment_id])
    .then(({ rows }) => {
     
      if (rows === 0) {
       return Promise.reject({ status: 404, msg: "Path not Found" });
      }
      
      return rows;

    });
  };

module.exports = { addCommentsToArticleId, readCommentsPost, commentByIdDelete };
