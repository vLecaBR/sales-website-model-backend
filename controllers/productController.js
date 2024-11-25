// controllers/productController.js
const Product = require('../models/Product');
const authenticateToken = require('../middlewares/authMiddleware');

//! Função para pegar todos os produtos
exports.getAllProducts = async (req, res) => {
  try { //! Tenta pegar todos os produtos
    const products = await Product.findAll(); //! Função para pegar todos os produtos
    res.json(products); //! Retorna os produtos em formato JSON
  } catch (err) { //! Caso ocorra um erro
    res.status(500).json({ message: err.message });
  }
};

//! Função para pegar um produto específico pelo ID
exports.getProductById = async (req, res) => {
  try { //! Tenta pegar um produto pelo ID
    const product = await Product.findByPk(req.params.id); //! Função para pegar um produto pelo ID
    if (!product) { //! Caso o produto não seja encontrado
      return res.status(404).json({ message: 'Produto não encontrado!' }); //! Retorna uma mensagem de erro
    }
    res.json(product); //! Retorna o produto em formato JSON
  } catch (err) { //! Caso ocorra um erro
    res.status(500).json({ message: err.message });
  }
};

//! Função para criar um novo produto
exports.createProduct = async (req, res) => {
  try { //! Tenta criar um novo produto
    const { name, price, description, conteudoCaixa, image } = req.body; //! Pega os dados do corpo da requisição

    //! Garantindo que conteudoCaixa seja um array, caso venha como string separada por vírgulas
    const formattedConteudoCaixa = Array.isArray(conteudoCaixa)
      ? conteudoCaixa //! Se já for um array, usa diretamente
      : conteudoCaixa ? conteudoCaixa.split(',').map(item => item.trim()) : []; //! Caso seja string, transforma em array

    //! Criando o novo produto no banco
    const newProduct = await Product.create({
      name,
      price,
      description,
      conteudoCaixa: formattedConteudoCaixa,  //! Salvando o campo como array
      image
    });

    res.status(201).json(newProduct); //! Retorna o novo produto criado
  } catch (err) { //! Caso ocorra um erro
    console.error('Erro ao criar produto:', err.message);
    res.status(500).json({ message: err.message });
  }
};

//! Função para atualizar um produto existente
exports.updateProduct = async (req, res) => {
  try { //! Tenta atualizar um produto
    const product = await Product.findByPk(req.params.id); //! Busca o produto pelo ID
    if (!product) { //! Caso o produto não seja encontrado mensagem de erro
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }

    const { name, price, description, conteudoCaixa, image } = req.body; //! Pega os dados do corpo da requisição

    //! Garantindo que conteudoCaixa seja um array, caso venha como string separada por vírgulas
    const updatedConteudoCaixa = Array.isArray(conteudoCaixa)
      ? conteudoCaixa //! Se já for um array, usa diretamente
      : conteudoCaixa ? conteudoCaixa.split(',').map(item => item.trim()) : []; //! Caso seja string, transforma em array

    //! Atualizando o produto com os novos dados
    await product.update({
      name,
      price,
      description,
      conteudoCaixa: updatedConteudoCaixa,  //! Atualizando o campo com o novo valor
      image
    });

    res.json(product); //! Retorna o produto atualizado
  } catch (err) {  //! Caso ocorra um erro
    res.status(500).json({ message: err.message });
  }
};

//! Função para excluir um produto
exports.deleteProduct = async (req, res) => {
  try { //! Tenta excluir um produto
    const product = await Product.findByPk(req.params.id); //! Busca o produto pelo ID
    if (!product) { //! Caso o produto não seja encontrado mensagem de erro
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }
    await product.destroy();
    res.status(204).send(); //! Retorna uma resposta vazia
  } catch (err) { //! Caso ocorra um erro mensagem de erro
    res.status(500).json({ message: err.message });
  }
};

//! Middleware para autenticação
exports.authenticateToken = authenticateToken;
