// controllers/userController.js
const UserService = require('../services/userService');

//! Função para cadastrar um novo usuário
const register = async (req, res) => {
  try { //! Tenta cadastrar um novo usuário
    const { name, email, password } = req.body; //! Pega os dados do corpo da requisição
    const user = await UserService.registerUser(name, email, password); //! Função para cadastrar um novo usuário
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user }); //! Retorna o usuário cadastrado
  } catch (err) { //! Caso ocorra um erro retorna a mensagem de erro
    res.status(400).json({ message: err.message }); 
  }
};

  //! Função para logar um usuário
const login = async (req, res) => {
  try { //! Tenta logar o usuário
    const { email, password } = req.body; //! Pega os dados do corpo da requisição
    const { token, user } = await UserService.loginUser(email, password); //! Função para logar o usuário
    res.json({ token, user }); //! Retorna o token e o usuário logado
  } catch (err) { //! Caso ocorra um erro retorna a mensagem de erro
    res.status(401).json({ message: err.message });
  }
};

//! Função para atualizar um usuário
const update = async (req, res) => {
  try { //! Tenta atualizar o usuário
    const { name, email, password } = req.body; //! Pega os dados do corpo da requisição
    const token = req.headers.authorization.split(' ')[1]; //! Pega o token do cabeçalho da requisição
    const updatedUser = await UserService.updateUser(token, name, email, password); //! Função para atualizar o usuário
    res.json({ message: 'Usuário atualizado com sucesso!', updatedUser }); //! Retorna o usuário atualizado
  } catch (err) { //! Caso ocorra um erro retorna a mensagem de erro
    res.status(500).json({ message: err.message });
  }
};

module.exports = { //! Exporta as funções
  register,
  login,
  update,
};
