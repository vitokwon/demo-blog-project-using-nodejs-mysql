# 섹션 24 웹사이트에서 MySQL 사용하기 (간단한 블로그 제작)

1. Module content

   1. How to connect to databases in code
   2. Performing CRUD operations in coode
   3. Outputting database data

2. 왜 백엔드에서 데이터베이스가 실행될까?

   - NOT connect to a database from inside frontend JavaScript code
   - 웹사이트 방문자에게 노출될 뿐만 아니라, 편집도 가능함.
   - database credentioals could be looked up, queries could be edited.

3. 구축할 내용

   - 기본적인 블로그
   - 인증과 권한없이 모든 방문자의 CRUD 작동

4. 진행

   1. Plan & design our database & tables
   2. Create database & tables
   3. Add initial data to database tables (via MySQL Workbench)
   4. Connect to database & interact via NodeJS / Express app

5. 데이터베이스 구조 계획 for blog

   - posts (id INT , title VARCHAR, summary VARCHAR, body TEXT, date DATETIME, authorsid INT)
   - authors (id INT, name VARCHAR, email VARCHAR)

6. 데이터베이스 초기화
   - 데이타 베이스 생성 : '스키마 탭' - 'new schema' - name 'blog'
   - 테이블 생성 : 'new table'

```sql
'authors'
id INT, PK, NN, AI
name VARCHAR(255), NN
email VARCHAR(255), NN

'posts'
id INT PK, NN, AI
title VARCHAR(255), NN
summary VARCHAR(255), NN
body TEXT, NN
date DATETIME, CURRENT_TIMESTAMP
author_id INT, NN

 - 데이터 삽입 : data insert
INSERT INTO blog.authors (name, email)
VALUES ('Maximilian Scharmuller', 'max@test.com');
INSERT INTO blog.authors (name, email)
VALUES ('Manuel Lorenz', 'manuel@test.com');
```

7. 프로젝트 설정

   1. 프로젝트 다운로드 - 오픈 폴더 - '터미널' - npm instal - package.json - ejs, express, nodemon
   2. app.js - path,express, routes, app, view engine, urlencoded, static, error-handling
   3. public - css files - color, fonts, margin, form, white-space: pre-wrap
   4. views - errorpages, list, detail(only frame), update
   5. include - head, header, post-item

8. 라우트 정의 (데이터베이스 연결) inside NodeJS, express

   - express.Router() 섹션 일부 20 복습
   - 라우트 구성 분할 기능함.
   - routes 폴더와 default.js, restaurants.js 생성

````JavaScript
// defualt.js
const express = requrie('express');
const router = express.Router();

app.get('/', function (req, res) {
 res.render('index');
});

app.get('/about', function (req, res) {
res.render('about');
});
// ---------------------app을 router로 변경
router.get('/', function (req, res) {
 res.render('index');
});

router.get('/about', function (req, res) {
res.render('about');
});

// router는 객체이고, 구성을 추가해서 router를 내보냄.
module.exports = router;

```JavaScript
//app.js
const defaultRoutes = require('./routes/default');

app.use('/', defaultRoutes);
// 'app.user'에서의 매개변수는 '/'로 시작하는 모든 수신 요청은 defaultRoutes에서 처리하도록 함.
// 'app.get','app.post'의 매개변수는 정확히 일치하는 수신 요청에 대해 작동함.
````

9. 데이터베이스 첫번째 경로 설정

```JavaScript
// 'blog.js'
const express = require('express');
const router = express.Router();
moudle.exports = router;
```

```JavaScript
const blogRoutes = require('./routes/blog');
app.user(blogRoutes); // 경로 매개변수 미설정으로 모든 수신되는 요청에 적용됨.

// first router생성
// 'blog.js'
const express = require('express');

const router = express.Router();

route.get('/', function(req,res) {
 res.redirect('/posts');
});

route.get('/posts', function(req,res) {
 res.render('posts-list'); // 'posts-list.ejs파일 rendering 	'
});

router.get('/new-posts', function(req,res) {
 res.render('create-post');
});

module.exports = router;
```

```JavaScript
// express.Router() 재연습
const express = require('express')
const router = express.Router();

router.get('/', function (req, res) {
 res.render('/posts');
});

router.get('/posts', function(req, res) {
 res.render('posts-list');
});

router.get('/new-post', fuction (req, res) {
 res. render('create-post');
});

module.exports = router;
```

10. 데이터베이스 연결은 타사패키지 사용함 (세부사항 설정 생략하기 위해)

    - data - database.js 생성.

'node mysql2' 구글 검색 내용 확인.
'npm install --save mysql2' 복사, cmd창에서 실행.

```JavaScript
const mysql = require('mysql2');

// mysql 객체에서 메소드 호출 (createConnection || createPool)
// Pool은 많은 동시 요청이 있을 경우 사용

// 매개변수값으로 자바스크립트 객체 필요
const pool = mysql.createPool({
 host: 'localhost' // 'port'는 자동 구성.
 database: 'blog',
 user: 'root',
 password: '111111'
});

module.exports = pool;
```

    - 이제 'routes'에서 'database' 사용 가능.

```JavaScript
 const db = require('../data/database');
```

11. 복습, '동적콘텐츠(ejs 템플릿 엔진 추가)',

    - 파일 확장자가 언제부터, 왜 빠졌었는지 헷갈림.

```JavaScript
// npm install ejs
// 구글에서 ejs 오피셜 페이지와 npm ejs에서도 내용 확인 가능.
// 'package.json - "ejs": "^3.1.6",' 자동 추가

// app.js

// '템플릿 엔진'을 설정하기 전, '뷰' 설정 필요
// '템플릿 엔진'으로 '템플릿 파일'을 찾을 위치 설정
app.set('views', path.join(__dirname, 'views')); // 'view' 옵션의 'path.join' 설정
// 뷰엔진옵션 - 뷰파일을 html로 다시 보내기 전에 뷰 파일을 처리하기 위한 템플릿 엔진
app.set('view engine', 'ejs'); // 'view engine'옵션을 'ejs'로 설정

// STEP1
// '.html' 확장자를 '.ejs' 확장자로 변경
// EJS와 같은 템플릿 엔진의 이면에 있는 아이디어는 HTML 코드를 생성하므로 HTML 코드 입력 가능.

// STEP2
// 라우트 변경
app.get('/', function (req,res)  {
 const htmlFilePath = path.join(__dirname, 'views', 'index.html);
 res.sendFile(htmlFilePath);
});
//--------------------아래 코드 'res.render()'로 대체 가능
// 전달하는 템플릿을 랜더링하는 메서드.
// 템플릿 엔진을 사용해서 파일을 만들고 HTML로 변환하면 브라우저로 다시 전송 됨.
// 템플릿 엔진과 뷰를 등록했기문에
// 'render();' 메서드는 뷰 폴더에서 찾을 수 있는 'ejs'를 템플릿 파일로 사용함을 인식
//
app.get('/', function (req,res)  {
 res.render('index'); // ejs를 뷰 엔진으로 사용하기때문에 파일확장자 생략
});

// 'ejs'를 사용하므로써 모든 라우터에 경로 구성을 할 필요가 없어짐.
```

12. 동적콘텐츠, EJS 구문. '<% %>'
    - 서버에서 구문분석되고 렌더링되서, 브라우저에는 최종 HTML코드만 전송.

```ejs
// restaurants.ejs
<p>We found <%= numberOf Restaurants %> restaurants.</p>
```

```javascript
// app.js (하드코팅)
// 라우트에서 값을 같이 보냄.
app.get("/restaurants", function (res, req) {
  res.render("restaurants", { numberOfRestaurants: 2 });
});

// app.js (동적)
// 라우트에서 값을 같이 보냄.
app.get("/restaurants", function (res, req) {
  const filePath = path.join(__dirname, "data", "restaurants.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedREstaurants,
  });
});
```

13. EJS 반복 콘텐츠 출력

```html
<ul id="restaurant-list">
 <% for (const restaurant of restuarants) {%> // 반복문 시작
 <li calss="restaurant-item">
 <article>
  <h2><%= restaurant.name %></h2>
  <div class="restaurant-meta">
   <p><%= restaurant.cuisine></p>
   <p><%= restaurant.address></p>
  </div>
  <p>
   <%= restaurant.description %>
  </p>
  <div class="restaurant-action">
   <a href="<%= restaurant.website %>View Website</a>
  </div>
 </article>
 /<li>
 <% } %> // 반복문 닫는 괄호
</ul>
```

14. 데이터베이스 쿼리 실행

```JavaScript
 router.get('/new-post', function(req,res) {
  db.query('SELECT * FROM authors');
  res.render('create-post');
});
```

    - 쿼리 실행, 쿼리 전송과 실행, 값 반환 시 생기는 딜레이
    - 비동기 promise 설정, mysql2 지원
    우리가 실행하는 모든 쿼리 메소드가 우리에게 프로미스 산출하는지 확인

```JavaScript
 // database.js
 const mysql = require('mysql2/promise');
```

- db.query(); 는 이제 'promise'를 반환
  '.then','.catch', 'async-await' 사용 가능.
  'async-await'사용으로 promise가 해결될 때까지 자동수신 후 다음 코드 실행

```JavaScript
router.get('/new-post', async function(req,res) {
  // 쿼리 실행 시, 반환 값은 항상 '배열'
  // 첫번째 배열은 모든 레코드 포함, 두번째 배열은 일부 메타데이터
  // 배열 비구조화, 첫번째 요소를 꺼내오고 이름 지정
  // 비구조화 : 배열의 첫번째 항목을 꺼내오고 새 상수로 저장.
  //const result = await db.query('SELECT * FROM authors');
  const [authors] = await db.query('SELECT * FROM authors');
  res.render('create-post', {authors: authors});
});
```

15. 전달된 인수를 'create-post.ejs'에서 사용

    - 'select-option' 드롭다운

```html
//create-post.ejs
<div class="form-control">
<label for="author">Select Author</label>
<select id="author" name="author">
  <% for (const author of authors) { %>
   <option value="<%= author.id  %><%= author.name %></option>
  <% } %>
</select>
</div>
```

16. 플레이스홀더가 있는 데이터 삽입 (동적 데이터 삽입)

```HTML
<form action='/posts' method="POST">
 ...
</form>
```

```JavaScript
// routes - blog.js
router.post('/posts', function (req, res) {
 // 쿼리 밸류로 삽입될 data 배열 생성, 순서 중요.
 // mysql에서 자동으로 개별값으로 분리해서 사용
 const data = [
  req.body.title,
  req.body.summary,
  req.body.content,
  req.body.author
 ]

 db.query('INSERT INTO posts (title, summary, body, author_id) VALUES (?)', [data]);
 // app.js에서 app.use(express.urlencoded({extended : true})); 미들웨어 설정해둬서
 // 수신되는 req.body; 의 구문 분석을 함. req.body;
 // '?' 플레이스홀더를 사용하여 동적값 주입도 가능.

 // 개별값 추가로도 사용가능.
 // db.query('INSERT INTO posts (title, summary, body, author_id) VALUES (?,?,?,?)',
 // [data[0], data[1], data[2], data[3]]);
```

    - 'async-await' 적용

```JavScript
router.post('/posts', async function (req, res) {
 const data = [
  req.body.title,
  req.body.summary,
  req.body.content,
  req.body.author
 ]

 // 다음 줄에서 이 작업이 끝날 떄 까지 기다림.
 await db.query('INSERT INTO posts (title, summary, body, author_id) VALUES (?)', [data]);

 res.redirect('/posts');
```

17. 블로그 게시물 리스트 가져오기 & 표시

```JavaSscript
route.get('/posts', async function (req, res) {
 const query = `
 SELECT posts.*, authors.name AS author_name FROM posts
 INNER JOIN authors ON posts.author_id = authors.id
 `;
 const [posts] = await db.query(query); // 두가지 배열 반환값 중 첫번째 결과값을 posts로 저장
 res.render('posts-list', { posts: posts});
});
```

    - 'posts-list.ejs'

```HTML
<h1>All Posts</h1>
 <% if (!posts || posts.length === 0) { %> 정의되지 않았거나 거짓, 배열이 비어있을 경우.
  <p>No posts found - maybe start creating some?</p>
  <a class="btn" href="/new-post">Create a new post</a>
 <% } else { %>
  <ol id="posts-list">
   <% for (const post of posts) { %>
    <li>
     <%- include('include/post-item', {post: post }) %>
    </li>
   <% }>
  </ol>
 <% } %>
```

    - 'post-item.ejs'

```HTML
<article class="post-item">
  <h2><%= post.title %></h2>
  <p class="post-item-author">By <%= post.author_name %></p>
  <p><%= post.summary %> </p>
  <div class="post-actions">
    <button class="btn btn-alt">Delete Post</button>
    <a href="...">Edit Post</a>
    <a class="btn" href="...">View Post</a>
  </div>
</article>
```

18. '웹에서 추가 포스팅'

    - Title: MySQL + Node.js is amazing!
    - Summary: A truly awesome combination of technologies!
    - Post Content:
    - You can easily send SQL commands and queries to your MySQL database when working with Node + MySQL.
    - It's easy and allows you to build real websites!

    - '단일 블로그 게시물 가져오기 & 표시' (detail)

```HTML
<!-- post-item.ejs 링크 추가, 다이내믹, 동적URL -->
<!-- 링크에 EJS를 사용해서 동적값 삽입 -->
<a class="btn" href="/posts/<%= post.id %>">View Post</a>
```

```JavaScript
//blog.js, 새로운 라우터, 식별자
//비동기작업, 'async-await' 적용
router.get('/posts/:id', async function (req,res) {
 // 동적 쿼리 생성
 const query = `
  SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts
  INNER JOIN authors ON posts.author_id = authors.id
  WHERE posts.id = ?
 `
 const [posts] = await db.query(query, [req.params.id]);

 // 사용자가 수동으로 없는 포스트값 입력한 경우, 에러핸들링
 if (!post || posts.length === 0) {
  return res.status(404),render('404');
  //'return'을 사용, 여기에서 코드를 완료시켜서 이후 코드 작동 안하도록 함.
 }
 res.render('post-detail', {post: posts[0] });
});
```

````html
<!-- 전달된 인수 출력 -->
<head>
  <%-include('includes/head', { title: post.title}) %>
</head>
<body>
  <h1>post.title</h1>
  <section id="post-meta">
    <!-- 어드래스 태그 사용, 이메일도 포함-->
    <!-- mailto: 해당 작성자의 이메일이 포함된 메일 클라이언트 자동 실행 -->
    <address>
      <a href="mailto:<%= post.author_email %>"><%= post.author_name %></a>
    </address>
    <!-- 이 블로그 게시물의 날짜 출력 -->
    <time datetime="<%= post.date%>"><%= post.date%></time>
  </section>
  <section>
    <p id="body"><%= post.body %></p>
  </section>

  19) '데이터 정렬, 쿼리 매개변수' 복습 - 쿼리 매개변수는 선택사항 - url 경로에
  추가 정보를 추가하여 사용 - '/restaurants?order=asc' - order이라는 변수에
  asc라는 값이 추가됨 ```html ejs
  <!-- 쿼리 매개변수 설정 restaurants.ejs -->
  <!-- form안에 input hidden으로 URL에 값 전송 -->
  <!-- /restaurants?order=nextOrder 표시되지만, 쿼리파라미터는 무시됨 -->
  <!-- 서버 측 코드에서 쿼리파라미터에 접근(req.query.order)하여 정렬 변경 -->
  <form action="/restaurants" method="GET">
    <input type="hidden" value="<%= nextOrder %>" name="order" />
    <button class="btn">change Order</button>
  </form>
</body>
````

```JavaScript
router.get("/restaurants", function (req, res) {
  const storedRestaurants = resData.getStoredRestaurants();

  // 쿼리 매개변수 객체 저장 (restaurants.ejs에서 form hidden 설정해야함)
  let order = req.query.order;
  let nextOrder = 'desc';

  if (order !== "asc" && order !== "desc") {
    order = "asc";
  }

  if (order === 'desc') {
    nextOrder ='asc';
  }

  // list 오름차순, 내림차순 정렬
  // sort 메서드 사용
  storedRestaurants.sort(function (resA, resB) {
    if (
      (order === "asc" && resA.name > resB.name) ||
      (order === "desc" && resB.name > resA.name)
    ) {
      return 1;
      // retrun이 0보다 클 경우
      // 두 아이템을 뒤집어서, 두번째 항목 resB가 resA보다 먼저 나옴
    }
    return -1;
    // return이 0보다 작을 경우 반대
    // 아이템을 뒤집지 않고 resA가 먼저 위치
  });
    res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
    nextOrder: nextOrder
  });
```

20. 가져온 데이터 형식 지정 & 변환 (CSS, pre-wrap)

    - HTML 코드는 모든 빈칸과 줄바꿈을 무시, 동적 텍스트도 포함.
    - posts.css 코드 중

```CSS
white-space: pre-wrap;
<!-- pre-wrap : 공백,줄바꿈 유지 -->
<!-- normal : 공백,줄바꿈 적용 안됨 -->
```

    - 날짜 형식 변경
        - date: posts[0].date.toISOString() 코드를 통해, posts[0].date의 값을 ISO 형식의 문자열로 변환하여 저장
        - ISO 형식은 날짜와 시간을 표현하는 국제 표준이며, "2020-12-01T00:00:00.000Z"와 같은 형태로 표현. 이 값은 주로 머신 리더블한 날짜 형식으로 사용

        - humanReadableDate: posts[0].date.toLocaleDateString('en-US', {...}) 코드를 통해, posts[0].date의 값을 사람이 읽기 쉬운 형태로 변환하여 저장
        - 주어진 로케일에 맞게 날짜를 포맷팅, 여기서는 'en-US' 로케일을 사용, 추가로 객체를 전달하여 날짜를 어떻게 포맷팅할지를 지정.

```JavaScript
// blog.js
router.get('/posts/:id', async function(req,res){
 ...
 if (!posts || posts.length === 0){
  return res.status(404).render('404');
 }

 const postData = {
  ...posts[0] //스프레드연산자로 모든 데이터를 객체로 가져옴
  date: posts[0].date.toISOString()
  humanReadableDate: posts[0].date.toLocaleDateString('en-US',{
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
 })
};
 res.render('post-detail', { post: postData }));
});
```

```HTML
<!-- post-detail.ejs -->
<time datetime="<%= post.date %>"<%= post.humanReadableDate %></time>
```

21. 스프레드 연산자(...) 복습

    - let newObj = obj;와 let newObj = { ...obj }; 의 차이는 JavaScript에서 객체를 다루는 방식
    - JavaScript에서 { ...obj } 구문은 새로운 객체를 생성하고, obj의 모든 속성을 새로운 객체에 복사

```JavaScript
let obj = {
  name: 'John',
  age: 30,
  city: 'New York'
};

let newObj = { ...obj }; // 새로운 객체에 obj의 속성을 복사함.
```

```JavaScript
// let newObj = obj;를 사용하면 newObj는 obj에 대한 참조.
// newObj와 obj는 동일한 객체를 가리키므로, newObj를 통해 속성을 변경하면 원래의 obj 객체도 변경
// 얕은 복사 (shallow copy)
let obj = { name: 'John' };
let newObj = obj;

newObj.name = 'David';
console.log(obj.name); // 출력: David

// let newObj = { ...obj };를 사용하면 newObj는 obj의 모든 속성을 가진 새로운 객체
// newObj와 obj는 서로 독립적인 객체이므로, newObj의 속성을 변경해도 obj는 영향을 받지 않음
// 깊은 복사(deep copy)
let obj = { name: 'John' };
let newObj = { ...obj };

newObj.name = 'David';
console.log(obj.name); // 출력: John
```

22. 스프레드 연산자(...) 다른 활용 복습

    - 배열의 복사와 병합
      스프레드 연산자는 배열의 모든 요소를 새 배열에 복사하거나 두 개 이상의 배열을 하나로 병합하는 데 사용

```JavaScript
let arr1 = [1, 2, 3];
let arr2 = [...arr1]; // arr1의 모든 요소를 복사

let arr3 = [4, 5, 6];
let mergedArr = [...arr1, ...arr3]; // arr1과 arr3의 모든 요소를 병합
```

    - 함수 인수로 사용
    스프레드 연산자는 배열의 요소를 함수의 인수로 전달하는 데도 사용

```JavaScript
function add(a, b, c) {
  return a + b + c;
}

let numbers = [1, 2, 3];
console.log(add(...numbers)); // 출력: 6
```

    - 나머지 매개변수(Rest Parameters)
    - 프레드 연산자는 함수의 매개변수로 사용될 때, 나머지 매개변수를 정의하는 데 사용
    - 나머지 매개변수는 함수에 전달된 인수들 중에서 나머지를 모두 모아 배열로 만듬

```JavaScript
function logArguments(...args) {
  for (let arg of args) {
    console.log(arg);
  }
}

logArguments('Hello', 'world', '!'); // 출력: Hello, world, !
```

23. '<time datetime=""> 태그

    - datetime은 HTML의 <time> 태그에서 사용되는 속성.
    - 이 속성은 해당 태그가 나타내는 시간 정보를 머신 리더블한 형태로 제공
    - 브라우저나 웹 크롤러, 스크린 리더 등이 이해하고 해석할 수 있는 형식으로 시간 정보를 제공

```JavaScript
<time datetime="2020-12-01">December 1, 2020</time>
// 사용자가 볼 수 있는 텍스트는 "December 1, 2020"
// datetime 속성을 통해 머신 리더블한 형태인 "2020-12-01"도 제공
```

23. 게시물 업데이트 페이지 준비

```HTML
<!-- update-post.ejs -->
<a href='/posts/<%= post.id %>/edit'>Edit Post</a>
```

```JavaScript
// blog.js
router.get('/posts/:id/edit', async function(req,res) {
 const query = `
 SELECT * FROM posts WHERE id = ?
 `;
 const [posts] = await db.query(query,[req.params.id]);

  if (!posts || posts.length === 0){
  return res.status(404).render('404');
 }

 res.render('update-post', { post: posts[0] });
});
```

24. 게시물 업데이트

```HTML
<!-- update-post.ejs -->
<form action="/posts/<%= post.id %>/edit" method="POST">
```

```JavaScript
// blog.js
router.post'/posts/:id/edit', function(req,res){
 const query = `
  UPDATE posts SET title = ?, summary = ?, body = ?
  WHERE id = ?
 `;

 db.query(query, [
  req.body.title,
  req.body.summary,
  req.body.content,
  req.params.id
 ]);

 res.render('/posts');
});
```

25. 게시물 삭제

```HTML
<form action="/posts/<%= post.id %>/delete method="POST">
 <button class="btn btn-alt">Delete POst</button>
</form>
```

```JavaScript
router.post('/posts/:id/delete', async function(req,res){
 await db.query('DELETE FROM posts WHERE id = ?',[req.params.id]);
 res.redirect('/posts');
});
```

25. 모듈 요약 (NodeJS & MySQL)

    - CRUD(CREATE, READ, UPDATE, DELETE) 작업을 활용한 작은 데모 블로그 구축
    - mysql2 패키지 설치 및 설정

```JavaScript
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "hostIp",
  database: "databaseName",
  user: "userName",
  password: "password",
});

module.exports = pool;
```
- 'async-wait' 비동기화
- 쿼리 내 플레이스홀더 '?', db.query(query, [플레이스홀더값])
- 데이타베이스 테이블 병합 'INNER JOIN' ~ 'ON tableA.id = tableB.id'
- MySQL 패키지 동적값 주입, 배열안의 배열값을 넣으면 자동으로 개별값으로 분할.

```JavaScript
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
```
