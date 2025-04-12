const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  getProductTransactions,
  getTransactionsSummary
} = require('../controllers/transactionController');

// Get all transactions
router.get('/', protect, getTransactions);

// Get transactions summary
router.get('/summary', protect, getTransactionsSummary);

// Get transactions for a specific product
router.get('/product/:productId', protect, getProductTransactions);

// Get single transaction
router.get('/:id', protect, getTransaction);

// Create new transaction
router.post('/', protect, createTransaction);

module.exports = router;