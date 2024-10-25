// controllers/userController.js
const UserService = require('../services/userService');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserService.registerUser(name, email, password);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await UserService.loginUser(email, password);
    res.json({ token, user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const updatedUser = await UserService.updateUser(token, name, email, password);
    res.json({ message: 'Usuário atualizado com sucesso!', updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  update,
};
