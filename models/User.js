// models/User.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');  // IMPORTANTE: Importar a instância do sequelize

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',  // Define um valor padrão de 'user' caso não seja fornecido
  },
});

module.exports = User;
