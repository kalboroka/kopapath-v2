import { verifyAccess } from '#utils';

export function requireAuth(req, res, next) {
  const fb = { err: 'credentials unmatched' };
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json(fb);

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json(fb);

  try {
    const decoded = verifyAccess(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json(fb);
  }
}
