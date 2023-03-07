const express = require("express");
const app = express();

const db = require("./db");

//Connect to db
db.connect();

const dogs = [
  { name: "Jimmy", age: 12 },
  { name: "Johnny", age: 32 },
];

app.get("/", (req, res) => {
  console.log("da co nguoi request");
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.json(dogs);
});

app.get("/dogs", async (req, res) => {
  const testUser = require("./app/models/User");
  const result = await testUser.find({});
  console.log(result); // 'hello'
  res.json(result);
});

app.listen(3000);
