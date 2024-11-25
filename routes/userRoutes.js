// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

//! Rotas de usuários
router.post('/cadastro', userController.register); //! Rota pública
router.post('/login', userController.login); //! Rota pública
router.put('/update', authMiddleware, userController.update); //! Rota protegida

module.exports = router;
