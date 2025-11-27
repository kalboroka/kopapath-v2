import { pool } from '#config';
import { compare, signAccess, getUserById, rotateRefresh, setRefreshCookie } from '#utils';

const login = async (req, res, next) => {
  const { userid, secret } = req.body;
  if (!userid || !secret) return res.status(400).json({err:'missing field'});

  try {
    const user = await getUserById(userid);
    if (!user) return res.status(404).json({ err: 'User not found' });

    const ok = await compare(secret, user.secret);
    if (!ok) return res.status(401).json({ err: 'credentials unmatched' });
    
    const isAdmin = await pool.query('SELECT 1 FROM admins WHERE user_id=$1 LIMIT 1', [user.id])

    const refresh = await rotateRefresh(user.id);
    setRefreshCookie(res, refresh, user.id);

    res.status(200).json({
      accessToken: signAccess({ id: user.id, mobile: user.mobile, email: user.email }),
      user: { name: user.name, mobile: user.mobile, email: user.email, isAdmin: isAdmin.rows.length > 0 },
      msg: 'login successful'
    });
  } catch (err) { next(err); }
}

export default login;
