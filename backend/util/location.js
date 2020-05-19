const axios = require('axios');
const HttpError = require('../models/http-error');

// set in .env file
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function getCoordsForAddress(address) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        lat: 40.7484474,
        lng: -73.9871516
      });
    }, 1000);
  });

  // enable the below code and comment out the Promise code above if you have a Google API key and billing set up
  // const response = await axios.get(
  //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //     address
  //   )}&key=${API_KEY}`
  // );

  // const { data } = response;

  // // https://developers.google.com/maps/documentation/geocoding/intro#StatusCodes
  // if (!data || data.status === 'ZERO_RESULTS') {
  //   throw new HttpError('Could not find location for specified address.', 422);
  // }

  // console.log('data', data);
  // // https://developers.google.com/maps/documentation/geocoding/start
  // return data.results[0].geometry.location;
}

module.exports = getCoordsForAddress;
