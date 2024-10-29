// models/Product.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Product extends Model {}

Product.init({
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
    type: DataTypes.JSON, // Ou DataTypes.STRING, se você preferir armazenar como texto
    allowNull: false,
  },
  image: { // Adicionando o campo de imagem
    type: DataTypes.STRING, // Armazenando a URL da imagem
    allowNull: true, // Pode ser nulo se a imagem não for obrigatória
  }
}, {
  sequelize,
  modelName: 'Product',
});

module.exports = Product;
