const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assume que o token é passado como "Bearer <token>"

  if (!token) {
    return res.sendStatus(401); // Não autorizado
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Proibido
    }
    req.user = user; // Salva o usuário na requisição
    next();
  });
};

module.exports = authenticateToken;
