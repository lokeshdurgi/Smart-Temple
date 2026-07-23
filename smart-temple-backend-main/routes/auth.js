const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {

try {

   
const { name, email, password } = req.body;

const existingUser = await User.findOne({ email });

if (existingUser) {
  return res.status(400).json({
    message: 'User already exists',
  });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = new User({
  name,
  email,
  password: hashedPassword,
});

await user.save();

res.json({
  message: 'User Registered Successfully',
});
   

} catch (err) {

   
console.log(err);

res.status(500).json({
  message: 'Registration failed',
});
   

}
});

// LOGIN
router.post('/login', async (req, res) => {

try {

   
const { email, password } = req.body;

const user = await User.findOne({ email });

if (!user) {
  return res.status(400).json({
    message: 'User not found',
  });
}

const isMatch = await bcrypt.compare(
  password,
  user.password
);

if (!isMatch) {
  return res.status(400).json({
    message: 'Invalid password',
  });
}

const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '7d',
  }
);

res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    profileImage: user.profileImage || '',
    role: user.role,
  },
});
   

} catch (err) {

   
console.log('LOGIN ERROR:', err);

res.status(500).json({
  message: 'Login failed',
});
   

}
});

// GET PROFILE
router.get('/profile/:email', async (req, res) => {

try {


const user = await User.findOne({
  email: req.params.email,
});

if (!user) {
  return res.status(404).json({
    message: 'User not found',
  });
}

res.json(user);
   

} catch (err) {

   
console.log(err);

res.status(500).json({
  message: 'Server error',
});
   

}
});

// UPDATE PROFILE
router.put('/profile/:email', async (req, res) => {

try {

   
const user = await User.findOne({
  email: req.params.email,
});

if (!user) {
  return res.status(404).json({
    message: 'User not found',
  });
}

user.name = req.body.name || user.name;
user.phone = req.body.phone || user.phone;

if (req.body.profileImage) {
  user.profileImage = req.body.profileImage;
}

await user.save();

res.json({
  message: 'Profile updated',
  user,
});
   

} catch (err) {

   
console.log('PROFILE UPDATE ERROR:', err);

res.status(500).json({
  message: 'Server error',
});
   

}
});

module.exports = router;
