// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Category = require('./models/categoryModel');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Create admin user and default categories
const createInitialData = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      // Create admin user
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    // Create default categories if they don't exist
    const defaultCategories = [
      'Clothes',
      'Electronics',
      'Books',
      'Accessories',
      'Bags',
      'Beauty',
      'Furniture',
      'Food',
      'Sports',
      'Toys',
      'Other'
    ];

    for (const categoryName of defaultCategories) {
      const categoryExists = await Category.findOne({ name: categoryName });
      if (!categoryExists) {
        await Category.create({ name: categoryName });
        console.log(`Category ${categoryName} created`);
      }
    }

    console.log('Initial data setup completed');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createInitialData();