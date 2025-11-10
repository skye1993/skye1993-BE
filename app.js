const express = require("express");
const app = express();
const db = require("./db/connection.js");
const { getTopics } = require("./controllers/topics.controllers.js");
const { welcome } = require("./controllers/welcome.js");
const { getArticles, getArticleById, patchArticleVotes} = require("./controllers/articles.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");
const {handlePsqlErrors, handleCustomErrors, handlrServerErrors} = require("./controllers/errors.controllers.js")
const { getCommentForArticleId, postComments, deleteCommentsById} = require("./controllers/comments.controller.js")



const cors = require('cors');
app.use(cors());

app.use(express.json());

app.use("/api", express.static('public'))

app.get("/api", welcome);


app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleVotes)

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", getCommentForArticleId)

app.post("/api/articles/:article_id/comments", postComments)

app.delete("/api/comments/:comment_id", deleteCommentsById)

app.use((req, res) => {
    res.status(404).send({ msg: "Path not Found"})
});

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handlrServerErrors)

module.exports = app;
