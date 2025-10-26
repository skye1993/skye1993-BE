const express = require("express");
const app = express();
const db = require("./db/connection.js");
const { getTopics } = require("./controllers/topics.controllers.js");
const { welcome } = require("./controllers/welcome.js");
const { getArticles, getArticleById} = require("./controllers/articles.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");
const {handlePsqlErrors, handleCustomErrors, handlrServerErrors} = require("./controllers/errors.controllers.js")


app.use(express.json());

app.get("/api", welcome);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", )

app.use((req, res) => {
    res.status(404).send({ msg: "Path not Found"})
});

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handlrServerErrors)

module.exports = app;
