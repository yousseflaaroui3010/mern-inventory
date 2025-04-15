const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  sku: {
    type: String,
    unique: true,
    trim: true,
    sparse: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  quantity: {
    type: Number,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  unitOfMeasure: {
    type: String,
    default: 'piece',
    enum: ['piece', 'kg', 'g', 'mg', 'L', 'ml', 'box', 'pack', 'set', 'pair', 'other']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Please add a unit price'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'MAD',
    enum: ['MAD', 'USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  minStockLevel: {
    type: Number,
    default: 0,
    min: [0, 'Min stock level cannot be negative']
  },
  location: {
    type: String
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  imageUrl: {
    type: String
  },
  barcode: {
    type: String
  },
  lastRestockDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the "updatedAt" field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-generate SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = 'SKU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);