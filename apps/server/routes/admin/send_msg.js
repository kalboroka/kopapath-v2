import { pool } from '#config';

const send = async (req, res, next) => {
  const { receiver, message } = req.body;
  if (!receiver || !message) return res.status(401).json({ msg: 'missing fields' });

  try {
    await pool.query(
      `
      WITH
        uxst AS (
          SELECT id
          FROM users
          WHERE
            email=$1 OR mobile=$1
          LIMIT 1
        )
      INSERT
        INTO messages(user_id, msg)
        SELECT id, '${message}'
        FROM uxst
        WHERE
          EXISTS(SELECT 1 from uxst)
      `,
      [receiver]
    );
    res.status(200).json({msg: 'message sent'})
  } catch (err) {
    next(err)
  }
}

export default send;
