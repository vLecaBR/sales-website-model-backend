// admin.js
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const express = require('express');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middlewares/authMiddleware');

// Configuração do AdminJS
const adminJs = new AdminJS({
  databases: [], // Adicione suas configurações de banco de dados aqui
  rootPath: '/admin',
});

// Função para verificar autenticação específica para o AdminJS
const adminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).redirect('/login'); // Redireciona para login se o token não estiver presente
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo');
    
    // Aqui você pode verificar se o usuário tem permissões de admin
    if (user.role !== 'admin') { 
      return res.status(403).json({ message: 'Acesso negado. Somente administradores podem acessar.' });
    }

    req.user = user; // Guarda o usuário no request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido.' });
  }
};

// Cria a rota para o AdminJS com autenticação
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      // Aqui você pode implementar sua lógica de autenticação para o AdminJS (opcional)
      // Como uma checagem de credenciais ou uma verificação extra, se necessário.
      return { email: email, role: 'admin' }; // Retorne um objeto de usuário se a autenticação for bem-sucedida
    },
    cookiePassword: process.env.COOKIE_SECRET || 'cookie_secreto',
  },
  null,
  {
    before: adminAuthMiddleware, // Adiciona o middleware de autenticação para a rota AdminJS
  }
);

module.exports = adminRouter;
