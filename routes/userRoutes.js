// routes/userRoutes.js
const express = require('express'); //! Importa o express
const router = express.Router(); //! Cria um objeto de rotas
const userController = require('../controllers/userController'); //! Importa o controller de usuários
const authMiddleware = require('../middlewares/authMiddleware'); //! Importa o middleware de autenticação

//! Rotas de usuários
router.post('/cadastro', userController.register); //! Rota pública
router.post('/login', userController.login); //! Rota pública
router.put('/update', authMiddleware, userController.update); //! Rota protegida

module.exports = router;
