const db = require("../db/connection");

function readArticles(sort_by ='created_at', order = 'desc', topic) {
  const sortColumns = ['created_at','title','author','votes','topic']
  const orderValues = ['asc', 'desc']

  if(!sortColumns.includes(sort_by)) {
    return Promise.reject(`Invalid columns: ${sort_by}`);
      }
      else if(!orderValues.includes(order)) {
    return Promise.reject(`Invalid columns: ${order}`);
      }
  const query = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
 `;

  // Append filters for sorting
  const orderBy = `ORDER BY ${sort_by} ${order}`;

  return db
    .query(`${query} ${orderBy}`)
    .then(({ rows }) => {
      let filteredArticles = rows

      // If topic is provided, filter the articles
      if (topic) {
      filteredArticles = filteredArticles.filter((article) => article.topic === topic);
        if (filteredArticles.length === 0) {
          return Promise.reject({ status: 404, msg:"Path not Found" });
        }
      }
    return filteredArticles;
    });
}
function articlesById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id =$1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Path not Found" });
      }
      return rows[0];
    });
}

function readPatchedArticle(article_id, votes) {
  return db
    .query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`,
      [votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = { readArticles, articlesById, readPatchedArticle };
