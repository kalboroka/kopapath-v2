import { compare, signAccess } from '#utils';
import { badReq, getUserById, rotateRefresh, setRefreshCookie } from './utils.js';

const login = async (req, res, next) => {
  const { userid, secret } = req.body;
  if (!userid || !secret) return badReq(res);

  try {
    const user = await getUserById(userid);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const ok = await compare(secret, user.secret);
    if (!ok) return res.status(401).json({ msg: 'credentials unmatched' });

    if (req.body.pxsign) {
      const ok = await compare(req.body.pxsign, user.pxsign);
      if (!ok) return res.status(401).json({ msg: 'credentials unmatched' });
    }

    const refresh = await rotateRefresh(user.id);
    setRefreshCookie(res, refresh, user.id);

    res.json({
      accessToken: signAccess({ id: user.id, mobile: user.mobile, email: user.email }),
      user: { name: user.name, mobile: user.mobile, email: user.email },
      msg: 'login successful'
    });
  } catch (err) { next(err); }
}

export default login;
