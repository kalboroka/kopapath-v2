import { pool } from '#config'
import { badReq, getUserById, newRandomToken, sendMsg, sendResetLink } from '#utils';

const reset_secret = async (req, res, next) => {
  const { userid } = req.body;
  if (!userid) return badReq(res, 'userid required');

  try {
    const user = await getUserById(userid);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const token = newRandomToken();
    await pool.query(
      `UPDATE users SET reset_token=$1,
                       reset_expires=NOW() + INTERVAL '15 minutes'
       WHERE id=$2`,
      [token, user.id]
    );

    await sendResetLink(user.email, `http://localhost:5000/auth/reset?token=${token}`);
    res.json({ msg: 'Reset link sent to your email' });
    await sendMsg(user.id, 'Secret reset was requested. If it was not you, change secret now.');
  } catch (err) { next(err); }
}

export default reset_secret;
