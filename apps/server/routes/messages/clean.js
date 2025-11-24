import { pool } from '#config';

const clean = async (req, res, next) => {
  try {
    const r = await pool.query(
      `DELETE FROM messages
       WHERE user_id=$1 AND ack_at IS NOT NULL`,
      [req.params.uid]
    );
    res.json({ deleted: r.rowCount });
  } catch (e) { next(e); }
}

export default clean;
