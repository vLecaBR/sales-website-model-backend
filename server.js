// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB } = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product'); // Importando o modelo de produto
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); // Importando as rotas de produtos



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Conectar ao banco de dados
connectDB();

// Usar rotas de usuários
app.use('/api/users', userRoutes);

// Usar rotas de produtos
app.use('/api/products', productRoutes); // Adicionando as rotas de produtos

// Criar as tabelas no banco de dados (caso não existam)
const syncDatabase = async () => {
  try {
    await User.sync(); // Sincroniza a tabela de usuários
    await Product.sync(); // Sincroniza a tabela de produtos
    console.log('Tabelas criadas ou atualizadas com sucesso.');
  } catch (error) {
    console.error('Erro ao criar ou atualizar as tabelas:', error);
  }
};
syncDatabase();

// Rota para cadastro de usuários
app.post('/api/cadastro', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso!' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para login de usuários
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Email ou senha inválidos!' });
    }

    const token = jwt.sign({ id: user.id }, 'seu_segredo', { expiresIn: '1h' });

    // Incluindo dados do usuário na resposta
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para atualizar informações do usuário
app.put('/api/update', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const token = req.headers.authorization.split(' ')[1]; // Extrai o token do cabeçalho
    const decoded = jwt.verify(token, 'seu_segredo'); // Verifica o token
    const userId = decoded.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Atualiza os campos do usuário
    user.name = name;
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 8); // Atualiza a senha se fornecida
    }
    await user.save(); // Salva as alterações
    res.json({ message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
