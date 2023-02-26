import jwt from 'jsonwebtoken';

export function tokenAuthenticate(req, res, next) {
  // get token, verify it and attach user data retrieved from token to request
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ 'message': 'Authorization header missing' });
  }

  const accessToken = authHeader.split(' ')[1];
  if (!accessToken) {
    return res.status(401).json({ 'message': 'Token missing' });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 'message': 'Invalid token'});
    }
    req.user = user;
    next();
  })
}