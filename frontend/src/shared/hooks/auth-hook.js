import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

const localStorageUserDataKey = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState();
  const [tokenExp, setTokenExp] = useState();
  const [userId, setUserId] = useState(false);

  //useCallback caches a function
  const login = useCallback((uid, token, tokenExpiration) => {
    setToken(token);
    setTokenExp(tokenExpiration);
    setUserId(uid);
    localStorage.setItem(
      localStorageUserDataKey,
      JSON.stringify({
        userId: uid,
        token,
        tokenExpiration,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExp(null);
    setUserId(null);
    localStorage.removeItem(localStorageUserDataKey);
  }, []);

  //auto log out user when jwt token expires
  useEffect(() => {
    if (token && tokenExp) {
      const remainingTime = tokenExp - new Date().getTime();

      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, token, tokenExp]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(localStorageUserDataKey));

    //if userData exists, then login using stored data
    if (storedData && storedData.token && storedData.tokenExpiration) {
      login(storedData.userId, storedData.token, storedData.tokenExpiration);
    }
  }, [login]);

  return {
    userId,
    token,
    login,
    logout,
  };
};
