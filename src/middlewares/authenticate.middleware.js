import jwt from 'jsonwebtoken';

const authenticate = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) return res.status(401).json({ message: 'No token, authorization denied' });

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) return res.status(401).json({ message: 'Session expired' });

    req.user = decodedToken;

    return next();
  });
};

export default authenticate;
