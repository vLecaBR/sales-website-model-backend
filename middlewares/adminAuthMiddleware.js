// middlewares/adminAuthMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware para autenticação de administradores no AdminJS
const adminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo');
    
    // Verifica se o usuário é administrador
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Somente administradores podem acessar.' });
    }

    req.user = user;  // Adiciona o usuário ao objeto req para o próximo middleware
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido.' });
  }
};

module.exports = adminAuthMiddleware; // Exporta o middleware
