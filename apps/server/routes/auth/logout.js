import { pool } from '#config';

const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken');
    res.clearCookie('uid');
    res.status(200).json({ msg: 'user logged out' });
    
    // could fail if browser cleared cookies
    const uid = req.signedCookies.uid;
    if(uid)
      await pool.query('UPDATE users SET refresh_token=NULL WHERE id=$1', [uid]);
  } catch (err) { next(err); }
}

export default logout;
