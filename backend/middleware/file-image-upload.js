const multer = require('multer');
const { v4: uuid } = require('uuid');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

// return a preconfiged multer middleware
const fileImageUpload = multer({
  // limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'upload/images');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, `${uuid()}.${ext}`);
    },
    // server side validation
    fileFilter: (req, file, cb) => {
      const isValid = !!MIME_TYPE_MAP[file.mimetype];
      const error = isValid ? null : new Error('Invalid mime type.');

      cb(error, isValid);
    }
  })
});

module.exports = fileImageUpload;
