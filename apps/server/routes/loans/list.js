import { pool } from '#config';

const list = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT id, amount, term, total_due, status FROM loans WHERE user_id = $1 ORDER BY applied_at DESC',
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    next(err)
  }
}

export default list;
