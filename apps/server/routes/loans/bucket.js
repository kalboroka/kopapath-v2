import { pool } from '#config';

const bucket = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT amount FROM bucket'
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err)
  }
}

export default bucket;
