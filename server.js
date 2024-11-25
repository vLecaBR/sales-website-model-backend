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

const app = express(); //! Cria a aplicação Express
const PORT = process.env.PORT || 5000; //! Define a porta do servidor

app.use(cors()); //! Habilita o CORS para a aplicação

connectDB().then(() => { //! Conecta ao banco de dados
  console.log('Conexão com o banco de dados estabelecida.');

  const syncDatabase = async () => { //! Sincroniza as tabelas com o banco de dados
    try { //! Tenta sincronizar as tabelas
      await User.sync(); //! Sincroniza a tabela de usuários
      await Product.sync({ alter: true }); //! Sincroniza a tabela de produtos
      console.log('Tabelas sincronizadas com sucesso.');
    } catch (err) { //! Em caso de erro
      console.error('Erro ao sincronizar tabelas:', err);
    }
  };
  syncDatabase(); //! Chama a função de sincronização das tabelas

  {/* AdminJS */}
  (async () => { //! Função assíncrona para configurar o AdminJS
    const { default: AdminJS } = await import('adminjs'); //! Importa o AdminJS
    const AdminJSExpress = await import('@adminjs/express'); //! Importa o AdminJS Express
    const AdminJSSequelize = await import('@adminjs/sequelize'); //! Importa o AdminJS Sequelize

    AdminJS.registerAdapter(AdminJSSequelize); //! Registra o adaptador do Sequelize

    const adminJs = new AdminJS({ //! Cria uma instância do AdminJS
      databases: [sequelize], //! Adiciona o banco de dados Sequelize
      resources: [ //! Adiciona os recursos (tabelas) do AdminJS
        {
          resource: Product, //! Recurso da tabela de produtos
          options: { //! Opções do recurso
            listProperties: ['id', 'name', 'price', 'description', 'conteudoCaixa'], //! Propriedades exibidas na lista
            editProperties: ['name', 'price', 'description', 'conteudoCaixa', 'image'], //! Propriedades exibidas no formulário de edição
            filterProperties: ['name', 'price'], //! Propriedades disponíveis para filtragem
            showProperties: ['id', 'name', 'price', 'description', 'conteudoCaixa', 'image'], //! Propriedades exibidas na visualização
            properties: { //! Propriedades personalizadas
              conteudoCaixa: { //! Propriedade conteudoCaixa
                type: 'textarea', //! Exibe como um campo de texto
                isMultiline: true, //! Permite várias linhas no campo de edição
                custom: {
                  //! Configurações personalizadas para a propriedade
                  parse: (value) => {
                    if (Array.isArray(value)) {
                      return value.join('\n'); //! Converte o array para uma string separada por quebras de linha
                    }
                    return ''; //! Caso não haja dados, retorna uma string vazia
                  },
                  //! Configuração para converter a string de volta para um array de strings
                  format: (value) => {
                    if (value) {
                      return value.split('\n').map(item => item.trim()); //! Divide a string em um array de strings
                    }
                    return []; //! Caso não haja dados, retorna um array vazio
                  }
                }
              },
              description: {
                type: 'textarea', //! Exibe como um campo de texto
                isMultiline: true, //! Permite várias linhas no campo de edição
              }
            },
          }
        },
        { resource: User, options: {} }, //! Recurso da tabela de usuários
      ],
      rootPath: '/admin', //! Define o caminho da interface do AdminJS
    });

    {/*Rota de autenticação do AdminJS*/}
    const adminJsRouter = AdminJSExpress.buildAuthenticatedRouter( //! Cria o roteador autenticado do AdminJS
      adminJs,
      {
        authenticate: async (email, password) => { //! Função de autenticação
          const user = await User.findOne({ where: { email } }); //! Busca o usuário pelo email
          if (user && (await bcrypt.compare(password, user.password))) { //! Verifica se o usuário existe e a senha está correta
            return user; //! Retorna o usuário autenticado
          }
          return null; //! Retorna nulo caso a autenticação falhe
        },
        cookiePassword: process.env.COOKIE_SECRET || 'uma-senha-secreta', //! Senha do cookie de autenticação
      },
      null, //! Middleware de autorização (não utilizado)
      {
        resave: false, //! Não salva a sessão a cada requisição
        saveUninitialized: true, //! Salva a sessão mesmo que não tenha sido inicializada
        secret: process.env.COOKIE_SECRET || 'uma-senha-secreta', //! Senha do cookie de autenticação
      }
    );

    app.use(adminJs.options.rootPath, adminJsRouter); //! Adiciona o roteador do AdminJS à aplicação
    console.log(`AdminJS configurado em http://localhost:${PORT}/admin`); //! Exibe a URL de acesso ao AdminJS

    {/*Middlewares para parsing de JSON e URL-encoded (após o AdminJS)*/}
    app.use(express.json());  //! Parsing JSON
    app.use(express.urlencoded({ extended: true }));  //! Parsing URL-encoded

    {/*Rotas da API*/}
    app.use('/api/users', userRoutes); //! Adiciona as rotas de usuários
    app.use('/api/products', productRoutes); //! Adiciona as rotas de produtos

    {/*Rota de cadastro de usuário*/}
    app.post('/api/cadastro', async (req, res) => {
      try { //! Tenta cadastrar o usuário
        const { name, email, password, role } = req.body; //! Extrai os dados do corpo da requisição

        const existingUser = await User.findOne({ where: { email } }); //! Busca um usuário com o email informado
        if (existingUser) { //! Se o usuário já existir com o email informado retorna um erro
          return res.status(400).json({ message: 'Email já está em uso!' });
        }

        const hashedPassword = await bcrypt.hash(password, 8); //! Gera o hash da senha
        const newUser = await User.create({ //! Cria um novo usuário
          name,
          email,
          password: hashedPassword,
          role: role || 'user',
        });

        res.status(201).json({ //! Retorna o usuário cadastrado
          message: 'Usuário cadastrado com sucesso!', //! Mensagem de sucesso
          user: { //! Dados do usuário
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
        });
      } catch (err) { //! Em caso de erro
        res.status(400).json({ message: err.message });
      }
    });

    {/*Rota para criar produto*/}
    app.post('/api/products', authenticateToken, async (req, res) => { 
      try { //! Tenta criar o produto
        const { name, price, description, conteudoCaixa, image } = req.body; //! Extrai os dados do corpo da requisição
    
        if (!name || !price) { //! Verifica se o nome e o preço foram informados
          return res.status(400).json({ message: 'Nome e preço são obrigatórios!' }); 
        }
    
        const newProduct = await Product.create({ //! Cria um novo produto
          name,
          price,
          description,
          conteudoCaixa: Array.isArray(conteudoCaixa) ? conteudoCaixa : [], //! Garante que é um array
          image,
        });
    
        res.status(201).json({ //! Retorna o produto criado
          message: 'Produto criado com sucesso!', 
          product: newProduct, 
        });
      } catch (err) {
        console.error(err); //! Em caso de erro
        res.status(500).json({ message: 'Erro ao criar o produto.' });
      }
    });    

    {/*Rota de login*/}
    app.post('/api/login', async (req, res) => {
      try { //! Tenta fazer o login
        const { email, password } = req.body; //! Extrai os dados do corpo da requisição
        const user = await User.findOne({ where: { email } }); //! Busca o usuário pelo email

        if (!user || !(await bcrypt.compare(password, user.password))) { //! Verifica se o usuário existe e a senha está correta
          return res.status(401).json({ message: 'Email ou senha inválidos!' }); //! Retorna um erro de autenticação
        }

        const token = jwt.sign( //! Gera um token de autenticação
          { id: user.id, role: user.role }, //! Dados do token
          process.env.JWT_SECRET || 'seu_segredo', //! Segredo do token
          { expiresIn: '1h' } //! Tempo de expiração do token
        );

        res.json({ //! Retorna o token e os dados do usuário
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      } catch (err) { //! Em caso de erro
        res.status(500).json({ message: err.message });
      }
    });

    {/*Rota de atualização do usuário*/}
    app.put('/api/update', authenticateToken, async (req, res) => {
      try { //! Tenta atualizar o usuário
        const { name, email, password } = req.body; //! Extrai os dados do corpo da requisição
        const userId = req.user.id; //! Obtém o ID do usuário autenticado

        const user = await User.findByPk(userId); //! Busca o usuário pelo ID
        if (!user) { //! Se o usuário não existir, retorna um erro
          return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        user.name = name; //! Atualiza o nome do usuário
        user.email = email; //! Atualiza o email do usuário
        if (password) { //! Se a senha foi informada, atualiza a senha
          user.password = await bcrypt.hash(password, 8); //! Gera o hash da nova senha
        }
        await user.save(); //! Salva as alterações no banco de dados

        res.json({ message: 'Usuário atualizado com sucesso!' }); 
      } catch (err) { //! Em caso de erro
        res.status(500).json({ message: err.message });
      }
    });

    {/*Inicializa o servidor*/}
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`); //! Exibe a mensagem de sucesso
    });
  })();
}).catch((err) => { //! Em caso de erro na conexão com o banco de dados
  console.error('Erro ao conectar ao banco de dados:', err);
});
