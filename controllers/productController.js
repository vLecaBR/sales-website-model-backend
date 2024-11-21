// controllers/productController.js
const Product = require('../models/Product');
const authenticateToken = require('../middlewares/authMiddleware'); // Importando o middleware de autenticação

// Função para pegar todos os produtos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Função para pegar um produto específico pelo ID
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

// Função para criar um novo produto
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, conteudoCaixa, image } = req.body;

    // Garantindo que conteudoCaixa seja um array, caso venha como string separada por vírgulas
    const formattedConteudoCaixa = Array.isArray(conteudoCaixa)
      ? conteudoCaixa // Se já for um array, usa diretamente
      : conteudoCaixa ? conteudoCaixa.split(',').map(item => item.trim()) : []; // Caso seja string, transforma em array

    // Criando o novo produto no banco
    const newProduct = await Product.create({
      name,
      price,
      description,
      conteudoCaixa: formattedConteudoCaixa,  // Salvando o campo como array
      image
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Erro ao criar produto:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Função para atualizar um produto existente
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }

    const { name, price, description, conteudoCaixa, image } = req.body;

    // Garantindo que conteudoCaixa seja um array, caso venha como string separada por vírgulas
    const updatedConteudoCaixa = Array.isArray(conteudoCaixa)
      ? conteudoCaixa // Se já for um array, usa diretamente
      : conteudoCaixa ? conteudoCaixa.split(',').map(item => item.trim()) : []; // Caso seja string, transforma em array

    // Atualizando o produto com os novos dados
    await product.update({
      name,
      price,
      description,
      conteudoCaixa: updatedConteudoCaixa,  // Atualizando o campo com o novo valor
      image
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Função para excluir um produto
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
