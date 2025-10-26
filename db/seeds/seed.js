const db = require("../connection");
const { format } = require("node-pg-format");
const createLookObj = require("../seeds/utils-seed");
const { convertTimestampToDate } = require("./utils.js");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics(
    slug VARCHAR(30) PRIMARY KEY,
    description VARCHAR(100),
    img_url VARCHAR(1000)
  );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
   username VARCHAR(30) PRIMARY KEY,
   name VARCHAR(30),
   avatar_url VARCHAR(1000)
);`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
   article_id SERIAL primary key,
   title VARCHAR(100) NOT NULL,
   topic VARCHAR(100) REFERENCES topics(slug),
   author VARCHAR(100) REFERENCES users(username),
   body TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   votes INTEGER DEFAULT 0,
   article_img_url VARCHAR(1000)
);`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
   comment_id SERIAL primary key,
   article_id INT REFERENCES articles(article_id),
   body TEXT,
   votes INTEGER DEFAULT 0,
   author VARCHAR(100) REFERENCES users(username),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );`);
    })
    .then(() => {
      const formattedTopicData = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });
      const sqlString = format(
        `INSERT INTO topics(slug,description,img_url) VALUES %L RETURNING *`,
        formattedTopicData
      );
      return db.query(sqlString);
    })
    .then(() => {
      const formattedUserData = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const sqlString = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L RETURNING *`,
        formattedUserData
      );
      return db.query(sqlString);
    })
    .then(() => {
      const formattedArticleData = articleData.map((article) => {
        article = convertTimestampToDate(article);
        return [
          article.title,
          article.topic,
          article.body,
          article.author,
          article.created_at,
          article.votes,
          article.article_img_url,
        ];
      });

      const sqlString = format(
        `INSERT INTO articles( title, topic, body, author, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticleData
      );
      return db.query(sqlString);
    })
    .then(({ rows }) => {
      const articlesLookup = createLookObj(rows, "title", "article_id");

      const formattedCommentData = commentData.map((comment) => {
        comment = convertTimestampToDate(comment);
        return [
          articlesLookup[comment.article_title],
          comment.body,
          comment.votes,
          comment.author,
          comment.created_at,
        ];
      });

      const sqlString = format(
        `INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L`,
        formattedCommentData
      );
      return db.query(sqlString);
    });
};

module.exports = seed;
