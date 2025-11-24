import { pool } from '#config';

const ack = async (req, res, next) => {
  try {
    const r = await pool.query(
      `UPDATE messages SET ack_at=NOW()
       WHERE id=$1
       RETURNING *`,
      [req.params.id]
    );
    res.json(r.rows[0]);
  } catch (e) { next(e); }
}

export default ack;
