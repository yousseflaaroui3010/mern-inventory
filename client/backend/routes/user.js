const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const auth = require('../middleware/auth');

let User = require('../models/user.model');

// Register user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json('Please enter all fields');
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json('User already exists');
    }

    // Create salt & hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hash
    });

    // Save user
    const savedUser = await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: savedUser._id },
      keys.jwtSecret,
      { expiresIn: 3600 }
    );

    res.json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    });
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json('Please enter all fields');
  }

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json('User does not exist');

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json('Invalid credentials');

    // Create token
    const token = jwt.sign(
      { id: user._id },
      keys.jwtSecret,
      { expiresIn: 3600 }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
});

// Get user data
router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;