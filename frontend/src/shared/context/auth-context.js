import { createContext } from 'react';

//init
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
});
