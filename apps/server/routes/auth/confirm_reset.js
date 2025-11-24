import { pool } from '#config'
import { hash, sendMsg } from '#utils';
import { badReq } from './utils.js';

const confirm_reset = async (req, res, next) => {
  const { token, secret } = req.body;
  if (!token || !secret) return badReq(res);

  try {
    const { rows } = await pool.query(
      `SELECT id FROM users
       WHERE reset_token=$1 AND reset_expires > NOW() LIMIT 1`,
      [token]
    );
    if (!rows.length) return res.status(400).json({ msg: 'Invalid or expired token' });

    const hashed = await hash(secret);

    await pool.query(
      `UPDATE users SET secret=$1,
                        reset_token=NULL,
                        reset_expires=NULL
       WHERE id=$2`,
      [hashed, rows[0].id]
    );

    res.json({ msg: 'Secret updated successfully' });
    await sendMsg(rows[0].id, 'Your secret was changed.')
  } catch (err) { next(err); }
}

export default confirm_reset;
