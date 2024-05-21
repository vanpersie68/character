const jwt = require('jsonwebtoken');
const createHttpError = require("http-errors");
const { createUser, signUser } = require("../services/auth.service");
const { getUserById } = require("../services/userlist.service");
const UserlistModel = require('../models/userlist'); 

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_secret_key_here';

exports.register = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    // Check whether the mailbox already exists
    const existingUser = await UserlistModel.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }
    const newUser = await createUser({ firstname, lastname, email, password });
    const token = jwt.sign({ userId: newUser._id }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    // Creates a new user object without the password field
    const userWithoutPassword = {
      _id: newUser._id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
    };
    
    res.status(201).json({ message: "User registered successfully", user: userWithoutPassword, token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login request body:', req.body);
    
    const user = await signUser(email, password);
    const token = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    const userWithData = await getUserById(user._id);

    res.json({
      message: "User logged in successfully",
      user: {
        _id: userWithData._id,
        firstname: userWithData.firstname,
        lastname: userWithData.lastname,
        email: userWithData.email,
        favorites: userWithData.favorites,
        contributions: userWithData.contributions,
      },
      token,
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      next(createHttpError(401, "Invalid credentials"));
    } else {
      next(error);
    }
  }
};
