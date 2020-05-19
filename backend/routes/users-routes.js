const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const usersController = require('../controllers/users-controller');
const fileImageUpload = require('../middleware/file-image-upload');

// IMPORTANT - ROUTE ORDER MATTERS - each route is middleware

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  // add middleware for this route
  fileImageUpload.single('image'), // key for the file in the multipart/form-data
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({
      min: 6
    })
    // check('image').not().isEmpty()
  ],
  usersController.signup
);

router.post('/login', usersController.login);

// similar to export default
module.exports = router;
