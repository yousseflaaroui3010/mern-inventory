// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../controllers/productController');

// Get all products
router.get('/', protect, getProducts);

// Get low stock products
router.get('/low-stock', protect, getLowStockProducts);

// Get single product
router.get('/:id', protect, getProduct);

// Create new product
router.post('/', protect, authorize('admin', 'manager'), createProduct);

// Update product
router.put('/:id', protect, authorize('admin', 'manager'), updateProduct);

// Delete product
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;