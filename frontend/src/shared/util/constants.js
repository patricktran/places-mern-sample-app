const backendHost = process.env.REACT_APP_BACKEND_HOST;

const endpoints = {
  login: `${backendHost}/api/users/login`,
  signup: `${backendHost}/api/users/signup`,
  users: `${backendHost}/api/users`,
  createPlace: `${backendHost}/api/places`,
  /** append userId */
  userPlaces: `${backendHost}/api/places/user/`,
  /** append placeId - used for 'GET', 'PATCH', 'DELETE' requests */
  placeById: `${backendHost}/api/places/`,
};

export { endpoints };
