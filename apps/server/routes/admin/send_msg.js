import { pool } from '#config';

const send = async (req, res, next) => {
  const { receiver, message } = req.body;
  if (!receiver || !message) return res.status(400).json({ err: 'missing field' });

  try {
    const r = await pool.query(
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
        RETURNING 1
      `,
      [receiver]
    );
    if (r.rows.length === 0) return res.status(400).json({ err: 'message not sent' })
    res.status(201).json({ msg: 'message sent' })
  } catch (err) {
    next(err)
  }
}

export default send;
