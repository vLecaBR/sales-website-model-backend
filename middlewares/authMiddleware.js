// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Sem token.' });
  }

  try {
    const verified = jwt.verify(token, 'seu_segredo'); // Use o mesmo segredo que você usou no login
    req.user = verified; // Salva as informações do usuário na requisição
    next(); // Continua para o próximo middleware ou rota
  } catch (err) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
