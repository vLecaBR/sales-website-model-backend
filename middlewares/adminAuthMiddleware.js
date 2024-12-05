// middlewares/adminAuthMiddleware.js
const jwt = require('jsonwebtoken');

//! Middleware para autenticação de administradores no AdminJS
const adminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization']; //! Pega o cabeçalho de autorização
  const token = authHeader && authHeader.split(' ')[1]; //! Extrai o token do cabeçalho

  if (!token) { //! Caso não tenha token retorna mensagem de erro
    return res.status(401).json({ message: 'Token não fornecido.' }); //! Retorna mensagem de erro
  }

  try { //! Tenta verificar o token do usuário
    const user = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo'); //! Verifica o token com a chave secreta
    
    //! Verifica se o usuário é administrador
    if (user.role !== 'admin') { //! Aqui é onde a verificação ocorre
      return res.status(403).json({ message: 'Acesso negado. Somente administradores podem acessar.' }); //! Retorna mensagem de erro
    }

    req.user = user;  //! Adiciona o usuário ao objeto req para o próximo middleware
    next(); 
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido.' });
  }
};

module.exports = adminAuthMiddleware; //! Exporta o middleware
