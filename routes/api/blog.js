import express from 'express';
import con from '../../sql_connection.js';
const router = express.Router();

router.get('/', async (req, res) =>{
  try{
    const [data] = await con.query(`SELECT * FROM Blog_Post.blog`);
    res.send(data);
  } catch (err) {res.status(400).send({err: err.message});}
});

router.get('/:id?', async (req, res) => {
  try {const [data] = await con.query(`SELECT * FROM Blog_Post.blog WHERE id = ?`, [req.params.id]);
  res.send(data);
} catch (err) {res.status(400).send({ err: err.message});}
});

export default router;
