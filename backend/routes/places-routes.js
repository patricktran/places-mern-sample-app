const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const fileImageUpload = require('../middleware/file-image-upload');
const placesController = require('../controllers/places-controller');

// IMPORTANT - ROUTE ORDER MATTERS - each route is middleware

// note, this route handles all values even if pid is not a valid
router.get('/:pid', placesController.getPlaceById);

router.get('/user/:uid', placesController.getPlacesByUserId);

// add following middleware for all routes below
router.use(checkAuth);

// add middleware for this post
router.post(
  '/',
  fileImageUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({
      min: 5
    }),
    check('address').not().isEmpty()
  ],
  placesController.createPlace
);

router.patch(
  '/:pid',
  [
    check('title').not().isEmpty(),
    check('description').isLength({
      min: 5
    })
  ],
  placesController.updatePlaceById
);

router.delete('/:pid', placesController.deletePlaceById);

// similar to export default
module.exports = router;
