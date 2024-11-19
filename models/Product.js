const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');  // Certifique-se de que o sequelize está sendo importado corretamente

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
    type: DataTypes.STRING,
    allowNull: true,
  },
  conteudoCaixa: {
    type: DataTypes.JSONB,  // Usando JSONB para armazenar lista de itens na caixa
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Product;
