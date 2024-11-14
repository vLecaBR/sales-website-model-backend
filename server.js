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
const authenticateToken = require('./middlewares/authMiddleware'); // Middleware de autenticação JWT

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Conectar ao banco de dados
connectDB();

// Configuração do AdminJS com autenticação JWT
(async () => {
  const AdminJS = (await import('adminjs')).default;
  const AdminJSExpress = (await import('@adminjs/express')).default;

  // Configuração do painel AdminJS
  const adminJs = new AdminJS({
    resources: [User, Product],
    rootPath: '/admin',
  });

  // Middleware para autenticação de administradores no AdminJS
  const adminAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo');
      
      // Verifica se o usuário é administrador
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado. Somente administradores podem acessar.' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token inválido.' });
    }
  };

  // Define o AdminJS com o middleware de autenticação
  const adminJsRouter = AdminJSExpress.buildRouter(adminJs);
  app.use('/admin', adminAuthMiddleware, adminJsRouter); // Protege a rota admin com autenticação
})().catch(err => {
  console.error("Erro ao carregar AdminJS:", err);
});

// Usar rotas de usuários e produtos
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Sincroniza as tabelas no banco de dados
const syncDatabase = async () => {
  try {
    await User.sync();
    await Product.sync();
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

    const token = jwt.sign(
      { id: user.id, role: user.role }, // Inclui o role no token
      process.env.JWT_SECRET || 'seu_segredo',
      { expiresIn: '1h' }
    );

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
app.put('/api/update', authenticateToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    user.name = name;
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 8);
    }
    await user.save();
    res.json({ message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
