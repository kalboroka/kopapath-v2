import { pool } from '#config';

const list = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT user_id, l.id as loan_id, name, mobile, email, amount, rate, term, status, total_due, due_date, applied_at, disbursed_at, closed_at FROM users u RIGHT JOIN loans l ON u.id = l.user_id WHERE user_id=$1 ORDER BY applied_at DESC',
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    next(err)
  }
}

export default list;
