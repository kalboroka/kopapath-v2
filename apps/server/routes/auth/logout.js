import { pool } from '#config';

const logout = async (req, res, next) => {
  try {
    await pool.query('UPDATE users SET refresh_token=NULL WHERE id=$1', [req.user.id]);
    res.clearCookie('refreshToken');
    res.clearCookie('uid');
    res.json({ msg: 'user logged out' });
  } catch (err) { next(err); }
}

export default logout;
