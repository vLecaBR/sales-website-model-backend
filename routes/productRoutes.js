// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

//! Rotas públicas
router.get('/', productController.getAllProducts); //! Acesso público
router.get('/:id', productController.getProductById); //! Acesso público

//! Rotas protegidas (requer autenticação)
router.post('/', authMiddleware, productController.createProduct); //! Protegido
router.put('/:id', authMiddleware, productController.updateProduct); //! Protegido
router.delete('/:id', authMiddleware, productController.deleteProduct); //! Protegido

module.exports = router;
