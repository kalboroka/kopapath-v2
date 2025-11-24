import { pool } from '#config';

const send = async (req, res, next) => {
  try {
    const { msg } = req.body;
    const r = await pool.query(
      `INSERT INTO messages (user_id,msg)
       VALUES ($1,$2)
       RETURNING *`,
      [user_id, msg]
    );
    res.json(r.rows[0]);
  } catch (e) { next(e); }
}

export default send;
