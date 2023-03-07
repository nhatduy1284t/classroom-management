import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/app/views/')
app.use(express.static(path.join(__dirname,'/app/views/')))

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => console.log(`Example app listening at ${port}`));

