// admin.js
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const express = require('express');
const jwt = require('jsonwebtoken');
const adminAuthMiddleware = require('./middlewares/adminAuthMiddleware');

// Configuração do AdminJS
const adminJs = new AdminJS({
  databases: [], // Adicione suas configurações de banco de dados aqui
  rootPath: '/admin', // Caminho para o painel AdminJS
});

// Cria a rota para o AdminJS com autenticação
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      // Aqui você pode implementar sua lógica de autenticação para o AdminJS, 
      // mas vamos usar o middleware JWT para verificar os tokens em vez de login simples
      return { email: email, role: 'admin' }; // Isso não será usado diretamente aqui, pois já estamos validando via middleware JWT.
    },
    cookiePassword: process.env.COOKIE_SECRET || 'cookie_secreto',
  },
  null,
  {
    before: adminAuthMiddleware, // Adiciona o middleware de autenticação para a rota AdminJS
  }
);

// Exporta o roteador para ser utilizado no arquivo principal (server.js)
module.exports = adminRouter;
