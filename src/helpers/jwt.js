import jwt from 'jsonwebtoken';

const generateToken = (payload, secret, expiresIn) => new Promise((resolve, reject) => {
  jwt.sign(
    payload,
    secret,
    { expiresIn },
    (err, token) => (err ? reject(err) : resolve(token)),
  );
});

export default generateToken;
