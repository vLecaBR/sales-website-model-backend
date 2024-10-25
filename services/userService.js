// services/userService.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error('Email já está em uso!');

  const hashedPassword = await bcrypt.hash(password, 8);
  const newUser = await User.create({ name, email, password: hashedPassword });
  return { id: newUser.id, name: newUser.name, email: newUser.email };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Email ou senha inválidos!');
  }

  const token = jwt.sign({ id: user.id }, 'seu_segredo', { expiresIn: '1h' });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

const updateUser = async (token, name, email, password) => {
  const decoded = jwt.verify(token, 'seu_segredo');
  const user = await User.findByPk(decoded.id);
  if (!user) throw new Error('Usuário não encontrado!');

  user.name = name;
  user.email = email;
  if (password) user.password = await bcrypt.hash(password, 8);
  await user.save();
  return { id: user.id, name: user.name, email: user.email };
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
};
