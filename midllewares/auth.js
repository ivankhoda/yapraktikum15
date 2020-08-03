const jwt = require('jsonwebtoken');
const NotAuthorized = require('./errors/errorHandler');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = () => {
  throw new NotAuthorized('Необходима авторизация');
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
