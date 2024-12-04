require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Para realizar requisições HTTP
const { connectDB, sequelize } = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authenticateToken = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB().then(() => {
  console.log('Conexão com o banco de dados estabelecida.');

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

  (async () => {
    const { default: AdminJS } = await import('adminjs');
    const AdminJSExpress = await import('@adminjs/express');
    const AdminJSSequelize = await import('@adminjs/sequelize');

    AdminJS.registerAdapter(AdminJSSequelize);

    const adminJs = new AdminJS({
      databases: [sequelize],
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
                type: 'textarea',
                isMultiline: true,
                custom: {
                  parse: (value) => (Array.isArray(value) ? value.join('\n') : ''),
                  format: (value) => (value ? value.split('\n').map((item) => item.trim()) : []),
                },
              },
              description: { type: 'textarea', isMultiline: true },
            },
          },
        },
        { resource: User, options: {} },
      ],
      rootPath: '/admin',
    });

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

    app.use(adminJs.options.rootPath, adminJsRouter);

    // Rota para cálculo de frete
    app.post('/api/calcular-frete', async (req, res) => {
      const { cepOrigem, cepDestino, peso, comprimento, altura, largura } = req.body;

      try {
        const response = await axios.get('http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx', {
          params: {
            sCepOrigem: cepOrigem,
            sCepDestino: cepDestino,
            nVlPeso: peso,
            nCdFormato: 1, // Caixa ou pacote
            nVlComprimento: comprimento,
            nVlAltura: altura,
            nVlLargura: largura,
            nCdServico: '40010', // Código do serviço (ex: SEDEX)
            nVlDiametro: 0,
            StrRetorno: 'json',
            nCdEmpresa: '',
            sDsSenha: '',
          },
        });

        res.json(response.data);
      } catch (error) {
        console.error('Erro ao calcular o frete:', error.message);
        res.status(500).json({ message: 'Erro ao calcular o frete. Verifique os dados fornecidos.' });
      }
    });

    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);

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
          conteudoCaixa: Array.isArray(conteudoCaixa) ? conteudoCaixa : [],
          image,
        });

        res.status(201).json({ message: 'Produto criado com sucesso!', product: newProduct });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao criar o produto.' });
      }
    });

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

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })();
}).catch((err) => {
  console.error('Erro ao conectar ao banco de dados:', err);
});