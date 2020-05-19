const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // creates index for email
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // image url
  image: {
    type: String,
    required: true
  },
  places: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Place' // model name
    }
  ]
});

// validate that email is unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
