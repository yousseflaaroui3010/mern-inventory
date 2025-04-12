const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

// Get all suppliers
router.get('/', protect, getSuppliers);

// Get single supplier
router.get('/:id', protect, getSupplier);

// Create new supplier
router.post('/', protect, authorize('admin', 'manager'), createSupplier);

// Update supplier
router.put('/:id', protect, authorize('admin', 'manager'), updateSupplier);

// Delete supplier
router.delete('/:id', protect, authorize('admin'), deleteSupplier);


router.get('/', (req, res) => {
    res.json({ message: 'Supplier routes working' });
  });

  
module.exports = router;