import { pool } from '#config';

const list = async (req, res, next) => {
  try {
    const r = await pool.query(
      `SELECT *
       FROM messages
       WHERE user_id=$1
       UNION ALL
       SELECT * FROM broadcasts
       ORDER BY sent_at`,
      [req.user.id]
    );

    res.json(r.rows);
  } catch (e) { next(e); }
}

export default list;
