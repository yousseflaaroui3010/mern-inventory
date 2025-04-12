const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please specify transaction type'],
    enum: ['restock', 'sale', 'adjustment', 'return', 'transfer']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Please specify product']
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify quantity'],
    validate: {
      validator: function(val) {
        return val !== 0;
      },
      message: 'Quantity cannot be zero'
    }
  },
  unitPrice: {
    type: Number,
    required: [true, 'Please specify unit price'],
    min: [0, 'Unit price cannot be negative']
  },
  total: {
    type: Number,
    required: [true, 'Please specify total']
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify user']
  }
});

// Calculate total before saving
transactionSchema.pre('save', function(next) {
  if (this.quantity && this.unitPrice) {
    this.total = Math.abs(this.quantity) * this.unitPrice;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);