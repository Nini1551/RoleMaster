const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['username', 'email']
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ where: { email }});
  
    if (!user) {
      return res.status(404).json({ message: 'Incorrect mail'});
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      username: user.username
    });
    } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
    }
  };
