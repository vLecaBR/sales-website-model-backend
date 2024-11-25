const Product = require('../model/product');

const getAllProducts = async () => { //! Função para pegar todos os produtos
  return await Product.findAll();  //! Busca todos os produtos
};

const getProductById = async (id) => { //! Função para pegar um produto pelo ID
  return await Product.findByPk(id); //! Busca o produto pelo ID
};

const createProduct = async (productData) => { //! Função para criar um novo produto
  return await Product.create(productData); //! Cria um novo produto
};

const updateProduct = async (id, productData) => { //! Função para atualizar um produto existente
  const product = await Product.findByPk(id); //! Busca o produto pelo ID
  if (product) { //! Caso o produto não seja encontrado
    return await product.update(productData); //! Atualiza o produto
  }
  return null;
};

const deleteProduct = async (id) => { //! Função para deletar um produto
  const product = await Product.findByPk(id); //! Busca o produto pelo ID
  if (product) { //! Caso o produto não seja encontrado
    await product.destroy(); //! Deleta o produto
    return true; 
  }
  return false;
};

module.exports = { //! Exporta as funções
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
