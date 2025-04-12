const Product = require('../models/productModel');
const Transaction = require('../models/transactionModel');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getProducts = async (req, res) => {
  try {
    const query = { ...req.query };
    
    // Create query string
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding products
    let products = Product.find(JSON.parse(queryStr)).populate('category', 'name').populate('supplier', 'name');
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      products = products.sort(sortBy);
    } else {
      products = products.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(JSON.parse(queryStr));
    
    products = await products.skip(startIndex).limit(limit);
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('supplier', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin/Manager)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      sku,
      category,
      quantity,
      unitOfMeasure,
      unitPrice,
      currency,
      costPrice,
      minStockLevel,
      location,
      supplier,
      barcode
    } = req.body;
    
    // Check if product with same SKU exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }
    
    const product = await Product.create({
      name,
      description,
      sku,
      category,
      quantity,
      unitOfMeasure,
      unitPrice,
      currency,
      costPrice,
      minStockLevel,
      location,
      supplier,
      barcode,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      lastRestockDate: quantity > 0 ? Date.now() : undefined
    });
    
    // Create initial stock transaction if quantity > 0
    if (quantity > 0) {
      await Transaction.create({
        type: 'restock',
        product: product._id,
        quantity,
        unitPrice: costPrice || unitPrice,
        total: quantity * (costPrice || unitPrice),
        notes: 'Initial stock',
        performedBy: req.user._id
      });
    }
    
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Manager)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Handle SKU uniqueness
    if (req.body.sku && req.body.sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku: req.body.sku });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this SKU already exists' });
      }
    }
    
    // Handle image upload
    if (req.file) {
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product has transactions
    const transactions = await Transaction.find({ product: req.params.id });
    if (transactions.length > 0) {
      // Instead of deleting, mark as inactive
      product.isActive = false;
      await product.save();
      return res.json({ message: 'Product marked as inactive due to existing transactions' });
    }
    
    await product.remove();
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$minStockLevel'] },
      isActive: true
    }).populate('category', 'name');
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};