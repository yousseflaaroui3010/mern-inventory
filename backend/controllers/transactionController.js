// controllers/transactionController.js
const Transaction = require('../models/transactionModel');
const Product = require('../models/productModel');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('product', 'name sku')
      .populate('performedBy', 'username')
      .sort('-date');
    
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('product', 'name sku category unitOfMeasure unitPrice currency')
      .populate('performedBy', 'username');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res) => {
  try {
    const { type, product: productId, quantity, unitPrice, notes } = req.body;
    
    // Validate transaction type
    if (!['restock', 'sale', 'adjustment', 'return', 'transfer'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }
    
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Calculate transaction quantity based on type
    let transactionQuantity = Math.abs(quantity);
    if (['sale', 'transfer'].includes(type)) {
      transactionQuantity = -Math.abs(quantity); // Negative for outgoing inventory
    }
    
    // Check if there's enough stock for outgoing transactions
    if (transactionQuantity < 0 && (product.quantity + transactionQuantity < 0)) {
      return res.status(400).json({ 
        message: 'Not enough stock available',
        available: product.quantity,
        requested: Math.abs(transactionQuantity)
      });
    }
    
    // Create transaction
    const transaction = await Transaction.create({
      type,
      product: productId,
      quantity: transactionQuantity,
      unitPrice: unitPrice || product.unitPrice,
      total: Math.abs(transactionQuantity) * (unitPrice || product.unitPrice),
      notes,
      performedBy: req.user._id
    });
    
    // Update product quantity
    product.quantity += transactionQuantity;
    
    // Update lastRestockDate if this is a restock transaction
    if (type === 'restock') {
      product.lastRestockDate = Date.now();
    }
    
    await product.save();
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get transactions for a specific product
// @route   GET /api/transactions/product/:productId
// @access  Private
exports.getProductTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ product: req.params.productId })
      .populate('performedBy', 'username')
      .sort('-date');
    
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get transactions summary by date range
// @route   GET /api/transactions/summary
// @access  Private
exports.getTransactionsSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate dates
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate) : new Date();
    
    // Set end date to end of day
    end.setHours(23, 59, 59, 999);
    
    // Build match stage for aggregation
    const matchStage = {
      date: {
        $gte: start,
        $lte: end
      }
    };
    
    // Aggregate transactions by type
    const summary = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Aggregate by day
    const dailySummary = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            type: '$type'
          },
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$total' }
        }
      },
      { 
        $sort: { 
          '_id.date': 1,
          '_id.type': 1 
        } 
      }
    ]);
    
    res.json({
      summary,
      dailySummary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};