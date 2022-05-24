import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import con from '../sql_connection.js';

const regRouter = express.Router();
const jwtSecret = process.env.JWT_SECRET;

const userSchema = Joi.object({
  username: Joi.string().trim().lowercase().required(),
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string().required(),
});

regRouter.post('/', async (req, res) => {
  let rb = req.body;
  try {
    rb = await userSchema.validateAsync(rb);
  } catch (err) {
    return res.status(400).send({ err: `Incorrect data provided` });
  } try {
    const hashedPassword = bcrypt.hashSync(rb.password);
    const newUser = await con.query(`INSERT INTO user (name, email, password, register_time) VALUES (?,?,?,?)`,
      [rb.username, rb.email, hashedPassword, new Date().toLocaleDateString('LT')]);
    const token = jwt.sign({ id: newUser[0].insertId, email: rb.email }, jwtSecret, {
      expiresIn: '1d',
    });
    return res
      .cookie('token', token, {
        maxAge: 24 * 60 * 60 * 1000,
      })
      .redirect('/');
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default regRouter