require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const PORT = 4040;

// app.use(express.json());
app.use(bodyParser.json());

const posts = [
  { username: "Supo", title: "Post 1" },
  { username: "Dipo", title: "Post 2" },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
  // res.json(req.user.name);
  //   const post = posts.filter((post) => post.username === "Supo");
  //   res.send(post);
});

app.post("/login", (req, res) => {
  // Authenticate user

  const username = req.body.username;
  const user = { name: username };
  //   console.log(user);
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log("Express server started on PORT: " + PORT);
});
