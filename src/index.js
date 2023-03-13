import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from 'cookie-parser'
import { engine } from "express-handlebars";
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";

import db from "./db/db.js";

import userRoutes from "./routes/users.route.js";
import authRoutes from "./routes/auth.route.js";
import classRoutes from "./routes/class.route.js";
import homeRoutes from "./routes/home.route.js";

import requireAuth from "./middlewares/auth.middleware.js";

//Connect to db
db();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/app/views/");

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded()); // for parsing application/x-www-form-urlencoded

app.use(express.static("src/app/views/assets"));

app.use(cookieParser('mySecretKey'));//Cookie parser to handle client's cookie

app.get("/", (req, res) => {
  res.render("auth/login", { layout: "login" });
});

app.use("/users", requireAuth, userRoutes);
app.use("/auth", authRoutes);
app.use("/class",requireAuth, classRoutes);
app.use("/home", homeRoutes);

app.listen(port, () => console.log(`Example app listening at ${port}`));
