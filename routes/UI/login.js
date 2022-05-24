import express from 'express';
import con from '../../sql_connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const logRouter = express.Router();
const jwtSecret = process.env.JWT_SECRET;

logRouter.get('/', async (req, res) => {
  res.render('login', { page: 'login.css' });
});

logRouter.post('/', async (req, res) => {
  let rb = req.body;
  try {
    const [data] = await con.query(`SELECT * FROM user WHERE email = ?`,
      [rb.email]);
    if (data.lenght === 0) {
      return res.status(500).send({ err: `Incorrect email or password` });
    }
    const isAuthenticated = bcrypt.compareSync(rb.password, data[0].password);
    if (isAuthenticated) {
      const token = jwt.sign({ id: data[0].id, email: data[0].email, username: data[0].username }, jwtSecret);
      return res.cookie('token', token).redirect('/');
    } else { res.status(500).send({ error: `Incorrect email or password` }); }
  } catch (err) {
    res.status(500).send({ error: `An error has occured: ${err}` });
  }
});

export default logRouter;