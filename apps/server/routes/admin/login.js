import {
  compare, signAccess, badReq, getUserById, rotateRefresh, setRefreshCookie
} from '#utils';

const login = async (req, res, next) => {
  const { userid, pxsign, secret } = req.body;
  if (!userid || !pxsign || !secret) return badReq(res);

  try {
    const user = await getUserById(userid);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const oks = await Promise.all([
      compare(secret, user.secret),
      compare(pxsign, user.pxsign)
    ]);
    if (oks.some(v=>!v)) return res.status(401).json({ msg: 'credentials unmatched' });

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
