// database.js
const { Sequelize } = require('sequelize');

// Configurando o Sequelize para usar SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // Nome do arquivo do banco de dados
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados foi bem-sucedida!');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

module.exports = { sequelize, connectDB };
