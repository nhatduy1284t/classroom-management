import dotenv from 'dotenv'
dotenv.config();

import express from "express";

import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './db/db.js'

import userRoutes from './routes/users.route.js';
import authRoutes from './routes/auth.route.js';


//Connect to db
db();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/app/views/');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded()); // for parsing application/x-www-form-urlencoded

app.use(express.static('src/app/views/assets'));

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/users', userRoutes);
app.use('/auth', authRoutes);



app.listen(port, () => console.log(`Example app listening at ${port}`));

