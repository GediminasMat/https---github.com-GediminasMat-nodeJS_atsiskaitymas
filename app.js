import 'dotenv/config';
import express, { urlencoded } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';


import blog from './routes/api/blog.js';
import users from './routes/api/users.js';
import blogPost from './routes/UI/blogPost.js';
import home from './routes/UI/home.js';
import login from './routes/UI/login.js';
import register from './routes/UI/register.js';

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve('public')));
app.use(urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/api/blog', blog);
app.use('/api/users', users);
app.use('/login', login);
app.use('/blogPost', blogPost);
app.use('/register', register);
app.use('/', home);

app.listen(PORT, console.log(`Serveris veikia ant ${PORT} porto`));
