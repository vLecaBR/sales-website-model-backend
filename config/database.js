// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite', //! Tipo de banco de dados
  storage: './database.sqlite', //! Caminho do arquivo do banco de dados
});

const connectDB = async () => { //! Função para conectar ao banco de dados
  try { //! Tenta conectar ao banco de dados
    await sequelize.authenticate(); //! Função para autenticar a conexão com o banco de dados
    console.log('Conexão com o banco de dados foi estabelecida com sucesso.'); 
  } catch (error) { //! Caso ocorra um erro ao conectar ao banco de dados
    console.error('Erro ao conectar com o banco de dados:', error);
  }
};

module.exports = { sequelize, connectDB }; //! Exporta o sequelize e connectDB
