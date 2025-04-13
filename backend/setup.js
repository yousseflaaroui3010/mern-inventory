// setup.js
const fs = require('fs');
const path = require('path');

// Define directories to create
const directories = [
  'models',
  'controllers',
  'middleware',
  'routes',
  'uploads'
];

// Create directories
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
});

console.log('Setup completed!');