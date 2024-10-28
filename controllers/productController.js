const productService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o produto.' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o produto.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o produto.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const success = await productService.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ error: 'Produto não encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o produto.' });
  }
};
