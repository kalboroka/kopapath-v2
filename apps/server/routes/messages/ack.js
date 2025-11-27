import { pool } from '#config';

const ack = async (req, res, next) => {
  try {
    await pool.query(
      `UPDATE messages SET ack_at=NOW()
       WHERE id=$1
       RETURNING *`,
      [req.params.id]
    );
    res.status(200).json({msg: 'message acknowledged'});
  } catch (e) { next(e); }
}

export default ack;
