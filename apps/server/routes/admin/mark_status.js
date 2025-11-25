import { pool } from '#config'

const mark = async (req, res, next) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ msg: 'missing field' });

  try {
    await pool.query(
      'UPDATE loans SET status=$2 WHERE id=$1',
      [req.params.id, status]
    );
    res.status(200).json({msg: 'mark success'});
  } catch (err) { next(err) }
}

export default mark;
