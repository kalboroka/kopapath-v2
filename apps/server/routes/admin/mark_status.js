import { pool } from '#config'

const mark = async (req, res, next) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ err: 'missing field' });

  try {
    await pool.query(
      'UPDATE loans SET status=$2 WHERE id=$1',
      [req.params.id, status]
    );
    res.status(200).json({msg: `marked ${status}`});
  } catch (err) { next(err) }
}

export default mark;
