// models/Product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT, // Use FLOAT para preços
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  conteudoCaixa: {
    type: DataTypes.JSON, // Para armazenar o conteúdo da caixa como um JSON
    allowNull: true,
  },
});

// Exporta o modelo de produto
module.exports = Product;
