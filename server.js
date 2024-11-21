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

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração de CORS
app.use(cors());

// Conexão com o banco de dados
connectDB().then(() => {
  console.log('Conexão com o banco de dados estabelecida.');

  // Sincronização das tabelas
  const syncDatabase = async () => {
    try {
      await User.sync();
      await Product.sync({ alter: true });
      console.log('Tabelas sincronizadas com sucesso.');
    } catch (err) {
      console.error('Erro ao sincronizar tabelas:', err);
    }
  };
  syncDatabase();

  // Configuração do AdminJS
  (async () => {
    const { default: AdminJS } = await import('adminjs');
    const AdminJSExpress = await import('@adminjs/express');
    const AdminJSSequelize = await import('@adminjs/sequelize');

    AdminJS.registerAdapter(AdminJSSequelize);

    const adminJs = new AdminJS({
      databases: [sequelize], // Conexão com o banco de dados
      resources: [
        {
          resource: Product,
          options: {
            listProperties: ['id', 'name', 'price', 'description', 'conteudoCaixa'],
            editProperties: ['name', 'price', 'description', 'conteudoCaixa', 'image'],
            filterProperties: ['name', 'price'],
            showProperties: ['id', 'name', 'price', 'description', 'conteudoCaixa', 'image'],
            properties: {
              conteudoCaixa: {
                type: 'textarea', // Exibe como um campo de texto
                isMultiline: true, // Permite várias linhas no campo de edição
                custom: {
                  // Ao exibir os dados, converte o conteúdo JSONB para uma string com cada item em uma nova linha
                  parse: (value) => {
                    if (Array.isArray(value)) {
                      return value.join('\n'); // Exibe como uma lista de itens
                    }
                    return ''; // Se não houver dados, retorna vazio
                  },
                  // Ao salvar, converte a string de volta para um array JSON
                  format: (value) => {
                    if (value) {
                      return value.split('\n').map(item => item.trim()); // Converte a string de volta para um array de strings
                    }
                    return []; // Caso não haja dados, retorna um array vazio
                  }
                }
              },
            },
          }
        },
        { resource: User, options: {} },
      ],
      rootPath: '/admin',
    });

    // Rota de autenticação do AdminJS
    const adminJsRouter = AdminJSExpress.buildAuthenticatedRouter(
      adminJs,
      {
        authenticate: async (email, password) => {
          const user = await User.findOne({ where: { email } });
          if (user && (await bcrypt.compare(password, user.password))) {
            return user;
          }
          return null;
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

    // AdminJS deve ser configurado antes de middlewares de parsing
    app.use(adminJs.options.rootPath, adminJsRouter);
    console.log(`AdminJS configurado em http://localhost:${PORT}/admin`);

    // Middlewares para parsing de JSON e URL-encoded (após o AdminJS)
    app.use(express.json());  // Parsing JSON
    app.use(express.urlencoded({ extended: true }));  // Parsing URL-encoded

    // Rotas da API
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);

    // Rota de cadastro de usuário
    app.post('/api/cadastro', async (req, res) => {
      try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email já está em uso!' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
          role: role || 'user',
        });

        res.status(201).json({
          message: 'Usuário cadastrado com sucesso!',
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
        });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });

    // Rota para criar produto
    app.post('/api/products', authenticateToken, async (req, res) => {
      try {
        const { name, price, description, conteudoCaixa, image } = req.body;

        if (!name || !price) {
          return res.status(400).json({ message: 'Nome e preço são obrigatórios!' });
        }

        const newProduct = await Product.create({
          name,
          price,
          description,
          conteudoCaixa,
          image,
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

    // Rota de login
    app.post('/api/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'Email ou senha inválidos!' });
        }

        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET || 'seu_segredo',
          { expiresIn: '1h' }
        );

        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // Rota de atualização do usuário
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

    // Inicializa o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })();
}).catch((err) => {
  console.error('Erro ao conectar ao banco de dados:', err);
});
