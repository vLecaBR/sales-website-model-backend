// admin.js
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const express = require('express');
const jwt = require('jsonwebtoken');
const adminAuthMiddleware = require('./middlewares/adminAuthMiddleware');

//! Configuração do AdminJS
const adminJs = new AdminJS({
  databases: [], //! Adicione os bancos de dados aqui
  rootPath: '/admin', //! Caminho para o painel AdminJS
});

//! Cria a rota para o AdminJS com autenticação
const adminRouter = AdminJSExpress.buildAuthenticatedRouter( //! Cria o roteador autenticado do AdminJS
  adminJs,
  {
    authenticate: async (email, password) => {
      //! Adicione a autenticação do usuário aqui
      return { email: email, role: 'admin' }; //! Isso não será usado diretamente aqui, pois já estamos validando via middleware JWT.
    },
    cookiePassword: process.env.COOKIE_SECRET || 'cookie_secreto', //! Senha do cookie
  },
  null,
  {
    before: adminAuthMiddleware, //! Adiciona o middleware de autenticação para a rota AdminJS
  }
);

//! Exporta o roteador para ser utilizado no arquivo principal (server.js)
module.exports = adminRouter;
