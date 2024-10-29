// models/Product.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  conteudoCaixa: {
    type: DataTypes.JSON, // Se estiver usando um array, o tipo JSON é adequado
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, // Adicionando o campo image
    allowNull: true, // O campo pode ser opcional
  }
});

module.exports = Product;
