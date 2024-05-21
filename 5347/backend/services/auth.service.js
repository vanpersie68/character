const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userlist'); 
const createHttpError = require('http-errors');

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_jwt_secret';

exports.verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Failed to verify token:', error);
    throw createHttpError(401, 'Invalid token');
  }
};

exports.createUser = async ({ firstname, lastname, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ firstname, lastname, email, password: hashedPassword });
  await newUser.save();
  return newUser;
};

exports.signUser = async (email, password) => {
  const user = await User.findByEmail(email);
  if (user && await bcrypt.compare(password, user.password)) {
    console.log('Password is correct, returning user');
    return user;
  } else {
    console.log('Invalid credentials, throwing error');
    throw new Error('Invalid credentials');
  }

  console.log('After if-else block');
};
