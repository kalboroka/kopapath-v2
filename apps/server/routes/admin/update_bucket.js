import { pool } from '#config'

const update = async (req, res, next) => {
  const { amount } = req.body;
  if (!amount || amount < 0) return res.status(400).json({ err: 'missing field' });

  try {
    await pool.query(
      'UPDATE bucket SET amount=$1',
      [amount]
    );
    res.status(200).json({msg: 'amount updated'});
  } catch (err) { next(err) }
}

export default update;
