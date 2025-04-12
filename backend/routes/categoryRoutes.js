const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Get all categories
router.get('/', protect, getCategories);

// Get single category
router.get('/:id', protect, getCategory);

// Create new category
router.post('/', protect, authorize('admin', 'manager'), createCategory);

// Update category
router.put('/:id', protect, authorize('admin', 'manager'), updateCategory);

// Delete category
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;