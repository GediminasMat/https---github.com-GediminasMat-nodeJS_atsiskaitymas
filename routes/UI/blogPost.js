import express from 'express';
import con from '../sql_connection.js';
import isLoggedIn from '../isLoggedIn.js';

const blogPost = express.Router();

blogPost.post('/', async (req, res) => {
  try {
    if (await isLoggedIn(req)) {
      const rb = req.body;
      if (!rb.title || !rb.content) return res.send({ msg: 'Title and text needed' });
      await con.query(`INSERT INTO blog (title, content, author_id, created_at)VALUES (?,?,?,?) `,
        [rb.title, rb.content, req.token.id, new Date().toLocaleString('LT')]);
      res.redirect('/');
    } else {return res.send({ msg: 'You must be logged in to post' });
  }} catch (err) {res.status(500).send({ err: err.message });
  }
});

blogPost.get('/', async (req, res) => {
  const auth = await isLoggedIn(req);
  res.render('blogPost', { page: 'blogPost', css: 'blogPost.css', auth: auth });
});

export default blogPost;