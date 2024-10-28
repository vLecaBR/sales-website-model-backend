// models/Product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Certifique-se de que o caminho está correto

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
    allowNull: true,
  },
  conteudoCaixa: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
