const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const { mapFilePathToServerUrl, generateJwt } = require('../util/helpers');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password'); // use projection and exclude `password` from results
  } catch (err) {
    return next(new HttpError('Retrieving users failed.', 500));
  }

  res.json({
    users: users.map((user) => user.toObject({ getters: true }))
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs detected, please check your data.', 422));
  }

  const { name, email, password } = req.body;
  const { file } = req;
  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again later.', 500));
  }

  if (existingUser) return next(new HttpError('User exists already, please login instead.', 422));

  // in Production, signup/login page should use HTTPS
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError('Could not create user, please try again', 500));
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    image: mapFilePathToServerUrl(req, file.path),
    places: []
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again later.', 500));
  }

  // generate jwt
  let token;
  try {
    token = generateJwt({
      userId: newUser.id,
      email: newUser.email
    });
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again later.', 500));
  }

  res.status(201).json({
    user: {
      id: newUser.id,
      email: newUser.email,
      token
    }
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError('Logging in failed, please try again later.', 500));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(new HttpError('Could not log you in, please try again', 500));
  }

  if (!isValidPassword) {
    return next(new HttpError('Invalid credentials, could not log you in.', 403));
  }

  // generate jwt
  let tokenObj;
  try {
    tokenObj = generateJwt({
      userId: existingUser.id,
      email: existingUser.email
    });
  } catch (err) {
    return next(new HttpError('Logging in failed, please try again later.', 500));
  }

  res.json({
    user: {
      id: existingUser.id,
      email: existingUser.email,
      token: tokenObj
    }
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
