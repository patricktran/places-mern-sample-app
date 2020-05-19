# Places MERN App - NodeJs/Express/MongoDb Back-End

## Available Scripts

### `npm install`

Run this to install project dependencies

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

Uses nodemon to auto restart app when code changes are detected.

## REQUIRED - MongoDB

1. Use your own instance or you can create a free instance at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database and named: mernplaces
3. Create new collection named: places

## REQUIRED: Setup your Environment variables

1. Make a copy of the .env.template file and rename it as .env
2. Add your own unique value for JWT_SECRET_KEY. This can be any value you want and is used to encrypt any JWT tokens generated.
   For more info, refer to [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
3. Add your connection string value for MONGODB_CONNECTION.

## Optional - Enabling Google Maps

1. Sign up and generate an API Key at [Google Maps Platform](https://developers.google.com/maps/documentation/javascript/get-api-key)
2. Alternatively, you can use the same MAPs API Key used for the ReactJs Front-End for this app
3. Open your local .env file
4. Replace the value for GOOGLE_MAPS_API_KEY with your API Key
5. Open util/location.js file and follow the code comments to enable Google Geocoding
