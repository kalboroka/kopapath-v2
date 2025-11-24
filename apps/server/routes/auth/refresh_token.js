import { pool } from '#config';
import { compare, signAccess } from '#utils';
import { rotateRefresh, setRefreshCookie } from './utils.js';

const refresh_token = async (req, res, next) => {
  console.log(req);
  const refresh = req.signedCookies.refreshToken;
  const uid = req.signedCookies.uid;
  if (!refresh || !uid) return res.status(401).json({ msg: 'credentials unmatched' });

  try {
    const { rows } = await pool.query(
      'SELECT id, mobile, email, refresh_token FROM users WHERE id=$1',
      [uid]
    );
    const user = rows[0];
    if (!user) return res.status(403).json({ msg: 'credentials unmatched' });

    const match = await compare(refresh, user.refresh_token);
    if (!match) return res.status(403).json({ msg: 'credentials unmatched' });

    const newRefresh = await rotateRefresh(user.id);
    setRefreshCookie(res, newRefresh, user.id);

    res.json({
      accessToken: signAccess({ id: user.id, mobile: user.mobile, email: user.email }),
      msg: 'expired token refreshed'
    });
  } catch (err) { next(err); }
}

export default refresh_token;
