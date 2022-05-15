const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const JWT_SECRET = 'ioausdghfiuSDUHGfggabsdfjkmn';

const getToken = (id) => jwt.sign({ id }, JWT_SECRET);

const isAuthorized = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // res.status(401).send({ message: 'Необходима авторизация' });
    next(new Unauthorized('Необходима авторизация'));
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = await jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // res.status(401).send({ message: 'Необходима авторизация' });
    next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;
  // const { cookie } = req.headers;
  // if (!cookie || !cookie.startsWith('jwt=')) {
  //   res.status(401).send({ message: 'Необходима атворизация' });
  //   return;
  // }
  next();
};

module.exports = {
  isAuthorized,
  getToken,
};
