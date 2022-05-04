const jwt = require('jsonwebtoken');
const config = require('../config/index');

const generateToken = (userUuid) => {
  try {
    return jwt.sign({ userUuid }, config.JWT_SECRET, {
      expiresIn: 18000,
    });
  } catch (err) {
    console.log('token error', err);
  }
};

const authToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, config.JWT_SECRET, (err, data) => {
    console.log({ data });
    console.log({ err });
    if (err || !data) return res.sendStatus(403);
    req.userUuid = data.userUuid;
    next();
  });
};

module.exports = {
  generateToken,
  authToken,
};
