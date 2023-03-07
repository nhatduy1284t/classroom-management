// import express from "express";
// import { engine } from "express-handlebars";
const express = require("express");
const { engine } = require("express-handlebars");

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

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

app.get("/dogs/:id", (req, res) => {
  dog = dogs[parseInt(req.params.id) - 1];
  res.send(dog);
});

app.listen(3000);

