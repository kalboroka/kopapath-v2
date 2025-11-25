import { pool } from '#config';
import { badReq, rotateRefresh, setRefreshCookie, hash, signAccess, sendMsg } from '#utils';

const signup = async (req, res, next) => {
  const { name, mobile, email, secret } = req.body;
  if (!name || !mobile || !email || !secret) return badReq(res);

  try {
    const { rows: exists } = await pool.query(
      'SELECT id FROM users WHERE mobile=$1 OR email=$2',
      [mobile, email]
    );
    if (exists.length) return res.status(409).json({ msg: 'User exists' });

    const hashedSecret = await hash(secret);
    const { rows } = await pool.query(
      `INSERT INTO users (name, mobile, email, secret)
       VALUES ($1,$2,$3,$4)
       RETURNING id, mobile, email`,
      [name, mobile, email, hashedSecret]
    );

    const user = rows[0];
    const refresh = await rotateRefresh(user.id);
    setRefreshCookie(res, refresh, user.id);

    res.status(201).json({
      accessToken: signAccess({ id: user.id, mobile, email }),
      msg: 'account created, please login'
    });
    await sendMsg(user.id, 'Welcome! Grateful for being part of us.')
  } catch (err) { next(err); }
}

export default signup;
