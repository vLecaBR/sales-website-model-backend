const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');  // Certifique-se de que o sequelize está sendo importado corretamente

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,  // Garantir que o email seja único
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',  // O padrão será "user", mas pode ser "admin" ou outro
    allowNull: false,
  },
});

module.exports = User;
