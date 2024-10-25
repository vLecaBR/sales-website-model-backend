// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas de usuários
router.post('/cadastro', userController.register);
router.post('/login', userController.login);
router.put('/update', authMiddleware, userController.update);

module.exports = router;
