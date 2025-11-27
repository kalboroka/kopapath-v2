import { pool } from '#config'

const broadcast = async (req, res, next) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ err: 'missing field' });

  try {
    await pool.query(
      'INSERT INTO broadcasts(user_id, msg) VALUES($1, $2)',
      [req.user.id, message]
    );
    res.status(201).json({msg: 'message sent'});
  } catch (err) { next(err) }
}

export default broadcast;
