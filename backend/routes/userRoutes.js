// routes/productRoutes.js
const express = require('express');
const router = express.Router();

// Temporary routes for testing
router.get('/', (req, res) => {
  res.json({ message: 'Get all products' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create product', data: req.body });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get product with id ${req.params.id}` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update product with id ${req.params.id}`, data: req.body });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete product with id ${req.params.id}` });
});

module.exports = router;