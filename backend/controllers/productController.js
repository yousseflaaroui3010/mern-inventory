const Product = require('../models/productModel');
const Transaction = require('../models/transactionModel');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getProducts = async (req, res) => {
  try {
    console.log('Fetching products with query:', req.query);
    
    // Base query
    let query = {};
    
    // Add search filter if provided
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    
    // Add category filter if provided
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Add stock level filters
    if (req.query.stockFilter) {
      switch (req.query.stockFilter) {
        case 'low':
          query.quantity = { $lte: '$minStockLevel' };
          break;
        case 'out':
          query.quantity = 0;
          break;
        case 'in':
          query.quantity = { $gt: 0 };
          break;
      }
    }
    
    console.log('Final query:', query);
    
    // Finding products
    let products = await Product.find(query)
      .populate('category', 'name')
      .populate('supplier', 'name')
      .sort('-createdAt');
    
    console.log(`Found ${products.length} products`);
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = products.length;
    
    // Slice the array for pagination
    products = products.slice(startIndex, endIndex);
    
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
      count: total,
      pagination,
      data: products
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
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
    console.log('Received product creation request:', req.body);
    
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
      console.log('Product with SKU already exists:', sku);
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
    
    console.log('Product created successfully:', product);
    
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
      console.log('Initial stock transaction created');
    }
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
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
    
    // Delete the product permanently
    await Product.findByIdAndDelete(req.params.id);
    
    // Also delete any associated transactions
    await Transaction.deleteMany({ product: req.params.id });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
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