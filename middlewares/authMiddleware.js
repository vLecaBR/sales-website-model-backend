// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; //! Pega o cabeçalho de autorização
  const token = authHeader && authHeader.split(' ')[1]; //! Extrai o token após "Bearer "

  if (!token) { //! Caso não tenha token retorna mensagem de erro
    return res.status(401).json({ message: 'Token não fornecido.' }); 
  }

  jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo', (err, user) => { //! Verifica o token com a chave secreta
    if (err) { //! Caso ocorra um erro retorna mensagem de erro
      return res.status(403).json({ message: 'Token inválido.' });
    }
    req.user = user; //! Adiciona o usuário ao objeto req para o próximo middleware
    next();
  });
};

module.exports = authenticateToken;
