import { pool } from '#config';

const clean = async (req, res, next) => {
  try {
    await pool.query(
      `DELETE FROM messages
       WHERE user_id=$1 AND ack_at IS NOT NULL`,
      [req.params.uid]
    );
    res.status(200).json({ msg: 'message deleted' });
  } catch (e) { next(e); }
}

export default clean;
