const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../controllers/productController');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all products
router.get('/', protect, getProducts);

// Get low stock products
router.get('/low-stock', protect, getLowStockProducts);

// Get single product
router.get('/:id', protect, getProduct);

// Create new product
router.post(
  '/',
  protect,
  authorize('admin', 'manager'),
  upload.single('image'),
  createProduct
);

// Update product
router.put(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  upload.single('image'),
  updateProduct
);

// Delete product
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;