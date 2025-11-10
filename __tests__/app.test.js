const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const articles = require("../db/data/test-data/articles");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  db.end();
}); //topics,articles,comments,users

describe("GET: /api/topics", () => {
  test("200: Resond with the topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { description, slug, img_url } = body.topics[0];
        expect(typeof description).toBe("string");
        expect(typeof slug).toBe("string");
        expect(typeof img_url).toBe("string");
      });
  });
});
describe("GET: /api/articles", () => {
  test("200:responds with array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  test("200:responds with array of article objects in decending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200: Should recieve articles sorted by title in asending order", () => {
    return request(app)
      .get("/api/articles/?sort_by = title && order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSorted({ coerce: true });
      });
  });
  test("200: Should recieve articles sorted by votes in decending orde by default", () => {
    return request(app)
      .get("/api/articles/?sort_by = votes && order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSorted({ descending: true });
      });
  });
  test("400:should return 400 for invalid sort_by", () => {
    return request(app)
      .get("/api/articles/doesnt-excist")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("You've made a Bad Request");
      });
  });
  test("400:should return 400 for invalid order", () => {
    return request(app)
      .get("/api/articles/doesnt-exist")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("You've made a Bad Request");
      });
  });
});
describe("GET /api/articles (topic query)", () => {
  test("200:should return all articles when no topic is provided", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13); // Assuming 3 articles in sample data
      });
  });

  test("200:should return articles of a specific topic when a valid topic is provided", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { title } = body.articles[0];
        expect(title).toBe('Eight pug gifs that remind me of mitch');
      });
  });
  test("404: Should return a 404 error when no articles match the specified topic' ", () => {
    return request(app)
      .get("/api/articles/?topic=not-a-topic")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Path not Found");
      });
  });
});
describe("GET: /api/users", () => {
  test("200:responds with array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
describe("GET: /api/articles/:article_id", () => {
  test("200: Responds with the articles object with the requested article_id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article.article_id).toBe(3);
        expect(article.author).toBe("icellusedkars");
        expect(article.title).toBe("Eight pug gifs that remind me of mitch");
        expect(article.topic).toBe("mitch");
        expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(article.body).toBe("some gifs");
        expect(article.votes).toBe(0);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("400: Responds with an error message when a request is made for an invalid article", () => {
    return request(app)
      .get("/api/articles/not-article")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("You've made a Bad Request");
      });
  });
  test("404: Responds with an error message when a request is made for a article_id that is valid but not present in our database", () => {
    return request(app)
      .get("/api/articles/7777")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Path not Found");
      });
  });
});
describe("ALL: *", () => {
  test("404: Responds with an error message when a request is made for a article_id that is valid but not present in our database", () => {
    return request(app)
      .get("/not-an-endpoint")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("Path not Found");
      });
  });
});
describe("GET:/api/articles/:article_id/comments", () => {
  test("200: Responds with the comment object with the request get all comments for an article ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBeGreaterThan(0);
      });
  });
  test("400: Responds with an error message when a request is made for an invalid article", () => {
    return request(app)
      .get("/api/articles/not-coment")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("You've made a Bad Request");
      });
  });
  test("404: Responds with an error message when a request is made for a article_id that is valid but not present in our database", () => {
    return request(app)
      .get("/api/articles/7777")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("Path not Found");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the newly created comment", () => {
    const testComments = {
      username: "butter_bridge",
      body: "This is a new body 2",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testComments)
      .expect(201)
      .then(({ body }) => {
        const { article_id, author, body: commentBody } = body.comments;
        expect(typeof article_id).toBe("number");
        expect(typeof author).toBe("string");
        expect(typeof commentBody).toBe("string");
        expect(author).toBe(testComments.username);
        expect(commentBody).toBe(testComments.body);
      });
  });
  test("404: Responds with an error message when a request is made for a post comments that is valid but not present in our database", () => {
    return request(app)
      .post("/api/articles/7777/no-comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Path not Found");
      });
  });
});
describe("PATCH: /api/articles/:article_id", () => {
  test("201: Responds with the newly created vote in articles", () => {
    const newVotesTest = {
      inc_votes: 12,
    };

    return request(app)
      .patch("/api/articles/4")
      .send(newVotesTest)
      .expect(201)
      .then(({ body }) => {
        const { article_id, votes } = body.article;

        expect(typeof article_id).toBe("number");
        expect(typeof votes).toBe("number");
        expect(votes).toBe(12);
        expect(votes + 2).toBe(14);
        expect(votes - 15).toBe(-3);
      });
  });
  test("400: Responds with an error message when a request is made for an invalid article", () => {
    return request(app)
      .get("/api/articles/not-coment")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("You've made a Bad Request");
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  test.only("deletes a comment and return a 204", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("400: Responds with an error message when a request is made for an invalid comment_id", () => {
    return request(app)
      .get("/api/comments/not-comment")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("You've made a Bad Request");
      });
  });
  test("404: Responds with an error message when a request is made for a comment that is valid but not present in our database", () => {
    return request(app)
      .post("/api/comments/7777")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Path not Found");
      });
  });
});
