require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB, sequelize } = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authenticateToken = require('./middlewares/authMiddleware');
const adminAuthMiddleware = require('./middlewares/adminAuthMiddleware');
const bodyParser = require('body-parser'); // Importando o body-parser

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Middleware de parsing do corpo antes de configurar AdminJS
app.use(express.json());  // Middleware de JSON
app.use(express.urlencoded({ extended: false }));  // Middleware de URL-encoded

// Conectar ao banco de dados antes de iniciar o servidor
connectDB().then(() => {
  console.log('Conexão com o banco de dados estabelecida com sucesso.');

  // Sincronizar as tabelas depois que a conexão for bem-sucedida
  const syncDatabase = async () => {
    try {
      await User.sync();     // Sincroniza a tabela User
      await Product.sync({ alter: true });  // Força a atualização da tabela Product
      console.log('Tabelas criadas ou atualizadas com sucesso.');
    } catch (error) {
      console.error('Erro ao criar ou atualizar as tabelas:', error);
    }
  };
  syncDatabase();

  // Usar rotas de usuários e produtos
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);

  // **Agora, Configuração do AdminJS deve ser feita após a definição dos middlewares de JSON e URL-encoded**
  (async () => {
    try {
      const { default: AdminJS } = await import('adminjs');
      const AdminJSExpress = await import('@adminjs/express');
      const AdminJSSequelize = await import('@adminjs/sequelize');

      // Registrar o adaptador do Sequelize
      AdminJS.registerAdapter(AdminJSSequelize);

      // Configuração do painel AdminJS
      const adminJs = new AdminJS({
        databases: [sequelize],  // Adiciona o sequelize aqui para o AdminJS
        resources: [User, Product],  // Adiciona seus modelos ao painel
        rootPath: '/admin',
      });

      // Configuração da autenticação para o painel
      const adminJsRouter = AdminJSExpress.buildAuthenticatedRouter(
        adminJs,
        {
          authenticate: async (email, password) => {
            // Buscar o usuário com o email informado
            const user = await User.findOne({ where: { email } });

            // Verificar se o usuário existe e se a senha confere
            if (user && (await bcrypt.compare(password, user.password))) {
              return user;  // Retorna o usuário para autenticação
            }
            return null;  // Se a senha for inválida
          },
          cookiePassword: process.env.COOKIE_SECRET || 'uma-senha-secreta',
        },
        null,
        {
          resave: false,
          saveUninitialized: true,
          secret: process.env.COOKIE_SECRET || 'uma-senha-secreta',
        }
      );

      // Protegendo o painel AdminJS com o middleware de autenticação JWT
      app.use(adminJs.options.rootPath, adminJsRouter);

      console.log(`AdminJS configurado com sucesso! Acesse http://localhost:${PORT}/admin`);
    } catch (err) {
      console.error('Erro ao configurar AdminJS:', err);
    }
  })();

  // **Agora, o body-parser é configurado depois do AdminJS**
  app.use(bodyParser.json());  // Adiciona o body-parser explicitamente
  app.use(bodyParser.urlencoded({ extended: false }));  // Configuração do body-parser para URL-encoded

  // Inicia o servidor
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch((err) => {
  console.error('Erro ao conectar com o banco de dados:', err);
});

// Rota para cadastro de usuários
app.post('/api/cadastro', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar se o e-mail já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso!' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 8);

    // Criar novo usuário com o papel informado
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Se não for fornecido, assume 'user' como default
    });

    // Resposta ao cliente
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,  // Retorna o role no objeto do usuário
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para criar um novo produto
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { name, price, description, conteudoCaixa, image } = req.body;

    // Verificar se todos os campos necessários foram fornecidos
    if (!name || !price) {
      return res.status(400).json({ message: 'Nome e preço são obrigatórios!' });
    }

    const newProduct = await Product.create({
      name,
      price,
      description,
      conteudoCaixa,  // Campo com o conteúdo da caixa
      image,          // Novo campo para a URL da imagem
    });

    res.status(201).json({
      message: 'Produto criado com sucesso!',
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar o produto.' });
  }
});

// Rota para login de usuários
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email ou senha inválidos!' });
    }

    // Agora o role do usuário é incluído no token
    const role = user.role; // O papel do usuário vem do banco de dados

    const token = jwt.sign(
      { id: user.id, role: user.role },  // Inclua role no payload do JWT
      process.env.JWT_SECRET || 'seu_segredo',
      { expiresIn: '1h' }
    );
    
    // Retorna o token e os dados do usuário, incluindo o role
    res.json({
      token,  // Token com role incluído
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role  // Inclui o role no retorno da resposta
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
