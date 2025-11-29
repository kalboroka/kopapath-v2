import { pool } from '#config';

const list = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT name, mobile, email, l.* FROM users u RIGHT JOIN loans l ON u.id = l.user_id ORDER BY applied_at DESC',
    );
    res.status(200).json(result.rows);
  } catch (err) {
    next(err)
  }
}

export default list;
