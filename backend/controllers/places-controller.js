const mongoose = require('mongoose');
const fs = require('fs');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const { mapFilePathToServerUrl, mapImageUrlToLocalFilePath } = require('../util/helpers');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError('Something went wrong, could not find place.', 500));
  }

  if (!place) {
    // to use error middleware, you can use throw(Error) or next
    // note that next(error) works with async code
    return next(new HttpError('Could not find place for the provided id.', 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;

  try {
    places = await Place.find({
      creator: userId
    });

    // alernative
    // user = await User.findById(userId).populate('places');
    // acess by using user.places
  } catch (err) {
    return next(new HttpError('Something went wrong, could not find by userid.', 500));
  }

  if (!places.length) {
    return next(new HttpError('Could not find places for the provided userid.', 404)); // return so that last res.json does not also execute
  }

  res.json({ places: places.map((place) => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // instead of throwing, call next so that express correctly handles error from async/await
    return next(new HttpError('Invalid inputs detected, please check your data', 422));
  }

  const { title, description, address } = req.body;
  const { file } = req;
  const { userData } = req;

  const { userId } = userData;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image: mapFilePathToServerUrl(req, file.path),
    creator: userId
  });

  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(new HttpError('Creating place failed, please try again.', 500));
  }

  if (!user) return next(new HttpError('Could not find user for provided id', 404));

  try {
    // Gotcha: all collections referenced in a mongodb transaction must be already created in the db
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({
      session: sess
    });
    // add relationship between place and user
    // push() - wraps Array#push with proper change tracking.
    user.places.push(createdPlace);
    await user.save({
      session: sess
    });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({
    place: createdPlace
  });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs detected, please check your data', 422);
  }

  // only allow updating title, and description
  const { title, description } = req.body;
  const { pid: placeId } = req.params;
  const { userData } = req;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError('Something went wrong, could not find place.', 500));
  }

  // check that the logged in user created this place
  // creator not populated, so must covert mongo relation id toString()
  if (place.creator.toString() !== userData.userId) {
    return next(new HttpError('You are not allowed to update this place.', 401));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update place.', 500));
  }

  res.status(200).json({
    place: place.toObject({ getters: true })
  });
};

const deletePlaceById = async (req, res, next) => {
  const { pid: placeId } = req.params;
  const { userData } = req;

  let place;

  try {
    // populate() - join-like $lookup which lets you reference documents in other collections
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }

  if (!place) {
    return next(new HttpError('Could not find place for this id.', 404));
  }

  // populated creator document, so can use id getter
  if (place.creator.id !== userData.userId) {
    return next(new HttpError('You are not allowed to delete this place.', 401));
  }

  const imageUrl = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({
      session: sess
    });
    // pull()/remove() - Pulls items from the array atomically.
    // remove place reference from creator
    place.creator.places.remove(place);
    await place.creator.save({
      session: sess
    });

    sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }

  // delete locally saved image
  fs.unlink(mapImageUrlToLocalFilePath(req, imageUrl), (err) => {
    console.log(err);
  });

  res.status(200).json({
    message: 'Place deleted'
  });
};

module.exports.getPlaceById = getPlaceById;
module.exports.getPlacesByUserId = getPlacesByUserId;
module.exports.createPlace = createPlace;
module.exports.updatePlaceById = updatePlaceById;
module.exports.deletePlaceById = deletePlaceById;
