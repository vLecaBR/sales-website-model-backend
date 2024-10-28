const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, productController.createProduct); // Protegido
router.put('/:id', authMiddleware, productController.updateProduct); // Protegido
router.delete('/:id', authMiddleware, productController.deleteProduct); // Protegido

module.exports = router;
