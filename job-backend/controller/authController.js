const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register user
// Register user
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      preferredJobCategory,
      mobileNumber,
      email,
      password,
      confirmPassword
    } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user
    const newUser = new User({
      fullName,
      preferredJobCategory,
      mobileNumber,
      email,
      password,
      confirmPassword, // This will be saved now, but usually not stored in DB
      role: 'user'
    });

    await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '5d' }
    );

    // Send response
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        preferredJobCategory: newUser.preferredJobCategory,
        mobileNumber: newUser.mobileNumber,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};
// Login user
const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email or mobileNumber

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/Phone and password are required' });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobileNumber: identifier }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '5d' }
    );

    // Send response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        preferredJobCategory: user.preferredJobCategory,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = {
  registerUser,
  loginUser
};
