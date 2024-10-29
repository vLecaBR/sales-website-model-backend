const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); // Ajuste o caminho se necessário

// Rotas de produtos
router.get('/', productController.getAllProducts); // Não protegido
router.get('/:id', productController.getProductById); // Não protegido
router.post('/', authMiddleware, productController.createProduct); // Protegido
router.put('/:id', authMiddleware, productController.updateProduct); // Protegido
router.delete('/:id', authMiddleware, productController.deleteProduct); // Protegido

module.exports = router;
