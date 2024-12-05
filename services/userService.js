// services/userService.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (name, email, password) => { //! Função para cadastrar um novo usuário
  const existingUser = await User.findOne({ where: { email } }); //! Busca um usuário pelo email
  if (existingUser) throw new Error('Email já está em uso!'); //! Caso o usuário já exista, retorna um erro

  const hashedPassword = await bcrypt.hash(password, 8); //! Criptografa a senha
  const newUser = await User.create({ name, email, password: hashedPassword }); //! Cria um novo usuário
  return { id: newUser.id, name: newUser.name, email: newUser.email }; //! Retorna o usuário criado
};

const loginUser = async (email, password) => { //! Função para logar um usuário
  const user = await User.findOne({ where: { email } }); //! Busca um usuário pelo email
  if (!user || !(await bcrypt.compare(password, user.password))) { //! Caso o usuário não exista ou a senha esteja incorreta
    throw new Error('Email ou senha inválidos!'); //! Retorna uma mensagem de erro
  }

  const token = jwt.sign({ id: user.id }, 'seu_segredo', { expiresIn: '1h' }); //! Gera um token de autenticação
  return { token, user: { id: user.id, name: user.name, email: user.email } }; //! Retorna o token e o usuário logado
};

const updateUser = async (token, name, email, password) => { //! Função para atualizar um usuário
  const decoded = jwt.verify(token, 'seu_segredo'); //! Verifica o token
  const user = await User.findByPk(decoded.id); //! Busca o usuário pelo ID
  if (!user) throw new Error('Usuário não encontrado!'); //! Caso o usuário não seja encontrado

  user.name = name; //! Atualiza o nome do usuário
  user.email = email; //! Atualiza o email do usuário
  if (password) user.password = await bcrypt.hash(password, 8); //! Caso a senha seja informada, criptografa a senha
  await user.save(); //! Salva as alterações no banco de dados
  return { id: user.id, name: user.name, email: user.email }; //! Retorna o usuário atualizado
};

module.exports = { //! Exporta as funções
  registerUser,
  loginUser,
  updateUser,
};
