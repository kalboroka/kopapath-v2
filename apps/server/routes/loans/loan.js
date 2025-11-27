import { pool } from '#config';

const loan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM loans WHERE id = $1 AND user_id = $2 LIMIT 1',
      [id, userId]
    );

    if (result.rows.length === 0 ) return res.status(404).json({ msg: 'Loan not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err)
  }
}

export default loan;
