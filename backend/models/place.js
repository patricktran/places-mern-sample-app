const mongoose = require('mongoose');

const { Schema } = mongoose;

const placeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String, // image url
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User' // model name
  }
});

// mongoDB collection name be lowercased and pluralized
module.exports = mongoose.model('Place', placeSchema);
