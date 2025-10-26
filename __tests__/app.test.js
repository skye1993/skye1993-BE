const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  db.end();
}); //topics,articles,comments,users

describe("GET: /api/topics", () => {
  test.only("200: Resond with the topics objects", () => {
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
        //console.log(articles)
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET: /api/users", () => {
  test.only("200:responds with array of users objects", () => {
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
  test.only("200: Responds with the articles object with the requested article_id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(( { body }) => {
        console.log(body);
        const { articles } = body
        

        expect(articles.article_id).toBe(3);
        expect(articles.author).toBe("icellusedkars");
        expect(articles.title).toBe("Eight pug gifs that remind me of mitc");
        expect(articles.topic).toBe("mitch");
        expect(articles.created_at).toBe("1604394720000");
        expect(articles.votes).toBe(0);
        expect(articles.article_img_url).toBe( "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        expect(articles.body).toBe("some gifs");
      });
  });

  test.only("400: Responds with an error message when a request is made for an invalid article", () => {
    return request(app)
      .get("/api/articles/not-article")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        //console.log("check this", response);

        expect(msg).toBe("You've made a Bad Request");
      });
  });
  test.only("404: Responds with an error message when a request is made for a article_id that is valid but not present in our database", () => {
    return request(app)
      .get("/api/articles/7777")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        //console.log("check this", response);

        expect(msg).toBe("Path not Found");
      });
  });
});
describe("ALL: *", () => {
  test.only("404: Responds with an error message when a request is made for a article_id that is valid but not present in our database", () => {
    return request(app)
      .get("/not-an-endpoint")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("Path not Found");
      });
  });
});
// describe("GET:/api/articles/:article_id/comments", () => {
// test("200: Responds with the comment object with the request get all comments for an article ", () => {
//     return request(app)
//       .get("/api/articles/3/")
//       .expect(200)
//       .then(({ body }) => {
//         const {
//           comment_id,
//           votes,
//           created_at,
//           author,
//           body,
//           article_id
//         } = area.comments;
//         //console.log("check this", area);

//         expect(article_id).toBe(3);
        
//       });
//   });
// })

