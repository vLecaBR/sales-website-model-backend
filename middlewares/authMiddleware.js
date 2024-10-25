// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'seu_segredo');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Autenticação falhou!' });
  }
};

module.exports = authMiddleware;
