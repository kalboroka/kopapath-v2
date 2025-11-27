import { pool } from '#config';

const bucket = async (req, res, next) => {
  try {
    const r = await pool.query(
      'SELECT amount FROM bucket'
    );
    res.status(200).json(r.rows[0]);
  } catch (err) {
    next(err)
  }
}

export default bucket;
