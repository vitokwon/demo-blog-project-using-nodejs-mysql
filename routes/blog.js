const express = require("express");

const router = express.Router();

// 외부파일 설정 가져오기, db
const db = require("../data/database");

router.get("/", function (req, res) {
  res.redirect("/posts");
});

// 데이터조회 시간이 걸리므로 'async-await' 사용
router.get("/posts", async function (req, res) {
  // 복잡한 쿼리문을 상수에 저장 후 사용
  const query = `
  SELECT posts.*,authors.name AS author_name FROM posts 
  INNER JOIN authors ON posts.author_id = authors.id
  `;
  // 배열비구조화, 배열의 첫번째 항목을 새 상수로 저장
  const [posts] = await db.query(query);
  res.render("posts-list", { posts: posts });
});

// pormise, 'async-await' 적용
router.get("/new-post", async function (req, res) {
  // const result = db.query("SELECT * FROM authors");

  // 배열 비구조화 적용
  const [authors] = await db.query("SELECT * FROM authors");
  res.render("create-post", { authors: authors });
});

router.post("/posts", async function (req, res) {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query(
    "INSERT INTO posts (title,summary,body,author_id) VALUES (?)",
    [data]
  );

  res.redirect("/posts");
});

router.get("/post-detail/:id", async function (req, res) {
  const query = `
  SELECT posts.*,authors.name AS author_name, authors.email AS author_email
  FROM posts
  INNER JOIN authors ON posts.author_id = authors.id
  WHERE posts.id = ?
  `;
  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }

  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanReadableDate: posts[0].date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  res.render("post-detail", { post: postData });
});

router.get("/posts/:id/edit", async function (req, res) {
  const query = `
  SELECT * FROM posts
  WHERE id = ?
  `;

  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }

  res.render("update-post", { post: posts[0] });
});

router.post("/posts/:id/edit", async function (req, res) {
  const query = `
  UPDATE posts SET title = ?, summary = ? , body = ?
  WHERE id = ?
  `;

  const [posts] = db.query(query, [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.params.id,
  ]);
});

router.post("/posts/:id/delete", async function (req, res) {
  db.query("DELETE FROM posts WHERE id = ?", [req.params.id]);

  res.redirect("/posts");
});

module.exports = router;
