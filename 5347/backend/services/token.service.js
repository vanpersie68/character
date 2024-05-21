const jwt = require('jsonwebtoken');
const createHttpError = require("http-errors");
const { createUser, signUser } = require("../services/auth.service");

// Make sure the environment variable ACCESS_TOKEN_SECRET is set
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_secret_key_here';

exports.register = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const newUser = await createUser({ firstname, lastname, email, password });
    const token = jwt.sign({ userId: newUser._id }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: "User registered successfully", user: newUser, token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await signUser(email, password);
    const token = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    res.json({ message: "User logged in successfully", user, token });
  } catch (error) {
    next(createHttpError(401, "Invalid credentials"));
  }
};
