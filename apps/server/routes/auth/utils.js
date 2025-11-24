import { pool } from '#config';
import { hash, newRandomToken } from '#utils';

export const badReq = (res, msg = 'credentials unmatched') =>
  res.status(400).json({ msg: msg });

export const setRefreshCookie = (res, token, uid) => {
  const opts = {
    httpOnly: true,
    secure: false,
    signed: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  };
  res.cookie('refreshToken', token, opts);
  res.cookie('uid', uid, opts);
};

export const getUserById = async (id) => {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE mobile=$1 OR email=$1 LIMIT 1',
    [id]
  );
  return rows[0];
}

export const rotateRefresh = async (userId) => {
  const refresh = newRandomToken();
  const hashed = await hash(refresh);
  await pool.query(
    'UPDATE users SET refresh_token=$1 WHERE id=$2',
    [hashed, userId]
  );
  return refresh;
}
