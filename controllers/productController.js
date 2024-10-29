// controllers/productController.js
const Product = require('../models/Product');
const authenticateToken = require('../middlewares/authMiddleware'); // Importando o middleware de autenticação

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/productController.js
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, conteudoCaixa, image } = req.body; // Capturando os dados do produto
    const newProduct = await Product.create({ name, price, description, conteudoCaixa, image });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Erro ao criar produto:', err.message); // Adicionando log de erro
    res.status(500).json({ message: err.message });
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }

    const { name, price, description, conteudoCaixa, image } = req.body; // Incluindo a imagem
    await product.update({ name, price, description, conteudoCaixa, image });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }
    await product.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Middleware para autenticação
exports.authenticateToken = authenticateToken;
