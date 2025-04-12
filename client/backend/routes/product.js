const router = require('express').Router();
const auth = require('../middleware/auth');
let Product = require('../models/product.model');

// Get all products
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
});

// Add new product
router.post('/add', auth, async (req, res) => {
  const { name, qty, um, price, weight, description } = req.body;
  
  const newProduct = new Product({
    name,
    qty: Number(qty),
    um,
    price: Number(price),
    weight: Number(weight),
    description,
    userId: req.user.id
  });

  try {
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
});

// Get product by id
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    // Make sure user owns product
    if (product.userId.toString() !== req.user.id) {
      return res.status(401).json('Not authorized');
    }
    
    res.json(product);
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
});

// Update product
router.post('/update/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    // Make sure user owns product
    if (product.userId.toString() !== req.user.id) {
      return res.status(401).json('Not authorized');
    }
    
    product.name = req.body.name;
    product.qty = Number(req.body.qty);
    product.um = req.body.um;
    product.price = Number(req.body.price);
    product.weight = Number(req.body.weight);
    product.description = req.body.description;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    // Make sure user owns product
    if (product.userId.toString() !== req.user.id) {
      return res.status(401).json('Not authorized');
    }
    
    await product.remove();
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
});

module.exports = router;