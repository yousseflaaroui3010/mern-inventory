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
    required: [true, 'Please add a SKU'],
    unique: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please add a category']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add a quantity'],
    min: [0, 'Quantity cannot be negative']
  },
  unitOfMeasure: {
    type: String,
    required: [true, 'Please add a unit of measure'],
    enum: ['piece', 'kg', 'g', 'mg', 'L', 'ml', 'box', 'pack', 'set', 'pair', 'other']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Please add a unit price'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Please specify currency'],
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
  isActive: {
    type: Boolean,
    default: true
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
});

// Update the "updatedAt" field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);